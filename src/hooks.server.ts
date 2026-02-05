import { redirect, error, type Handle, type RequestEvent } from "@sveltejs/kit";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { User } from "$lib/types/auth";
import { memoryCache } from "$lib/cache/memory-cache";
import { withDbCache } from "$lib/cache/db-cache";
import { startPeriodicCacheLogging } from "$lib/cache/monitoring";
import { generateCsrfToken, validateCsrfToken } from "$lib/utils/csrf";
import { logger } from "$lib/utils/logger";
import { handleError, AuthenticationError } from "$lib/utils/errors";

// --- Cache Warming and Graceful Shutdown ---

/**
 * Pre-fills the cache with essential data on application startup.
 */
async function warmCacheOnStartup() {
  // Example: Warm the 'users:all' database cache
  await withDbCache(
    { key: "users:all", tags: ["users"], ttl: 60000 },
    async () => {
      // In a real app, you'd fetch this from the actual database
      return Promise.resolve([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
    },
  );
}

// Run cache warming once on server start
warmCacheOnStartup().catch((err) => {
  logger.error("Error during cache warming", err, { context: "cache_warming" });
});

// Start periodic logging in development
startPeriodicCacheLogging();

/**
 * Handles graceful shutdown by stopping the cache cleanup interval.
 */
function gracefulShutdown() {
  logger.info("Gracefully shutting down. Stopping cache cleanup...", {
    context: "shutdown",
  });
  memoryCache.stopCleanup();
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown); // Catches Ctrl+C
process.on("SIGTERM", gracefulShutdown); // Catches kill commands

// --- Existing Authentication Logic ---

const EXTERNAL_REFRESH_URL = `${PUBLIC_BACKEND_URL}/api/token/refresh/`;

async function refreshSession(event: RequestEvent): Promise<string | null> {
  const refreshToken = event.cookies.get("refreshToken");

  logger.info("Attempting token refresh", {
    context: "token_refresh",
    hasRefreshToken: !!refreshToken,
    refreshTokenLength: refreshToken?.length,
  });

  if (!refreshToken) {
    logger.warn("No refresh token available", { context: "token_refresh" });
    return null;
  }

  try {
    const response = await event.fetch(EXTERNAL_REFRESH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    logger.info("Refresh API response", {
      context: "token_refresh",
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error("Refresh failed", new Error(errorBody), {
        context: "token_refresh",
        status: response.status,
      });
      event.cookies.delete("refreshToken", { path: "/" });
      event.cookies.delete("session", { path: "/" });
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access;

    event.cookies.set("session", newAccessToken, {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24, // 1 day
    });

    return newAccessToken;
  } catch (err) {
    const errorInfo = handleError(err, "token_refresh");
    logger.error("An internal error occurred during token refresh", err, {
      context: "token_refresh",
      hasRefreshToken: !!refreshToken,
      statusCode: errorInfo.statusCode,
    });
    return null;
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  // Generate CSRF token for each session if not present
  if (!event.cookies.get("csrf_token")) {
    const csrfToken = generateCsrfToken();
    event.cookies.set("csrf_token", csrfToken, {
      path: "/",
      httpOnly: false, // Client needs to read this
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });
  }

  // Validate CSRF token for state-changing requests
  const method = event.request.method;
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    // Exclude login and refresh endpoints from CSRF validation
    // (users don't have CSRF token yet when logging in)
    const isAuthEndpoint =
      event.route.id?.includes("/api/auth/login") ||
      event.route.id?.includes("/api/auth/refresh");

    if (!isAuthEndpoint) {
      const csrfCookie = event.cookies.get("csrf_token");
      let csrfToken = event.request.headers.get("x-csrf-token");

      // For form submissions (SvelteKit form actions), check form data for CSRF token
      const contentType = event.request.headers.get("content-type") || "";
      const isFormSubmission =
        contentType.includes("multipart/form-data") ||
        contentType.includes("application/x-www-form-urlencoded");

      if (!csrfToken && isFormSubmission) {
        // Clone the request to read form data without consuming it
        const clonedRequest = event.request.clone();
        try {
          const formData = await clonedRequest.formData();
          csrfToken = formData.get("csrf_token") as string | null;
        } catch {
          // If form data parsing fails, csrfToken remains null
        }
      }

      if (!validateCsrfToken(csrfCookie, csrfToken)) {
        throw error(403, "CSRF validation failed");
      }
    }
  }

  let sessionId = event.cookies.get("session");
  const refreshToken = event.cookies.get("refreshToken");

  // Debug logging for auth issues
  logger.info("Auth debug", {
    context: "auth_debug",
    route: event.route.id,
    hasSessionCookie: !!sessionId,
    sessionLength: sessionId?.length,
    sessionPreview: sessionId ? `${sessionId.substring(0, 20)}...${sessionId.substring(sessionId.length - 20)}` : null,
    hasRefreshToken: !!refreshToken,
  });

  if (sessionId) {
    try {
      let userResponse = await event.fetch(`${PUBLIC_BACKEND_URL}/api/me/`, {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      logger.info("API /me/ response", {
        context: "auth_debug",
        status: userResponse.status,
      });

      if (userResponse.status === 401) {
        logger.info("Token expired, attempting refresh", { context: "auth_debug" });
        const newSessionId = await refreshSession(event);
        logger.info("Refresh result", { context: "auth_debug", success: !!newSessionId });
        if (newSessionId) {
          sessionId = newSessionId;
          userResponse = await event.fetch(`${PUBLIC_BACKEND_URL}/api/me/`, {
            headers: {
              Authorization: `Bearer ${sessionId}`,
            },
          });
        } else {
          event.locals.user = undefined;
        }
      }

      if (userResponse.ok) {
        const user: User = await userResponse.json();
        event.locals.user = {
          ...user,
          name: `${user.first_name} ${user.last_name}`,
          restaurantId: user.restaurant?.id, // Assign restaurantId
        };
      } else {
        event.locals.user = undefined;
      }
    } catch (err) {
      const errorInfo = handleError(err, "user_fetch");
      logger.error("Failed to fetch user", err, {
        context: "user_fetch",
        route: event.route.id,
        statusCode: errorInfo.statusCode,
      });
      event.locals.user = undefined;
    }
  }

  // Protect routes within (pladmin) or (rsadmin) route groups
  if (
    event.route.id?.includes("(pladmin)") ||
    event.route.id?.includes("(rsadmin)")
  ) {
    if (!event.locals.user) {
      const redirectUrl = `/login?redirectTo=${event.url.pathname}`;
      throw redirect(303, redirectUrl);
    }
  }

  return resolve(event);
};
