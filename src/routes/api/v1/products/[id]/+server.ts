import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { withDbCache, invalidateDbCacheByTags } from '$lib/cache/db-cache';
import { generateETag, setCacheHeaders } from '$lib/cache/http-cache';
import { cacheConfig } from '$lib/cache/config';
import { productsDb } from '../_db'; // Mock database

/**
 * GET: Returns a single product by ID.
 * Caches the individual product and supports ETag validation.
 */
export const GET: RequestHandler = async ({ params, request }) => {
	const productId = parseInt(params.id);

	const cacheOptions = {
		key: `product:${productId}`,
		tags: ['products', `product:${productId}`],
		ttl: cacheConfig.ttl.static // Static TTL for individual items
	};

	const getProductFromDb = () => Promise.resolve(productsDb.findById(productId));

	const product = await withDbCache(cacheOptions, getProductFromDb);

	if (!product) {
		return json({ error: 'Product not found' }, { status: 404 });
	}

	const etag = generateETag(JSON.stringify(product));

	if (request.headers.get('if-none-match') === etag) {
		return new Response(null, { status: 304 });
	}

	const response = json(product);
	setCacheHeaders(response, { strategy: 'public-static', etag });
	return response;
};

/**
 * PUT: Updates a product and invalidates its specific cache and the general product list cache.
 */
export const PUT: RequestHandler = async ({ params, request }) => {
	const productId = parseInt(params.id);
	const { name, price } = await request.json();

	if (!name && !price) {
		return json({ error: 'Name or price is required for update' }, { status: 400 });
	}

	const updatedProduct = productsDb.update(productId, { name, price });

	if (!updatedProduct) {
		return json({ error: 'Product not found' }, { status: 404 });
	}

	// Invalidate the specific product cache and the general products list cache
	invalidateDbCacheByTags(['products', `product:${productId}`]);

	return json(updatedProduct);
};

/**
 * DELETE: Deletes a product and invalidates its specific cache and the general product list cache.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const productId = parseInt(params.id);

	const deleted = productsDb.delete(productId);

	if (!deleted) {
		return json({ error: 'Product not found' }, { status: 404 });
	}

	// Invalidate the specific product cache and the general products list cache
	invalidateDbCacheByTags(['products', `product:${productId}`]);

	return new Response(null, { status: 204 });
};
