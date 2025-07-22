import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';

/**
 * Validates restaurant form data.
 * In a real implementation, this would use Zod as specified in TDD.md.
 */
export const validateRestaurantData = (data: RestaurantFormData): boolean => {
	// Validation logic
	return data.name.trim() !== '' && data.address.trim() !== '';
};

export const apiEndpoints = {
	list: '/api/admin/restaurants',
	create: '/api/admin/restaurants',
	update: (id: string) => `/api/admin/restaurants/${id}`,
	delete: (id: string) => `/api/admin/restaurants/${id}`
};