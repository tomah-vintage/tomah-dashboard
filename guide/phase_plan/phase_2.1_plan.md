# Tomah Dashboard Development Plan - Phase 2.1: Token Auto-Refresh (Revised)

This document outlines the revised development plan for implementing a token refresh mechanism that securely proxies requests to an external authentication server.

---

## 1. Phase Objective & Key Features

**Objective**: To prevent session interruptions by automatically and securely refreshing expired access tokens via an external endpoint. This ensures users remain logged in without being forced to re-authenticate.

**External Endpoint**: `https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/token/refresh/`

### Functional Requirements:
- **Expired Token Detection**: The application must detect a `401 Unauthorized` response from an API request.
- **Secure Proxy**: A backend endpoint is required to act as a secure proxy. It will receive a request from our client, extract the `HttpOnly` refresh token cookie, and forward it to the external refresh API.
- **Automated Refresh**: The client-side must automatically call the backend proxy upon detecting an expired token.
- **Request Retrying**: After a successful refresh, the original failed request must be retried with the new token.
- **Logout on Failure**: If the refresh fails, the user must be logged out.

---

## 2. Technical Implementation Plan

This plan uses a client-side `fetch` interceptor which calls a local, server-side proxy endpoint.

### Step 2.1: File Structure Setup

Create the new files required for this feature.

```
src/
├── lib/
│   └── utils/
│       └── api.ts       # Custom fetch wrapper for API calls
└── routes/
    └── api/
        └── auth/
            └── refresh/
                └── +server.ts # Secure server-side proxy to the external refresh API
```

### Step 2.2: Create the Server-Side Proxy Endpoint

This endpoint acts as a secure bridge between our client and the external authentication server.

**File**: `src/routes/api/auth/refresh/+server.ts`
- **`POST` Handler Logic**:
  1.  Extract the `HttpOnly` refresh token from the cookie of the incoming request (sent from our client).
  2.  Make a `POST` request to the external URL (`https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/token/refresh/`), including the refresh token in the appropriate header or body as required by the external API.
  3.  Receive the response from the external API.
  4.  If the external call is successful:
      - Extract the new access and refresh tokens from the response.
      - Set these new tokens in the browser's cookies using the `Set-Cookie` header in the response back to our client. Ensure they are secure and `HttpOnly`.
      - Forward the success response (e.g., `200 OK`) to our client.
  5.  If the external call fails (e.g., `401 Unauthorized`):
      - Clear the session cookies.
      - Forward the failure response to our client.

### Step 2.3: Create a Custom Fetch Wrapper

This utility will intercept all outgoing API requests to handle token expiration and refreshing centrally.

**File**: `src/lib/utils/api.ts`
- **Export `apiFetch` function**:
  1.  This function will wrap the standard `fetch` API.
  2.  It will check the response of every API call. If the status is `401 Unauthorized`, it will trigger the refresh flow.
  3.  **Refresh Logic**:
      - Call our own backend proxy: `POST /api/auth/refresh`.
      - If the proxy call is successful, it means new tokens have been set in the browser's cookies.
      - It will then re-run the original, failed request. The browser will automatically send the new access token cookie with this new request.
  4.  **Refresh Failure**:
      - If the call to our proxy fails, it means the refresh token was invalid. The function will then programmatically redirect the user to `/login`.
  5.  **Concurrency Management**: Implement a mechanism to prevent multiple, simultaneous refresh calls.

### Step 2.4: Integrate the `apiFetch` Wrapper

Refactor all existing and future client-side data fetching logic throughout the application to use the new `apiFetch` utility instead of the standard `fetch`.

---

## 3. Acceptance Criteria & Checklist

- [ ] A proxy endpoint at `/api/auth/refresh` is created.
- [ ] The proxy correctly receives a request, extracts the refresh token, and calls the external refresh API.
- [ ] The proxy correctly handles both success and failure responses from the external API, updating cookies appropriately.
- [ ] A custom `apiFetch` wrapper is created in `src/lib/utils/api.ts`.
- [ ] `apiFetch` correctly detects a `401`, calls the local proxy, and retries the original request upon success.
- [ ] The user is logged out if the refresh process fails.
- [ ] All relevant parts of the application are updated to use `apiFetch`.