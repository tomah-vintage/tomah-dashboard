import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { logger } from "$lib/utils/logger";
import {
  handleError,
  AuthenticationError,
  parseErrorResponse,
} from "$lib/utils/errors";

const EXTERNAL_REFRESH_URL = `${PUBLIC_BACKEND_URL}/api/token/refresh/`;

export const POST: RequestHandler = async ({ cookies }) => {
  const refreshToken = cookies.get("refreshToken"); // Assuming the cookie is named 'refreshToken'

  if (!refreshToken) {
    const authError = new AuthenticationError("Refresh token not found.", 401);
    logger.warn("Refresh token not found in cookies", {
      context: "auth_refresh",
    });
    return json(
      { message: authError.message },
      { status: authError.statusCode },
    );
  }

  try {
    const response = await fetch(EXTERNAL_REFRESH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const apiError = await parseErrorResponse(response);
      logger.error("Failed to refresh token from external source", apiError, {
        context: "auth_refresh",
      });
      // Only clear cookies if the token is actually invalid (4xx), not if the backend
      // is temporarily unavailable (5xx) — a 500 should not log the user out.
      if (response.status < 500) {
        cookies.delete("refreshToken", { path: "/" });
        cookies.delete("session", { path: "/" });
      }
      return json(
        { message: apiError.message },
        { status: apiError.statusCode },
      );
    }

    const data = await response.json();
    const newAccessToken = data.access;

    cookies.set("session", newAccessToken, {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24,
    });

    // Return the new access token so server-side callers can use it immediately
    // in the same request (cookie propagation is async to the browser).
    return json({ message: "Token refreshed successfully.", access: newAccessToken });
  } catch (err) {
    const errorInfo = handleError(err, "auth_refresh");
    return json(
      { message: errorInfo.message },
      { status: errorInfo.statusCode || 500 },
    );
  }
};
