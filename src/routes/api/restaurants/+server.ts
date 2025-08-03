import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRestaurants, addRestaurant } from '$lib/server/database';

// GET all restaurants
export const GET: RequestHandler = async () => {
  const restaurants = getRestaurants();
  return json(restaurants);
};

// POST a new restaurant
export const POST: RequestHandler = async ({ request }) => {
  const newRestaurantData = await request.json();
  const newRestaurant = addRestaurant(newRestaurantData);
  return json(newRestaurant, { status: 201 });
};
