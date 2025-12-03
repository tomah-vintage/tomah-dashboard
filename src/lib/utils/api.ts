import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { getCsrfToken } from "./csrf";
import { logger } from "./logger";
import { AuthenticationError, parseErrorResponse } from "./errors";

// A simple in-memory flag and promise to handle concurrent requests.
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshToken(): Promise<void> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include", // Send httpOnly cookies
  });

  if (!response.ok) {
    logger.warn("Token refresh failed, redirecting to login", {
      context: "token_refresh",
      status: response.status,
      pathname: browser ? window.location.pathname : undefined,
    });

    if (browser) {
      const redirectTo = window.location.pathname;
      await goto(`${base}/login?redirectTo=${redirectTo}`);
    }
    throw new AuthenticationError("Failed to refresh token", response.status);
  }

  logger.debug("Token refreshed successfully", { context: "token_refresh" });
}

/**
 * Converts backend API URL to proxy URL
 * Example: https://backend.com/api/menu-items -> /api/proxy/menu-items
 */
function toProxyUrl(url: string): string {
  // If it's already a relative URL, return as is
  if (url.startsWith("/")) {
    return url;
  }

  // If it's a backend URL, convert to proxy
  if (url.startsWith(PUBLIC_BACKEND_URL)) {
    const path = url.replace(PUBLIC_BACKEND_URL, "").replace(/^\/api\//, "");
    return `/api/proxy/${path}`;
  }

  // Otherwise return as is
  return url;
}

async function fetchWithRefresh<T>(
  url: string,
  options: RequestInit = {},
  type: "request" | "file" = "request",
): Promise<T> {
  // Convert to proxy URL if it's a backend URL
  const proxyUrl = toProxyUrl(url);

  const getHeaders = (): Headers => {
    const headers = new Headers(options.headers);
    if (type === "request") {
      headers.set("Content-Type", "application/json");
    }

    // Add CSRF token for state-changing requests
    const method = (options.method || "GET").toUpperCase();
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers.set("x-csrf-token", csrfToken);
      }
    }

    return headers;
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: getHeaders(),
    credentials: "include", // Automatically send httpOnly cookies
  };

  let response = await fetch(proxyUrl, requestOptions);

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken();
      await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      // Retry with refreshed token (cookies updated by server)
      response = await fetch(proxyUrl, requestOptions);
    } else if (refreshPromise) {
      // Wait for the ongoing refresh to complete
      await refreshPromise;
      // Retry the original request with the new token
      response = await fetch(proxyUrl, requestOptions);
    }
  }

  if (!response.ok) {
    // Handle other errors
    const apiError = await parseErrorResponse(response);

    logger.error("API request failed", apiError, {
      context: "api_fetch",
      url: proxyUrl,
      method: options.method || "GET",
    });

    throw apiError;
  }

  // Handle responses with no content
  const contentType = response.headers.get("content-type");
  if (
    response.status === 204 ||
    !contentType ||
    !contentType.includes("application/json")
  ) {
    return Promise.resolve() as Promise<T>;
  }

  return response.json() as Promise<T>;
}

export const apiFetch = fetchWithRefresh;
