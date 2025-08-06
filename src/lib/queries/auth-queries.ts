import { createMutation } from '@tanstack/svelte-query';
import type { UserCredentials, AuthUser } from '$lib/types/auth';

// Login
export const createLoginMutation = () => {
  return createMutation<{ access: string; refresh: string }, Error, UserCredentials>({
    mutationFn: async (credentials) => {
      const response = await fetch('https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/token/', {
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
      const response = await fetch('https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/token/refresh/', {
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
