import { createMutation } from '@tanstack/svelte-query';
import type { UserCredentials} from '$lib/types/auth';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

// Login
export const createLoginMutation = () => {
  return createMutation<{ access: string; refresh: string }, Error, UserCredentials>({
    mutationFn: async (credentials) => {
      const response = await fetch(`${PUBLIC_BACKEND_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to login');
      }
      return response.json();
    },
  });
};

// Refresh token
export const createRefreshTokenMutation = () => {
  return createMutation<{ access: string }, Error, { refresh: string }>({
    mutationFn: async ({ refresh }) => {
      const response = await fetch(`${PUBLIC_BACKEND_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      return response.json();
    },
  });
};
