import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { MenuItem, MenuItemFormForBackend, Category } from '$lib/types/menu';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import toast from 'svelte-french-toast';
import type { PaginatedResponse } from '$lib/types/auth'; // Import PaginatedResponse

// Fetch all menu items
export const createGetMenuItemsQuery = (page: number = 1, page_size: number = 10) =>
	createQuery<PaginatedResponse<MenuItem>, Error>({
		queryKey: ['menuItems', page, page_size],
		queryFn: () => apiFetch<PaginatedResponse<MenuItem>>(`${PUBLIC_BACKEND_URL}/api/menu-item/?page=${page}&page_size=${page_size}`)
	});

// Fetch all categories
export const createGetCategoriesQuery = () =>
	createQuery<Category[], Error>({
		queryKey: ['categories'],
		queryFn: () => apiFetch<Category[]>(`${PUBLIC_BACKEND_URL}/api/own-categories/`)
	});

// Add a new menu item
export const createAddMenuItemMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<MenuItem, Error, MenuItemFormForBackend>({
		mutationFn: (newMenuItem) =>
			apiFetch<MenuItem>(`${PUBLIC_BACKEND_URL}/api/menu-item/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newMenuItem)
			}),
		onSuccess: () => {
			toast.success('Menu item added successfully!');
			queryClient.invalidateQueries({ queryKey: ['menuItems'] });
		},
		onError: (error) => {
			toast.error(`Error adding menu item: ${error.message}`);
		}
	});
};

// Delete a category
export const createDeleteCategoryMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<void, Error, number>({
		mutationFn: (categoryId) =>
			apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/item-category/${categoryId}/`, {
				method: 'DELETE'
			}),
		onSuccess: () => {
			toast.success('Category deleted successfully!');
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: (error) => {
			toast.error(`Error deleting category: ${error.message}`);
		}
	});
};
