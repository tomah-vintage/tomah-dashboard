export interface Cache {
	get<T>(key: string): T | undefined;
	set<T>(key: string, value: T, ttl: number): void;
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