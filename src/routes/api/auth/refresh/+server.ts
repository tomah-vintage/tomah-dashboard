import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const EXTERNAL_REFRESH_URL = 'https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/token/refresh/';

export const POST: RequestHandler = async ({ cookies }) => {
    const refreshToken = cookies.get('refreshToken'); // Assuming the cookie is named 'refreshToken'

    if (!refreshToken) {
        return json({ message: 'Refresh token not found.' }, { status: 401 });
    }

    try {
        const response = await fetch(EXTERNAL_REFRESH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (!response.ok) {
            // If the external API fails, clear the cookie and return an error
            cookies.delete('refreshToken', { path: '/' });
            cookies.delete('session', { path: '/' });
            return json({ message: 'Failed to refresh token from external source.' }, { status: response.status });
        }

        const data = await response.json();

        // Assuming the external API returns new tokens named 'access' and 'refresh'
        const newAccessToken = data.access;

        // Set the new tokens in non-HttpOnly cookies to be consistent with the client-side session management
        cookies.set('session', newAccessToken, {
            path: '/',
            sameSite: 'strict',
            httpOnly: false,
            maxAge: 60 * 60 * 24 // 1 day
        });

        return json({ message: 'Token refreshed successfully.' });
    } catch (error) {
        return json({ message: 'An internal error occurred.' }, { status: 500 });
    }
};
