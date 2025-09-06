import type { Cache, CacheStats } from './types';
import { deflateSync, inflateSync } from 'zlib';

const COMPRESSION_THRESHOLD_BYTES = 1024 * 10; // 10 KB

interface CacheEntry<T> {
	value: Buffer | T;
	expireAt: number;
	isCompressed: boolean;
}

export class MemoryCache<T> implements Cache<T> {
	private readonly cache = new Map<string, CacheEntry<T>>();
	private readonly refreshTimeouts = new Map<string, NodeJS.Timeout>();
	private readonly cleanupInterval: NodeJS.Timeout;

	private hits = 0;
	private misses = 0;

	constructor(cleanupIntervalMs = 60000) {
		this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs);
	}

	get(key: string): T | undefined {
		const entry = this.cache.get(key);
		if (!entry) {
			this.misses++;
			return undefined;
		}

		if (Date.now() > entry.expireAt) {
			this.misses++;
			this.delete(key);
			return undefined;
		}

		this.hits++;

		if (entry.isCompressed) {
			const decompressed = inflateSync(entry.value as Buffer);
			return JSON.parse(decompressed.toString());
		}

		return entry.value as T;
	}

	set(key: string, value: T, ttl: number): void {
		const expireAt = Date.now() + ttl;
		const valueStr = JSON.stringify(value);
		let valueToStore: Buffer | T = value;
		let isCompressed = false;

		if (Buffer.byteLength(valueStr) > COMPRESSION_THRESHOLD_BYTES) {
			valueToStore = deflateSync(valueStr);
			isCompressed = true;
		}

		this.cache.set(key, { value: valueToStore, expireAt, isCompressed });
	}

	async setWithBackgroundRefresh(
		key: string,
		ttl: number,
		refreshFn: () => Promise<T>
	): Promise<void> {
		const data = await refreshFn();
		this.set(key, data, ttl);

		// Clear any existing refresh timeout for this key
		if (this.refreshTimeouts.has(key)) {
			clearTimeout(this.refreshTimeouts.get(key));
		}

		// Schedule the next refresh at 80% of the TTL
		const refreshInterval = ttl * 0.8;
		const timeout = setTimeout(() => {
			this.setWithBackgroundRefresh(key, ttl, refreshFn).catch((err) => {
				console.error(`[CACHE BG REFRESH] Error refreshing key ${key}:`, err);
			});
		}, refreshInterval);

		this.refreshTimeouts.set(key, timeout);
	}

	delete(key: string): void {
		this.cache.delete(key);
		// Also clear any pending background refresh for this key
		if (this.refreshTimeouts.has(key)) {
			clearTimeout(this.refreshTimeouts.get(key));
			this.refreshTimeouts.delete(key);
		}
	}

	clear(): void {
		this.cache.clear();
		this.refreshTimeouts.forEach(clearTimeout);
		this.refreshTimeouts.clear();
		this.hits = 0;
		this.misses = 0;
	}

	getStats(): CacheStats {
		const totalRequests = this.hits + this.misses;
		const hitRatio = totalRequests > 0 ? this.hits / totalRequests : 0;
		const estimatedMemoryUsage = Buffer.from(JSON.stringify(Array.from(this.cache.entries()))).length;

		return {
			hits: this.hits,
			misses: this.misses,
			totalEntries: this.cache.size,
			hitRatio: parseFloat(hitRatio.toFixed(4)),
			estimatedMemoryUsage
		};
	}

	private cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now > entry.expireAt) {
				this.delete(key);
			}
		}
	}

	stopCleanup(): void {
		clearInterval(this.cleanupInterval);
		this.refreshTimeouts.forEach(clearTimeout);
	}
}

export const memoryCache = new MemoryCache();
