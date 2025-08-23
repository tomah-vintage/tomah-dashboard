import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { User } from '$lib/types/auth';

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
			let userResponse = await event.fetch(`${PUBLIC_BACKEND_URL}/api/me`, {
				headers: {
					Authorization: `Bearer ${sessionId}`
				}
			});

			if (userResponse.status === 401) {
				const newSessionId = await refreshSession(event);
				if (newSessionId) {
					sessionId = newSessionId;
					userResponse = await event.fetch(`${PUBLIC_BACKEND_URL}/api/me`, {
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
					name: `${user.first_name} ${user.last_name}`
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
