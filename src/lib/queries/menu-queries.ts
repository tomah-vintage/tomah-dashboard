import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { MenuItem, MenuItemFormForBackend, Category } from '$lib/types/menu';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import toast from 'svelte-french-toast';
import type { PaginatedResponse } from '$lib/types/auth'; // Import PaginatedResponse

// Fetch all menu items
export const createGetMenuItemsQuery = (page: number = 1, page_size: number = 10, search?: string) => {
	const params = new URLSearchParams({
		page: page.toString(),
		page_size: page_size.toString()
	});
	
	if (search && search.trim()) {
		params.append('search', search.trim());
	}

	return createQuery<PaginatedResponse<MenuItem>, Error>({
		queryKey: ['menuItems', page, page_size, search],
		queryFn: () => apiFetch<PaginatedResponse<MenuItem>>(`${PUBLIC_BACKEND_URL}/api/menu-item/?${params.toString()}`)
	});
};

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

// Update a menu item
export const createUpdateMenuItemMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<MenuItem, Error, Partial<MenuItem> & { id: number }>({
		mutationFn: (menuItem) =>
			apiFetch<MenuItem>(`${PUBLIC_BACKEND_URL}/api/menu-item/${menuItem.id}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(menuItem)
			}),
		onSuccess: (data) => {
			toast.success('Menu item updated successfully!');
			queryClient.invalidateQueries({ queryKey: ['menuItems'] });
			// Optionally, update the specific query data
			queryClient.setQueryData(['menuItems', data.id], data);
		},
		onError: (error) => {
			toast.error(`Error updating menu item: ${error.message}`);
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

// Update emphasized menu items
export const createUpdateEmphasizedMenuItemsMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<void, Error, { menu_item_ids: number[] }>({
		mutationFn: (data) =>
			apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/emphasized-menu-items/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menuItems'] });
		}
	});
};
