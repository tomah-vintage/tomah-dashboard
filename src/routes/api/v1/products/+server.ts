import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { withDbCache, invalidateDbCacheByTags } from '$lib/cache/db-cache';
import { generateETag, setCacheHeaders } from '$lib/cache/http-cache';
import { cacheConfig } from '$lib/cache/config';
import { productsDb } from '../../_db'; // Mock database

/**
 * GET: Returns a paginated list of products.
 * Caches each page individually and supports ETag validation.
 */
export const GET: RequestHandler = async ({ url, request }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 10;

	const cacheOptions = {
		key: `products:page:${page}`,
		tags: ['products'],
		ttl: cacheConfig.ttl.dynamic
	};

	const getPaginatedProducts = () => Promise.resolve(productsDb.findMany(page, limit));

	const result = await withDbCache(cacheOptions, getPaginatedProducts);

	const etag = generateETag(JSON.stringify(result));

	if (request.headers.get('if-none-match') === etag) {
		return new Response(null, { status: 304 });
	}

	const response = json(result);
	setCacheHeaders(response, { strategy: 'public-dynamic', etag });
	return response;
};

/**
 * POST: Creates a new product and invalidates the entire 'products' list cache.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { name, price } = await request.json();
	if (!name || !price) {
		return json({ error: 'Name and price are required' }, { status: 400 });
	}

	const newProduct = productsDb.create({ name, price });

	// This invalidates all caches tagged with 'products', including all paginated lists.
	invalidateDbCacheByTags(['products']);

	return json(newProduct, { status: 201 });
};
