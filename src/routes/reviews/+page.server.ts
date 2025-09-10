import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Allow both admin and restaurant users to access reviews
	// if (locals.user.role !== 'ADMIN' && locals.user.role !== 'RESTAURANT') {
	// 	throw redirect(302, '/dashboard');
	// }

	return {
		user: locals.user,
		restaurantId: locals.user.restaurant?.id
	};
}) satisfies PageServerLoad;