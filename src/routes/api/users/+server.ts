import { json, type RequestHandler } from '@sveltejs/kit';
import { withDbCache, invalidateDbCacheByTags } from '$lib/cache/db-cache';
import { generateETag, setCacheHeaders } from '$lib/cache/http-cache';
import { cacheConfig } from '$lib/cache/config';

// --- In-memory "database" for demonstration ---
interface User {
	id: number;
	name: string;
}
let users: User[] = [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob' }
];
let nextUserId = 3;
// ------------------------------------------------

/**
 * GET: Fetches all users, using a database cache.
 */
export const GET: RequestHandler = async ({ request }) => {
	const cacheOptions = {
		key: 'users:all',
		tags: ['users'],
		ttl: cacheConfig.ttl.dynamic
	};

	// This function is our "database query". It only runs if the result is not in the cache.
	const getUsersFromDb = async () => {
		return Promise.resolve(users);
	};

	// Wrap the query with our DB cache utility
	const cachedUsers = await withDbCache(cacheOptions, getUsersFromDb);

	const etag = generateETag(JSON.stringify(cachedUsers));

	// Check client's ETag for 304 response
	const ifNoneMatch = request.headers.get('if-none-match');
	if (ifNoneMatch === etag) {
		return new Response(null, { status: 304 });
	}

	const response = json({ users: cachedUsers, source: 'api' });
	setCacheHeaders(response, { strategy: 'public-dynamic', etag });
	return response;
};

/**
 * POST: Creates a new user and invalidates the cache.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();
	if (!name) {
		return json({ error: 'Name is required' }, { status: 400 });
	}

	const newUser: User = { id: nextUserId++, name };
	users.push(newUser);

	// Invalidate the cache for the 'users' tag
	invalidateDbCacheByTags(['users']);

	return json(newUser, { status: 201 });
};

/**
 * DELETE: Deletes the last user and invalidates the cache.
 */
export const DELETE: RequestHandler = async () => {
	if (users.length > 0) {
		users.pop();
	}

	// Invalidate the cache for the 'users' tag
	invalidateDbCacheByTags(['users']);

	return new Response(null, { status: 204 });
};
