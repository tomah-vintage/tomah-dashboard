import { memoryCache } from './memory-cache';
import { cacheConfig } from './config';

export type ApiCacheStrategy = 'cache-first' | 'network-first' | 'stale-while-revalidate';

export interface ApiCacheOptions {
	strategy: ApiCacheStrategy;
	ttl: number; // TTL in milliseconds
	key?: string;
}

/**
 * A wrapper for the native fetch API to add caching capabilities.
 *
 * @param url The URL to fetch.
 * @param options The caching options, including strategy, TTL, and an optional cache key.
 * @param fetchOptions Optional native fetch options (e.g., headers, method).
 * @returns A Promise that resolves to the fetched data (typically a JSON object).
 */
export async function withApiCache<T>(url: string, options: ApiCacheOptions, fetchOptions?: RequestInit): Promise<T> {
	if (!cacheConfig.enabled) {
		const response = await fetch(url, fetchOptions);
		if (!response.ok) {
			throw new Error(`Failed to fetch: ${response.statusText}`);
		}
		return response.json();
	}

	const { strategy, ttl } = options;
	const key = options.key || url;

	switch (strategy) {
		case 'cache-first':
			return handleCacheFirst(key, ttl, url, fetchOptions);
		case 'network-first':
			return handleNetworkFirst(key, ttl, url, fetchOptions);
		case 'stale-while-revalidate':
			return handleStaleWhileRevalidate(key, ttl, url, fetchOptions);
	}
}

async function handleCacheFirst<T>(key: string, ttl: number, url: string, fetchOptions?: RequestInit): Promise<T> {
	const cached = memoryCache.get<T>(key);
	if (cached) {
		return cached;
	}

	const response = await fetch(url, fetchOptions);
	if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.statusText}`);
	}

	const data = await response.json();
	memoryCache.set(key, data, ttl);
	return data;
}

async function handleNetworkFirst<T>(key: string, ttl: number, url: string, fetchOptions?: RequestInit): Promise<T> {
	try {
		const response = await fetch(url, fetchOptions);
		if (!response.ok) {
			throw new Error('Network request failed'); // Will be caught and fallback to cache
		}
		const data = await response.json();
		memoryCache.set(key, data, ttl);
		return data;
	} catch (_error) {
		const cached = memoryCache.get<T>(key);
		if (cached) {
			return cached;
		}
		throw new Error('Network failed and no cache available.');
	}
}

async function handleStaleWhileRevalidate<T>(key: string, ttl: number, url: string, fetchOptions?: RequestInit): Promise<T> {
	const cached = memoryCache.get<T>(key);
	if (cached) {
		// In the background, revalidate the cache
		fetch(url, fetchOptions)
			.then((res) => res.json())
			.then((data) => {
				memoryCache.set(key, data, ttl);
			})
			.catch((err) => console.error(`Failed to revalidate cache for ${key}:`, err));
		return cached;
	}

	const response = await fetch(url, fetchOptions);
	if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.statusText}`);
	}

	const data = await response.json();
	memoryCache.set(key, data, ttl);
	return data;
}
