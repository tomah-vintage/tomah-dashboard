import type { PageServerLoad } from './$types';
import type { Banner } from '$lib/types/banner';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { serverApiFetch } from '$lib/utils/api-call-for-server';

export const load: PageServerLoad = async ({ fetch: customFetch, cookies }) => {
  try {
    // Get authorization token from cookies
    const token = cookies.get('session');

    if (!token) {
      console.error('No auth token found');
      return {
        banners: []
      };
    }

    // Fetch banners from the backend API
    const response = await serverApiFetch(customFetch, `${PUBLIC_BACKEND_URL}/api/banner/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const banners = response as unknown as Banner[];

    return {
      banners: banners.sort((a, b) => a.order_index - b.order_index)
    };
  } catch (error) {
    console.error('Error loading banners:', error);
    return {
      banners: []
    };
  }
};