import type { PageServerLoad } from './$types';
import type { Restaurant } from '$lib/types/restaurant';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// In a real app, you would fetch this from your Django API
		// const response = await fetch('/api/admin/restaurants');
		// if (!response.ok) {
		//   throw new Error('Failed to fetch restaurants');
		// }
		// const items: Restaurant[] = await response.json();

		// For now, returning mock data
		const items: Restaurant[] = [
			{ id: '1', name: 'The Gourmet Place', address: '123 Foodie Lane, Flavor Town' },
			{ id: '2', name: 'Quick Bites', address: '456 Snack Street, Hungerburg' }
		];

		return {
			items
		};
	} catch (err) {
		console.error('Error loading restaurant data:', err);
		throw error(500, 'Failed to load restaurant data');
	}
};