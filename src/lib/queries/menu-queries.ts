import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { MenuItem, MenuItemFormForBackend, Category } from '$lib/types/menu';
import type { DefaultCategory, DefaultCategoryForm } from '$lib/types/category';
import type { RestaurantHighlight, RestaurantHighlightForm, SimpleRestaurant } from '$lib/types/restaurant-highlight';
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

// Delete a menu item
export const createDeleteMenuItemMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<void, Error, number>({
		mutationFn: (menuItemId) =>
			apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/menu-item/${menuItemId}/`, {
				method: 'DELETE'
			}),
		onSuccess: () => {
			toast.success('Хоол амжилттай устгагдлаа!');
			queryClient.invalidateQueries({ queryKey: ['menuItems'] });
		},
		onError: (error) => {
			toast.error(`Хоол устгахад алдаа гарлаа: ${error.message}`);
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

// Default Categories queries
export const createGetDefaultCategoriesQuery = () =>
	createQuery<DefaultCategory[], Error>({
		queryKey: ['defaultCategories'],
		queryFn: () => apiFetch<DefaultCategory[]>(`${PUBLIC_BACKEND_URL}/api/default-categories/`)
	});

export const createAddDefaultCategoryMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<DefaultCategory, Error, DefaultCategoryForm>({
		mutationFn: (newCategory) =>
			apiFetch<DefaultCategory>(`${PUBLIC_BACKEND_URL}/api/default-categories/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newCategory)
			}),
		onSuccess: () => {
			toast.success('Үндсэн ангилал амжилттай нэмэгдлээ!');
			queryClient.invalidateQueries({ queryKey: ['defaultCategories'] });
		},
		onError: (error) => {
			toast.error(`Үндсэн ангилал нэмэхэд алдаа гарлаа: ${error.message}`);
		}
	});
};

export const createUpdateDefaultCategoryMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<DefaultCategory, Error, Partial<DefaultCategory> & { id: number }>({
		mutationFn: (category) =>
			apiFetch<DefaultCategory>(`${PUBLIC_BACKEND_URL}/api/default-categories/${category.id}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(category)
			}),
		onSuccess: () => {
			toast.success('Үндсэн ангилал амжилттай засагдлаа!');
			queryClient.invalidateQueries({ queryKey: ['defaultCategories'] });
		},
		onError: (error) => {
			toast.error(`Үндсэн ангилал засахад алдаа гарлаа: ${error.message}`);
		}
	});
};

export const createDeleteDefaultCategoryMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<void, Error, number>({
		mutationFn: (categoryId) =>
			apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/default-categories/${categoryId}/`, {
				method: 'DELETE'
			}),
		onSuccess: () => {
			toast.success('Үндсэн ангилал амжилттай устгагдлаа!');
			queryClient.invalidateQueries({ queryKey: ['defaultCategories'] });
		},
		onError: (error) => {
			toast.error(`Үндсэн ангилал устгахад алдаа гарлаа: ${error.message}`);
		}
	});
};

// Restaurant Highlights queries
export const createGetRestaurantHighlightsQuery = () =>
	createQuery<RestaurantHighlight[], Error>({
		queryKey: ['restaurantHighlights'],
		queryFn: () => apiFetch<RestaurantHighlight[]>(`${PUBLIC_BACKEND_URL}/api/public-restaurant-highlights/`)
	});

export const createAddRestaurantHighlightMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<RestaurantHighlight, Error, RestaurantHighlightForm>({
		mutationFn: (newHighlight) =>
			apiFetch<RestaurantHighlight>(`${PUBLIC_BACKEND_URL}/api/restaurant-highlights/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newHighlight)
			}),
		onSuccess: () => {
			toast.success('Онцлох ресторан амжилттай нэмэгдлээ!');
			queryClient.invalidateQueries({ queryKey: ['restaurantHighlights'] });
		},
		onError: (error) => {
			toast.error(`Онцлох ресторан нэмэхэд алдаа гарлаа: ${error.message}`);
		}
	});
};

export const createUpdateRestaurantHighlightMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<RestaurantHighlight, Error, Partial<RestaurantHighlight> & { id: number }>({
		mutationFn: (highlight) =>
			apiFetch<RestaurantHighlight>(`${PUBLIC_BACKEND_URL}/api/restaurant-highlights/${highlight.id}/`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(highlight)
			}),
		onSuccess: () => {
			toast.success('Онцлох ресторан амжилттай засагдлаа!');
			queryClient.invalidateQueries({ queryKey: ['restaurantHighlights'] });
		},
		onError: (error) => {
			toast.error(`Онцлох ресторан засахад алдаа гарлаа: ${error.message}`);
		}
	});
};

export const createDeleteRestaurantHighlightMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<void, Error, number>({
		mutationFn: (highlightId) =>
			apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/restaurant-highlights/${highlightId}/`, {
				method: 'DELETE'
			}),
		onSuccess: () => {
			toast.success('Онцлох ресторан амжилттай устгагдлаа!');
			queryClient.invalidateQueries({ queryKey: ['restaurantHighlights'] });
		},
		onError: (error) => {
			toast.error(`Онцлох ресторан устгахад алдаа гарлаа: ${error.message}`);
		}
	});
};

// Restaurant attachment to highlights
export const createGetAllRestaurantsQuery = () =>
	createQuery<SimpleRestaurant[] | PaginatedResponse<SimpleRestaurant>, Error>({
		queryKey: ['allRestaurants'],
		queryFn: async () => {
			const response = await apiFetch<any>(`${PUBLIC_BACKEND_URL}/api/restaurants/`);
			// Handle both array and paginated response formats
			if (Array.isArray(response)) {
				return response;
			} else if (response && response.results && Array.isArray(response.results)) {
				return response.results;
			} else {
				return [];
			}
		}
	});

export const createSetHighlightRestaurantsMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<void, Error, { highlightId: number; restaurantIds: number[] }>({
		mutationFn: async ({ highlightId, restaurantIds }) => {
			// We'll add/remove restaurants to highlight for each restaurant
			const currentHighlight = queryClient.getQueryData<RestaurantHighlight[]>(['restaurantHighlights'])
				?.find(h => h.id === highlightId);
			
			const currentRestaurantIds = new Set(currentHighlight?.restaurants?.map(r => r.id) || []);
			const newRestaurantIds = new Set(restaurantIds);
			
			// Restaurants to add this highlight to
			const toAdd = restaurantIds.filter(id => !currentRestaurantIds.has(id));
			// Restaurants to remove this highlight from  
			const toRemove = Array.from(currentRestaurantIds).filter(id => !newRestaurantIds.has(id));
			
			// Add highlight to new restaurants
			await Promise.all(toAdd.map(restaurantId =>
				apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/add_highlights/`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ highlight_ids: [highlightId] })
				})
			));
			
			// Remove highlight from deselected restaurants
			await Promise.all(toRemove.map(restaurantId =>
				apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/remove_highlights/`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ highlight_ids: [highlightId] })
				})
			));
		},
		onSuccess: () => {
			toast.success('Онцлох ресторан амжилттай тохируулагдлаа!');
			queryClient.invalidateQueries({ queryKey: ['restaurantHighlights'] });
		},
		onError: (error) => {
			toast.error(`Онцлох ресторан тохируулахад алдаа гарлаа: ${error.message}`);
		}
	});
};
