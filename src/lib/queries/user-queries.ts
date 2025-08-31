import { createQuery } from '@tanstack/svelte-query';
import type { User } from '$lib/types/auth';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const createGetUsersQuery = () =>
  createQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => apiFetch<User[]>(`${PUBLIC_BACKEND_URL}/api/users/`)
  });
