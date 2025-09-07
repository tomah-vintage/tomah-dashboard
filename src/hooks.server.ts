import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { User } from '$lib/types/auth';
import { memoryCache } from '$lib/cache/memory-cache';
import { withDbCache } from '$lib/cache/db-cache';
import { startPeriodicCacheLogging } from '$lib/cache/monitoring';

// --- Cache Warming and Graceful Shutdown ---

/**
 * Pre-fills the cache with essential data on application startup.
 */
async function warmCacheOnStartup() {
	// Example: Warm the 'users:all' database cache
	await withDbCache({ key: 'users:all', tags: ['users'], ttl: 60000 }, async () => {
		// In a real app, you'd fetch this from the actual database
		return Promise.resolve([
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' }
		]);
	});
}

// Run cache warming once on server start
warmCacheOnStartup().catch((err) => {
	console.error('[CACHE WARMING] Error during cache warming:', err);
});

// Start periodic logging in development
startPeriodicCacheLogging();

/**
 * Handles graceful shutdown by stopping the cache cleanup interval.
 */
function gracefulShutdown() {
	console.log('Gracefully shutting down. Stopping cache cleanup...');
	memoryCache.stopCleanup();
	process.exit(0);
}

process.on('SIGINT', gracefulShutdown); // Catches Ctrl+C
process.on('SIGTERM', gracefulShutdown); // Catches kill commands

// --- Existing Authentication Logic ---

const EXTERNAL_REFRESH_URL = `${PUBLIC_BACKEND_URL}/api/token/refresh/`;

async function refreshSession(event: RequestEvent): Promise<string | null> {
	const refreshToken = event.cookies.get('refreshToken');

	if (!refreshToken) {
		return null;
	}

	try {
		const response = await event.fetch(EXTERNAL_REFRESH_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ refresh: refreshToken })
		});

		if (!response.ok) {
			event.cookies.delete('refreshToken', { path: '/' });
			event.cookies.delete('session', { path: '/' });
			return null;
		}

		const data = await response.json();
		const newAccessToken = data.access;

		event.cookies.set('session', newAccessToken, {
			path: '/',
			sameSite: 'strict',
			httpOnly: false,
			maxAge: 60 * 60 * 24 // 1 day
		});

		return newAccessToken;
	} catch (error) {
		console.error('An internal error occurred during token refresh:', error);
		return null;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	let sessionId = event.cookies.get('session');

	if (sessionId) {
		try {
			let userResponse = await event.fetch(`${PUBLIC_BACKEND_URL}/api/me/`, {
				headers: {
					Authorization: `Bearer ${sessionId}`
				}
			});

			if (userResponse.status === 401) {
				const newSessionId = await refreshSession(event);
				if (newSessionId) {
					sessionId = newSessionId;
					userResponse = await event.fetch(`${PUBLIC_BACKEND_URL}/api/me/`, {
						headers: {
							Authorization: `Bearer ${sessionId}`
						}
					});
				} else {
					event.locals.user = undefined;
				}
			}

			if (userResponse.ok) {
				const user: User = await userResponse.json();
				event.locals.user = {
					...user,
					name: `${user.first_name} ${user.last_name}`,
					restaurantId: user.restaurant?.id || undefined // Assign restaurantId
				};
			} else {
				event.locals.user = undefined;
			}
		} catch (error) {
			console.error('Failed to fetch user:', error);
			event.locals.user = undefined;
		}
	}

	// Protect routes within (pladmin) or (rsadmin) route groups
	if (event.route.id?.includes('(pladmin)') || event.route.id?.includes('(rsadmin)')) {
		if (!event.locals.user) {
			const redirectUrl = `/login?redirectTo=${event.url.pathname}`;
			throw redirect(303, redirectUrl);
		}
	}

	return resolve(event);
};