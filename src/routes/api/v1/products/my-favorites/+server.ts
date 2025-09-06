import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { withDbCache } from '$lib/cache/db-cache';
import { generateETag, setCacheHeaders } from '$lib/cache/http-cache';
import { cacheConfig } from '$lib/cache/config';

/**
 * GET: Returns a user's favorite products.
 * Demonstrates user-specific caching with 'private' cache control.
 */
export const GET: RequestHandler = async ({ request, locals }) => {
	// In a real application, you would get the user ID from `locals.user.id`
	// For this example, we'll mock a user ID.
	const userId = locals.user?.id || 'guest'; // Assuming user ID is available in locals

	const cacheOptions = {
		key: `user:${userId}:favorites`,
		tags: [`user:${userId}:favorites`],
		ttl: cacheConfig.ttl.dynamic
	};

	const getFavoritesFromDb = async () => {
		return Promise.resolve([
			{ id: 101, name: 'User Specific Item A' },
			{ id: 102, name: 'User Specific Item B' }
		]);
	};

	const favorites = await withDbCache(cacheOptions, getFavoritesFromDb);

	const etag = generateETag(JSON.stringify(favorites));

	if (request.headers.get('if-none-match') === etag) {
		return new Response(null, { status: 304 });
	}

	const response = json(favorites);
	// Use 'private' strategy for user-specific data
	setCacheHeaders(response, { strategy: 'private', etag });
	return response;
};
