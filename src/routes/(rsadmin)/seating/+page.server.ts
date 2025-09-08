import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { SeatingTable } from '$lib/types/seating';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { withDbCache } from '$lib/cache/db-cache';
import { generateETag } from '$lib/cache/http-cache';
import { cacheConfig } from '$lib/cache/config';
import { serverApiFetch } from '$lib/utils/api-call-for-server';

export const load: PageServerLoad = async ({ locals, setHeaders, ...rest }) => {
  const user = locals.user;
  const userRole = user?.role_name;

  if (userRole === 'admin') {
    throw redirect(303, '/');
  }

  try {
    const cacheKey = 'seating:tables:all';
    const cacheTags = ['seating'];

    const getTablesFromApi = async () => {
      console.log('Fetching seating tables from API...');
      return serverApiFetch<SeatingTable[]>(rest.fetch, `${PUBLIC_BACKEND_URL}/api/table/`, {
        headers: {
          'Authorization': `Bearer ${rest.cookies.get('session')}`
        }
      });
    };

    const tables = await withDbCache(
      { key: cacheKey, tags: cacheTags, ttl: cacheConfig.ttl.dynamic },
      getTablesFromApi
    );

    const etag = generateETag(JSON.stringify(tables));

    // Set HTTP cache headers
    setHeaders({
      'ETag': etag,
      'Cache-Control': `public, max-age=${cacheConfig.ttl.dynamic / 1000}` // Convert ms to seconds
    });

    // Browser will handle 304 responses automatically based on ETag

    return { tables };

  } catch (err) {
    console.error('Failed to load seating tables:', err);
    // Return an empty array or handle the error gracefully for the page
    return { tables: [] };
  }
};