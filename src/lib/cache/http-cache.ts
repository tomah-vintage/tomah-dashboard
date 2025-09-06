import { createHash } from 'crypto';

export type CacheStrategy = 'public-static' | 'public-dynamic' | 'private';

interface CacheHeaderOptions {
	strategy: CacheStrategy;
	etag: string;
}

/**
 * Generates a weak ETag from a given string.
 * @param content The content to hash.
 * @returns A weak ETag string.
 */
export function generateETag(content: string): string {
	const hash = createHash('sha1').update(content).digest('base64');
	return `W/"${hash}"`;
}

/**
 * Sets the Cache-Control and ETag headers on a Response object.
 * @param response The SvelteKit Response object.
 * @param options The caching strategy and ETag.
 */
export function setCacheHeaders(response: Response, options: CacheHeaderOptions): void {
	const { strategy, etag } = options;

	response.headers.set('ETag', etag);

	switch (strategy) {
		case 'public-static':
			// Cache on browsers and CDNs for 1 hour
			response.headers.set('Cache-Control', 'public, max-age=3600');
			break;
		case 'public-dynamic':
			// Cache on browsers and CDNs for 5 minutes
			response.headers.set('Cache-Control', 'public, max-age=300');
			break;
		case 'private':
			// Do not cache on public CDNs, but allow private browser caching
			response.headers.set('Cache-Control', 'private, max-age=300');
			break;
	}
}
