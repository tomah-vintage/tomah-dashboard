import { json } from '@sveltejs/kit';
import { memoryCache } from '$lib/cache/memory-cache';
import type { RequestHandler } from './$types';

/**
 * GET: Returns the current performance statistics of the in-memory cache.
 * In a production environment, this endpoint should be protected.
 */
export const GET: RequestHandler = async () => {
	const stats = memoryCache.getStats();
	return json(stats);
};
