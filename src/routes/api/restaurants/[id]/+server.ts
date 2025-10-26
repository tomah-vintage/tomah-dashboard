import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateRestaurant, deleteRestaurant } from '$lib/server/database';

// PUT (update) a restaurant
export const PUT: RequestHandler = async ({ request, params }) => {
  const { id } = params;
  const updatedData = await request.json();
  const updatedRestaurant = updateRestaurant(id, updatedData);

  if (updatedRestaurant) {
    return json(updatedRestaurant);
  } else {
    return json({ message: 'Restaurant not found' }, { status: 404 });
  }
};

// PATCH (partial update) a restaurant  
export const PATCH: RequestHandler = async ({ request, params }) => {
  const { id } = params;
  const partialData = await request.json();
  
  // For PATCH, we only update the fields that are provided
  const updatedRestaurant = updateRestaurant(id, partialData);

  if (updatedRestaurant) {
    return json(updatedRestaurant);
  } else {
    return json({ message: 'Restaurant not found' }, { status: 404 });
  }
};

// DELETE a restaurant
export const DELETE: RequestHandler = async ({ params }) => {
  const { id } = params;
  const success = deleteRestaurant(id);

  if (success) {
    return new Response(null, { status: 204 });
  } else {
    return json({ message: 'Restaurant not found' }, { status: 404 });
  }
};
