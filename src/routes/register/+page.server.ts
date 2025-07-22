import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const data = await request.json();
		const { username, email, password } = data;

		// In a real application, you would call your backend API here to register the user
		// For now, we'll simulate a successful registration
		if (username && email && password) {
			console.log('Attempting to register:', { username, email, password });
			// Simulate a delay for API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return { success: true, message: 'Registration successful!' };
		} else {
			return { success: false, message: 'Missing required fields.' };
		}
	}
};
