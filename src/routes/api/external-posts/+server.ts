import { json } from '@sveltejs/kit';
import { withApiCache } from '$lib/cache/api-cache';
import { cacheConfig } from '$lib/cache/config';
import type { RequestHandler } from './$types';

const EXTERNAL_API_URL = 'https://jsonplaceholder.typicode.com/posts';

interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}

/**
 * GET: Fetches posts from an external API using a 'stale-while-revalidate' cache strategy.
 */
export const GET: RequestHandler = async () => {
	try {
		const posts = await withApiCache<Post[]>(EXTERNAL_API_URL, {
			strategy: 'stale-while-revalidate',
			ttl: cacheConfig.ttl.api
		});

		// Note: We don't set browser caching headers here because the data could be stale.
		// The server cache is responsible for providing a fast response.
		return json(posts);
	} catch (error) {
		console.error('Failed to fetch external posts:', error);
		return json({ error: 'Could not fetch data' }, { status: 500 });
	}
};
