import type { PageServerLoad } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { serverApiFetch } from '$lib/utils/api-call-for-server';

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
  const { restaurantId } = params;
  const token = cookies.get('session');

  const restaurant = await serverApiFetch(fetch, `${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    restaurant,
  };
};
