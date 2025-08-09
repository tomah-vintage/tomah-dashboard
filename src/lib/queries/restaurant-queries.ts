import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';
import { apiFetch } from '$lib/utils/api';

// Fetch all restaurants
export const createGetRestaurantsQuery = () => createQuery<Restaurant[], Error>({
  queryKey: ['restaurants'],
  queryFn: () => apiFetch<Restaurant[]>('https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/restaurants/'),
});

// Add a new restaurant
export const createAddRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<Restaurant, Error, RestaurantFormData>({
    mutationFn: (newRestaurant) => apiFetch<Restaurant>('https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/restaurants/', {
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
    mutationFn: ({ id, data }) => apiFetch<Restaurant>(`https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/restaurants/${id}/`, {
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
    mutationFn: (id) => apiFetch<void>(`https://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/restaurants/${id}/`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};