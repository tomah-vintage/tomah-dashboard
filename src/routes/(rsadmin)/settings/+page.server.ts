import type { PageServerLoad, Actions } from './$types';
import { serverApiFetch } from '$lib/utils/api-call-for-server';
import { fail } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from "$env/static/public";

export const load: PageServerLoad = async ({ locals, ...rest }) => {
  const { user } = locals;
  if (!user || !user.restaurantId) {
    return { restaurant: null };
  }

  try {
    const restaurant = await serverApiFetch(rest.fetch, `${PUBLIC_BACKEND_URL}/api/restaurants/${user.restaurantId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${rest.cookies.get('session')}`
      }
    });
    return { restaurant };
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return { restaurant: null };
  }
};

export const actions: Actions = {
  default: async ({ request, locals, ...rest }) => {
    const data = await request.formData();
    const { user } = locals;

    if (!user || !user.restaurantId) {
      return fail(400, { message: 'User or restaurant ID not found.' });
    }

    const { open_hours: openHoursJson, ...restaurantData } = Object.fromEntries(data.entries());
    const openHours = JSON.parse(openHoursJson as string);


    try {
      await serverApiFetch(rest.fetch, `${PUBLIC_BACKEND_URL}/api/restaurants/${user.restaurantId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${rest.cookies.get('session')}`
        },
        body: JSON.stringify({ ...restaurantData, open_hours: openHours })
      });
      return { success: true, message: 'Restaurant updated successfully!' };
    } catch (error) {
      console.error('Error updating restaurant:', error);
      return fail(500, { message: 'An unexpected error occurred.' });
    }
  },
};