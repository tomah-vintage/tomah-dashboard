import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('sessionid');

	if (!sessionId) {
		throw redirect(302, '/login');
	}

	// In a real application, you would validate the sessionId with your backend
	// and potentially fetch user roles/permissions.

	return {};
};
