import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { MenuItem, MenuItemFormData } from '$lib/types/menu';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

// Fetch all menu items
export const createGetMenuItemsQuery = () => createQuery<MenuItem[], Error>({
  queryKey: ['menuItems'],
  queryFn: () => apiFetch<MenuItem[]>(`${PUBLIC_BACKEND_URL}/api/menu-item/`),
});

// Add a new menu item
export const createAddMenuItemMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<MenuItem, Error, MenuItemFormData>({
    mutationFn: (newMenuItem) => apiFetch<MenuItem>(`${PUBLIC_BACKEND_URL}/api/menu-item/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMenuItem),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
};
