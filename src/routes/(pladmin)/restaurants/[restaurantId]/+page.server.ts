import type { PageServerLoad } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { serverApiFetch } from '$lib/utils/api-call-for-server';
import { withDbCache } from '$lib/cache/db-cache';
import { generateETag } from '$lib/cache/http-cache';
import { cacheConfig } from '$lib/cache/config';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch, cookies, request, setHeaders }) => {
  const { restaurantId } = params;
  const token = cookies.get('session');

  const cacheKey = `restaurant:${restaurantId}`;
  const cacheTags = ['restaurants', cacheKey];

  const getRestaurantData = async () => {
    console.log(`Fetching restaurant ${restaurantId} from backend...`);
    return serverApiFetch(fetch, `${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const restaurant = await withDbCache(
    {
      key: cacheKey,
      tags: cacheTags,
      ttl: cacheConfig.ttl.dynamic // Use dynamic TTL for frequently changing data
    },
    getRestaurantData
  );

  if (!restaurant) {
    // Handle case where restaurant is not found or API returns empty
    throw error(404, 'Restaurant not found');
  }

  const etag = generateETag(JSON.stringify(restaurant));

  // Set HTTP cache headers
  setHeaders({
    'ETag': etag,
    'Cache-Control': `public, max-age=${cacheConfig.ttl.dynamic / 1000}` // Convert ms to seconds
  });

  // Check client's ETag for 304 response
  if (request.headers.get('if-none-match') === etag) {
    throw error(304); // Throw 304 error for Not Modified
  }

  return {
    restaurant,
  };
};
