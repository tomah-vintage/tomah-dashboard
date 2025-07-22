import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Protect routes
	if (event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/restaurants') || event.url.pathname === '/') {
		const sessionId = event.cookies.get('sessionid');

		if (!sessionId) {
			throw redirect(303, '/login');
		}

		// In a real app, you'd validate the session against a database
		// For now, just checking for its existence is enough
		const user = { id: '1', username: 'admin', role: 'MAIN_ADMIN' }; // Mock user
		event.locals.user = user;
	}

	return resolve(event);
};
