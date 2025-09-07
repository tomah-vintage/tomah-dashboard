import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { withDbCache } from '$lib/cache/db-cache';
import { withApiCache } from '$lib/cache/api-cache';
import { memoryCache } from '$lib/cache/memory-cache';
import { cacheConfig } from '$lib/cache/config';
import { productsDb } from '../../../_db';

const REPORT_CACHE_KEY = 'complex-report';

// This function simulates generating a complex report.
// It combines data from an external API and our internal products DB.
async function generateComplexReport() {
	const start = Date.now();

	// 1. Fetch data from an external source (e.g., analytics API)
	const externalData = await withApiCache<any[]>(
		'https://jsonplaceholder.typicode.com/users', // Using users for variety
		{
			strategy: 'network-first',
			ttl: cacheConfig.ttl.api,
			key: 'external-report-users'
		}
	);

	// 2. Fetch internal product data
	const internalProducts = await withDbCache(
		{
			key: 'report-products-all',
			tags: ['products'],
			ttl: cacheConfig.ttl.dynamic
		},
		() => Promise.resolve(productsDb.findMany(1, 100).products) // Get all products for report
	);

	// 3. Combine and process data (simulated)
	const reportData = {
		generatedAt: new Date().toISOString(),
		externalUsersCount: externalData.length,
		internalProductsCount: internalProducts.length,
		top5Products: internalProducts.slice(0, 5).map((p) => ({ id: p.id, name: p.name, price: p.price })),
		// Add more complex aggregations here
		processingTimeMs: Date.now() - start
	};

	return reportData;
}

// Initialize background refresh for the report on server startup
// This ensures the report is always fresh in the cache without user requests triggering the generation.
if (cacheConfig.enabled) {
	memoryCache.setWithBackgroundRefresh(REPORT_CACHE_KEY, cacheConfig.ttl.static, generateComplexReport);
}

/**
 * GET: Returns a complex report, generated and kept fresh via background refresh.
 */
export const GET: RequestHandler = async () => {
	const report = memoryCache.get(REPORT_CACHE_KEY);

	if (report) {
		return json(report);
	} else {
		// If for some reason the background refresh hasn't populated it yet,
		// generate it on demand (this should be rare if background refresh is working).
		const freshReport = await generateComplexReport();
		return json(freshReport);
	}
};
