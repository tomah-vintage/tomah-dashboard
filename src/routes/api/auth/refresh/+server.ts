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
      // If the external API fails, clear the cookie and return an error
      const apiError = await parseErrorResponse(response);
      logger.error("Failed to refresh token from external source", apiError, {
        context: "auth_refresh",
      });
      cookies.delete("refreshToken", { path: "/" });
      cookies.delete("session", { path: "/" });
      return json(
        { message: apiError.message },
        { status: apiError.statusCode },
      );
    }

    const data = await response.json();

    // Assuming the external API returns new tokens named 'access' and 'refresh'
    const newAccessToken = data.access;

    // Set the new tokens in HttpOnly cookies for security
    cookies.set("session", newAccessToken, {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: true, // Require HTTPS
      maxAge: 60 * 60 * 24, // 1 day
    });

    return json({ message: "Token refreshed successfully." });
  } catch (err) {
    const errorInfo = handleError(err, "auth_refresh");
    return json(
      { message: errorInfo.message },
      { status: errorInfo.statusCode || 500 },
    );
  }
};
