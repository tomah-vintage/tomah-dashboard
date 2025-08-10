import { error, redirect, type Handle } from '@sveltejs/kit';
import type { User, Permission } from '$lib/types/auth';

// Mock function to simulate fetching a user from a session ID.
const getUserFromSession = async (sessionId: string): Promise<User | null> => {
  if (sessionId) {
    return {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      roles: ['ADMIN'],
      permissions: ['view-dashboard', 'manage-restaurants', 'edit-menus', 'view-seating-charts', 'manage-users'],
    };
  }
  return null;
};

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		const user = await getUserFromSession(sessionId);
		if (user) {
			event.locals.user = user;
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