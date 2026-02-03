import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { logger } from "$lib/utils/logger";
import {
  handleError,
  ValidationError,
  parseErrorResponse,
} from "$lib/utils/errors";

const EXTERNAL_LOGIN_URL = `${PUBLIC_BACKEND_URL}/api/token/`;

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      const validationError = new ValidationError(
        "Email and password are required.",
        {
          email: !email ? ["Email is required"] : [],
          password: !password ? ["Password is required"] : [],
        },
      );
      logger.warn("Login validation failed", {
        context: "auth_login",
        errors: validationError.errors,
      });
      return json(
        { message: validationError.message, errors: validationError.errors },
        { status: 400 },
      );
    }

    // Call external login API
    const response = await fetch(EXTERNAL_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const apiError = await parseErrorResponse(response);
      logger.error("External login API failed", apiError, {
        context: "auth_login",
        email,
      });
      return json(
        { message: JSON.stringify(apiError.message) },
        { status: apiError.statusCode },
      );
    }

    const data = await response.json();

    // Set HttpOnly cookies for security
    cookies.set("session", data.access, {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: true, // Require HTTPS
      maxAge: 60 * 60 * 24, // 1 day
    });

    cookies.set("refreshToken", data.refresh, {
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: true, // Require HTTPS
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Return success (no tokens in response body)
    return json({
      message: "Login successful",
      access: data.access, // Still return for immediate use
    });
  } catch (err) {
    const errorInfo = handleError(err, "auth_login");
    return json(
      { message: JSON.stringify(errorInfo.message) },
      { status: errorInfo.statusCode || 500 },
    );
  }
};
