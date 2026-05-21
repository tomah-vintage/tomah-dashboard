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

async function refreshToken(customFetch: CustomFetch): Promise<string | null> {
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

  // The refresh endpoint returns the new access token in the body so we can
  // update the Authorization header immediately without waiting for the browser
  // to apply the Set-Cookie header from the response.
  try {
    const data = await response.json();
    return data.access ?? null;
  } catch {
    return null;
  }
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
  let newToken: string | null = null;

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken(customFetch).then((token) => { newToken = token; });
      await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;
    } else if (refreshPromise) {
      await refreshPromise;
    }

    // Build retry headers — use the freshly-issued token if available so we
    // don't re-send the expired token that caused the 401.
    const retryHeaders = getHeaders();
    if (newToken) {
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
    }
    response = await customFetch(url, { ...requestOptions, headers: retryHeaders });
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
