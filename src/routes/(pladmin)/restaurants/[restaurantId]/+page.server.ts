import type { PageServerLoad } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const restaurantResponse = await fetch(
		`${PUBLIC_BACKEND_URL}/api/restaurants/${params.restaurantId}/`
	);

	if (!restaurantResponse.ok) {
		// Handle error
		return { restaurant: null, users: [] };
	}

	const restaurant = await restaurantResponse.json();

	return { restaurant };
};
