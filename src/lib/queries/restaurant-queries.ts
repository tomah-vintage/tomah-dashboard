import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

// Fetch all restaurants
export const createGetRestaurantsQuery = () => createQuery<Restaurant[], Error>({
  queryKey: ['restaurants'],
  queryFn: () => apiFetch<Restaurant[]>(`${PUBLIC_BACKEND_URL}/api/restaurants/`),
});

// Add a new restaurant
export const createAddRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<Restaurant, Error, RestaurantFormData>({
    mutationFn: (newRestaurant) => apiFetch<Restaurant>(`${PUBLIC_BACKEND_URL}/api/restaurants/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRestaurant),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};

// Update an existing restaurant
export const createUpdateRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<Restaurant, Error, { id: string; data: RestaurantFormData }>({
    mutationFn: ({ id, data }) => apiFetch<Restaurant>(`${PUBLIC_BACKEND_URL}/api/restaurants/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', variables.id] });
    },
  });
};

// Delete a restaurant
export const createDeleteRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<void, Error, string>({
    mutationFn: (id) => apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/restaurants/${id}/`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};