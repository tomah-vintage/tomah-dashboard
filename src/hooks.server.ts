import { redirect, type Handle } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { apiFetch } from '$lib/utils/api';
import type { User } from '$lib/types/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		try {
			const user = await apiFetch<User>(`${PUBLIC_BACKEND_URL}/api/me`, {
				headers: {
					'Authorization': `Bearer ${sessionId}`
				}
			});

			if (user) {
				event.locals.user = {
					...user,
					name: `${user.first_name} ${user.last_name}`
				};
			}
		} catch (error) {
			console.error('Failed to fetch user:', error);
		}
	}

	// Protect routes within (pladmin) or (rsadmin) route groups
	if (event.route.id?.includes('(pladmin)') || event.route.id?.includes('(rsadmin)')) {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		}
	}

	return resolve(event);
};
