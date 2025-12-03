import { createMutation } from "@tanstack/svelte-query";
import type { UserCredentials } from "$lib/types/auth";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { logger } from "$lib/utils/logger";
import { parseErrorResponse, AuthenticationError } from "$lib/utils/errors";

// Login - Now uses server endpoint that sets HttpOnly cookies
export const createLoginMutation = () => {
  return createMutation<
    { access: string; message: string },
    Error,
    UserCredentials
  >({
    mutationFn: async (credentials) => {
      logger.debug("Attempting login", {
        context: "auth_login",
        username: credentials.username,
      });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const apiError = await parseErrorResponse(response);
        logger.error("Login failed", apiError, {
          context: "auth_login",
          username: credentials.username,
        });
        throw new AuthenticationError(apiError.message, response.status);
      }

      logger.info("Login successful", {
        context: "auth_login",
        username: credentials.username,
      });

      return response.json();
    },
  });
};

// Refresh token
export const createRefreshTokenMutation = () => {
  return createMutation<{ access: string }, Error, { refresh: string }>({
    mutationFn: async ({ refresh }) => {
      logger.debug("Attempting token refresh", { context: "auth_refresh" });

      const response = await fetch(`${PUBLIC_BACKEND_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) {
        const apiError = await parseErrorResponse(response);
        logger.error("Token refresh failed", apiError, {
          context: "auth_refresh",
        });
        throw new AuthenticationError(apiError.message, response.status);
      }

      logger.debug("Token refresh successful", { context: "auth_refresh" });
      return response.json();
    },
  });
};
