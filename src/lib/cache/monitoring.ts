import { memoryCache } from './memory-cache';

const LOG_INTERVAL_MS = 300000; // 5 minutes

/**
 * Logs the current cache statistics to the console.
 */
function logCacheStats(): void {
	const stats = memoryCache.getStats();
	console.log('-- Cache Performance Stats --');
	console.table(stats);
}

/**
 * Starts a periodic job to log cache stats.
 */
export function startPeriodicCacheLogging(): void {
	if (process.env.NODE_ENV === 'development') {
		console.log(`Starting periodic cache logging every ${LOG_INTERVAL_MS / 60000} minutes.`);
		setInterval(logCacheStats, LOG_INTERVAL_MS);
	}
}
