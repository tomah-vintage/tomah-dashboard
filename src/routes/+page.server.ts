import type { PageServerLoad } from './$types';
import type { Restaurant } from '$lib/types/restaurant';

export const load: PageServerLoad = async ({ fetch }) => {
	// Simulate fetching statistics from a backend API
	const stats = {
		totalRestaurants: 150,
		activeRestaurants: 120,
		disabledRestaurants: 30,
		totalSalesToday: 12345.67,
		newOrdersToday: 250
	};

	// Simulate fetching a list of restaurants
	const restaurants: Restaurant[] = [
		{ id: '1', name: 'The Gourmet Place', address: '123 Foodie Lane, Flavor Town' },
		{ id: '2', name: 'Quick Bites', address: '456 Snack Street, Hungerburg' },
		{ id: '3', name: 'Pizza Palace', address: '789 Cheese Ave, Dough City' },
		{ id: '4', name: 'Sushi Spot', address: '101 Raw Fish Rd, Oceanville' },
		{ id: '5', name: 'Burger Barn', address: '202 Patty St, Meatland' }
	];

	return {
		stats,
		restaurants
	};
};
