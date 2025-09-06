export interface Cache<T> {
	get(key: string): T | undefined;
	set(key: string, value: T, ttl: number): void;
	delete(key: string): void;
	clear(): void;
}

export interface CacheStats {
	hits: number;
	misses: number;
	totalEntries: number;
	hitRatio: number;
	estimatedMemoryUsage: number; // in bytes
}