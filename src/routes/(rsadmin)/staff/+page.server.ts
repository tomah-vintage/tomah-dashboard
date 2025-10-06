import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = locals;

  if (!user || user.role_name !== 'restaurant') {
    throw redirect(302, '/login');
  }

  if (!user.restaurantId) {
    throw redirect(302, '/');
  }

  return {
    user,
    restaurantId: user.restaurantId
  };
};