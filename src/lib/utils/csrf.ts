/**
 * CSRF Token Utility
 * Handles CSRF token generation and validation
 */

/**
 * Gets the CSRF token from cookies (client-side)
 * The CSRF token is stored in a non-httpOnly cookie so JavaScript can read it
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Generates a random CSRF token
 * Used on the server side
 */
export function generateCsrfToken(): string {
  // Generate a random 32-byte token
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates CSRF token
 * Compares the token from cookie with the token from header
 */
export function validateCsrfToken(cookieToken: string | undefined, headerToken: string | null): boolean {
  if (!cookieToken || !headerToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(cookieToken, headerToken);
}

/**
 * Timing-safe string comparison
 * Prevents timing attacks by ensuring comparison takes constant time
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
