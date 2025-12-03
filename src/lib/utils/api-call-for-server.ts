import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { base } from "$app/paths";
import { logger } from "./logger";
import { AuthenticationError, parseErrorResponse } from "./errors";

// A simple in-memory flag and promise to handle concurrent requests.
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

type CustomFetch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
) => Promise<Response>;

async function refreshToken(customFetch: CustomFetch): Promise<void> {
  const response = await customFetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    logger.warn(
      "Token refresh failed in server context, redirecting to login",
      {
        context: "server_token_refresh",
        status: response.status,
      },
    );

    if (browser) {
      await goto(`${base}/login`);
    }
    throw new AuthenticationError("Failed to refresh token", response.status);
  }

  logger.debug("Token refreshed successfully in server context", {
    context: "server_token_refresh",
  });
}

async function fetchWithRefresh<T>(
  customFetch: CustomFetch,
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const getHeaders = (): Headers => {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    return headers;
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: getHeaders(),
    credentials: "include", // Send cookies to proxy endpoint
  };

  let response = await customFetch(url, requestOptions);

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken(customFetch);
      await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      response = await customFetch(url, {
        ...requestOptions,
        headers: getHeaders(),
      });
    } else if (refreshPromise) {
      // Wait for the ongoing refresh to complete
      await refreshPromise;
      // Retry the original request with the new token
      requestOptions.headers = getHeaders();
      response = await customFetch(url, requestOptions);
    }
  }

  if (!response.ok) {
    // Handle other errors
    const apiError = await parseErrorResponse(response);

    logger.error("Server API request failed", apiError, {
      context: "server_api_fetch",
      url,
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

export const serverApiFetch = fetchWithRefresh;
