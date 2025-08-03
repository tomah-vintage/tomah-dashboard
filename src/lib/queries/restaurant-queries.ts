import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';

// Fetch all restaurants
export const createGetRestaurantsQuery = () => createQuery<Restaurant[], Error>({
  queryKey: ['restaurants'],
  queryFn: async () => {
    const response = await fetch('/api/restaurants');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
});

// Add a new restaurant
export const createAddRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<Restaurant, Error, RestaurantFormData>({
    mutationFn: async (newRestaurant) => {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRestaurant),
      });
      if (!response.ok) {
        throw new Error('Failed to create restaurant');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};

// Update an existing restaurant
export const createUpdateRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<Restaurant, Error, { id: string; data: RestaurantFormData }>({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }
      return response.json();
    },
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
    mutationFn: async (id) => {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete restaurant');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};