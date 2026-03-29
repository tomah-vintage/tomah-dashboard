import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { logger } from "$lib/utils/logger";
import { handleError } from "$lib/utils/errors";

/**
 * Generic API proxy that forwards requests to the backend API
 * with authentication from httpOnly cookies
 */
export const GET: RequestHandler = async ({
  params,
  cookies,
  url,
  request,
}) => {
  return proxyRequest("GET", params.path, cookies.get("session"), url, request);
};

export const POST: RequestHandler = async ({
  params,
  cookies,
  url,
  request,
}) => {
  return proxyRequest(
    "POST",
    params.path,
    cookies.get("session"),
    url,
    request,
  );
};

export const PUT: RequestHandler = async ({
  params,
  cookies,
  url,
  request,
}) => {
  return proxyRequest("PUT", params.path, cookies.get("session"), url, request);
};

export const PATCH: RequestHandler = async ({
  params,
  cookies,
  url,
  request,
}) => {
  return proxyRequest(
    "PATCH",
    params.path,
    cookies.get("session"),
    url,
    request,
  );
};

export const DELETE: RequestHandler = async ({
  params,
  cookies,
  url,
  request,
}) => {
  return proxyRequest(
    "DELETE",
    params.path,
    cookies.get("session"),
    url,
    request,
  );
};

async function proxyRequest(
  method: string,
  path: string,
  sessionToken: string | undefined,
  url: URL,
  request: Request,
): Promise<Response> {
  // Add trailing slash for Django (frontend strips it to avoid Vercel 308 redirects)
  const backendUrl = `${PUBLIC_BACKEND_URL}/api/${path}/${url.search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header from httpOnly cookie
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  // Forward other headers if needed
  const contentType = request.headers.get("content-type");
  if (contentType && contentType !== "application/json") {
    headers["Content-Type"] = contentType;
  }

  // Note: CSRF token validation already happened in hooks.server.ts
  // We don't need to forward it to the backend API

  let body: any = undefined;
  if (method !== "GET" && method !== "DELETE") {
    // Get request body
    const contentTypeHeader = request.headers.get("content-type") || "";
    if (contentTypeHeader.includes("application/json")) {
      body = await request.text();
    } else if (contentTypeHeader.includes("multipart/form-data")) {
      // For file uploads, forward the FormData
      body = await request.formData();
      delete headers["Content-Type"]; // Let fetch set the boundary
    }
  }

  try {
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    // Forward the response
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      // Don't forward certain headers
      // Exclude Content-Length as SvelteKit will set it correctly based on the actual response body
      if (
        !["set-cookie", "cookie", "content-length"].includes(key.toLowerCase())
      ) {
        responseHeaders[key] = value;
      }
    });

    // Handle different content types
    const responseContentType = response.headers.get("content-type");
    if (responseContentType?.includes("application/json")) {
      const data = await response.json();
      return json(data, {
        status: response.status,
        headers: responseHeaders,
      });
    } else if (response.status === 204 || response.status === 205) {
      return new Response(null, {
        status: response.status,
        headers: responseHeaders,
      });
    } else {
      // For other content types (images, files, etc.)
      const blob = await response.blob();
      return new Response(blob, {
        status: response.status,
        headers: responseHeaders,
      });
    }
  } catch (err) {
    const errorInfo = handleError(err, "api_proxy");
    logger.error("Proxy request failed", err, {
      context: "api_proxy",
      method,
      path,
      backendUrl,
    });
    throw error(errorInfo.statusCode || 500, errorInfo.message);
  }
}
