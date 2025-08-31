import { createQuery } from '@tanstack/svelte-query';
import type { User, PaginatedResponse, UserListData } from '$lib/types/auth';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const createGetUsersQuery = (page: number = 1, page_size: number = 10) =>
  createQuery<PaginatedResponse<UserListData>, Error>({
    queryKey: ['users', page, page_size],
    queryFn: () => apiFetch<PaginatedResponse<UserListData>>(`${PUBLIC_BACKEND_URL}/api/users?page=${page}&page_size=${page_size}`)
  });
