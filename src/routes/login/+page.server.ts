import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
			return fail(400, { invalid: true });
		}

		// In a real application, you would call your backend API here
		if (username === 'admin' && password === 'password') {
			cookies.set('sessionid', 'mock_session_token', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
			throw redirect(303, '/');
		} else {
			return fail(400, { incorrect: true });
		}
	}
};
