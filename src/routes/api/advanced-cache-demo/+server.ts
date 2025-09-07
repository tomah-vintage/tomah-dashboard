import { json } from '@sveltejs/kit';
import { memoryCache } from '$lib/cache/memory-cache';
import type { RequestHandler } from './$types';
import { cacheConfig } from '$lib/cache/config';

// --- Demo for Background Refresh ---

const LIVE_DATA_KEY = 'live-data';
let liveDataCounter = 0;

// This function simulates fetching data from a source that updates frequently.
async function fetchLiveData() {
	liveDataCounter++;
	return Promise.resolve({ version: liveDataCounter, timestamp: new Date().toISOString() });
}

// Initialize the background refresh when the server starts.
if (cacheConfig.enabled) {
	memoryCache.setWithBackgroundRefresh(LIVE_DATA_KEY, cacheConfig.ttl.dynamic, fetchLiveData);
}

// --- Demo for Compression ---

const LARGE_OBJECT_KEY = 'large-object';

function createLargeObject() {
	return Array.from({ length: 2000 }, (_, i) => ({
		id: i,
		name: `Item ${i}`,
		data: 'x'.repeat(100) // Make the object large
	}));
}

// Cache the large object on startup.
if (cacheConfig.enabled && !memoryCache.get(LARGE_OBJECT_KEY)) {
	const largeObject = createLargeObject();
	memoryCache.set(LARGE_OBJECT_KEY, largeObject, cacheConfig.ttl.static);
}

/**
 * GET: Demonstrates advanced caching features.
 * Use ?type=live to get the background-refreshed data.
 * Use ?type=large to get the compressed data.
 */
export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');

	if (type === 'live') {
		const data = memoryCache.get(LIVE_DATA_KEY);
		return json({ key: LIVE_DATA_KEY, data });
	}

	if (type === 'large') {
		const data = memoryCache.get(LARGE_OBJECT_KEY);
		return json({ key: LARGE_OBJECT_KEY, data: { items: (data as any[])?.length } }); // Return only length to keep response small
	}

	return json({ error: 'Please specify ?type=live or ?type=large' }, { status: 400 });
};
