import { PUBLIC_CACHE_ENABLED, PUBLIC_CACHE_TTL_STATIC_MIN, PUBLIC_CACHE_TTL_DYNAMIC_MIN, PUBLIC_CACHE_TTL_API_MIN } from '$env/static/public';

// Parse boolean from string, default to true if undefined
const enabled = PUBLIC_CACHE_ENABLED === 'false' ? false : true;

// Parse TTLs from minutes to milliseconds, with defaults
const staticTtl = (parseInt(PUBLIC_CACHE_TTL_STATIC_MIN || '60') * 60 * 1000);
const dynamicTtl = (parseInt(PUBLIC_CACHE_TTL_DYNAMIC_MIN || '5') * 60 * 1000);
const apiTtl = (parseInt(PUBLIC_CACHE_TTL_API_MIN || '10') * 60 * 1000);

/**
 * Centralized configuration for the application's caching system.
 * Reads from environment variables to allow for different settings per environment.
 */
export const cacheConfig = {
	enabled,
	ttl: {
		static: staticTtl,    // For data that rarely changes
		dynamic: dynamicTtl, // For data that changes frequently
		api: apiTtl          // For external API calls
	}
};