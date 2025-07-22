import { writable } from 'svelte/store';
import type { Restaurant } from '$lib/types/restaurant';

export interface RestaurantManagementState {
	items: Restaurant[];
	loading: boolean;
	error: string | null;
}

export const restaurantManagementStore = writable<RestaurantManagementState>({
	items: [],
	loading: false,
	error: null
});