import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const data = await request.json();
		const { username, password } = data;

		// In a real application, you would call your backend API here
		// For now, we'll simulate a successful login for 'admin' and 'password'
		if (username === 'admin' && password === 'password') {
			// Set a mock authentication cookie
			cookies.set('sessionid', 'mock_session_token', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
			return { success: true };
		} else {
			return { success: false, message: 'Invalid credentials' };
		}
	}
};
