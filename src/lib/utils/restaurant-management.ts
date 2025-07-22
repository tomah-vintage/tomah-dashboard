import { get } from 'svelte/store';
import { restaurantManagementStore } from '$lib/stores/restaurant-management';
import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';

/**
 * Validates restaurant form data.
 * In a real implementation, this would use Zod as specified in TDD.md.
 */
export const validateRestaurantData = (data: RestaurantFormData): boolean => {
	// Validation logic
	return data.name.trim() !== '' && data.address.trim() !== '';
};

// Mock API functions
const MOCK_DELAY = 500; // Simulate network latency

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
	restaurantManagementStore.update(state => ({ ...state, loading: true, error: null }));
	return new Promise((resolve) => {
		setTimeout(() => {
			const currentItems = get(restaurantManagementStore).items;
			if (currentItems.length === 0) {
				// Populate with initial data if store is empty
				const initialData: Restaurant[] = [
					{
						id: '1',
						name: 'The Gourmet Place',
						address: '123 Foodie Lane, Flavor Town',
						phone: '123-456-7890',
						email: 'contact@gourmetplace.com',
						status: 'active',
					},
					{
						id: '2',
						name: 'Quick Bites',
						address: '456 Snack Street, Hungerburg',
						phone: '987-654-3210',
						email: 'support@quickbites.com',
						status: 'inactive',
					},
				];
				restaurantManagementStore.update(state => ({ ...state, items: initialData, loading: false }));
				resolve(initialData);
			} else {
				restaurantManagementStore.update(state => ({ ...state, loading: false }));
				resolve(currentItems);
			}
		}, MOCK_DELAY);
	});
};

export const addRestaurant = async (formData: RestaurantFormData): Promise<Restaurant> => {
	restaurantManagementStore.update(state => ({ ...state, loading: true, error: null }));
	return new Promise((resolve) => {
		setTimeout(() => {
			const newRestaurant: Restaurant = {
				id: String(Date.now()), // Simple unique ID
				status: 'active', // Default status for new restaurants
				...formData,
			};
			restaurantManagementStore.update(state => ({
				...state,
				items: [...state.items, newRestaurant],
				loading: false,
			}));
			resolve(newRestaurant);
		}, MOCK_DELAY);
	});
};

export const updateRestaurant = async (id: string, formData: RestaurantFormData): Promise<Restaurant> => {
	restaurantManagementStore.update(state => ({ ...state, loading: true, error: null }));
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			let updatedRestaurant: Restaurant | undefined;
			restaurantManagementStore.update(state => {
				const updatedItems = state.items.map(item => {
					if (item.id === id) {
						updatedRestaurant = { ...item, ...formData };
						return updatedRestaurant;
					}
					return item;
				});
				if (!updatedRestaurant) {
					reject(new Error('Restaurant not found'));
					return state;
				}
				return { ...state, items: updatedItems, loading: false };
			});
			if (updatedRestaurant) {
				resolve(updatedRestaurant);
			}
		}, MOCK_DELAY);
	});
};

export const deleteRestaurant = async (id: string): Promise<void> => {
	restaurantManagementStore.update(state => ({ ...state, loading: true, error: null }));
	return new Promise((resolve) => {
		setTimeout(() => {
			restaurantManagementStore.update(state => ({
				...state,
				items: state.items.filter(item => item.id !== id),
				loading: false,
			}));
			resolve();
		}, MOCK_DELAY);
	});
};