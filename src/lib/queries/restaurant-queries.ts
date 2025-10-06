import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Restaurant, RestaurantFormData, AdminRestaurantListResponse, AdminRestaurantDetail, MySubscriptionResponse } from '$lib/types/restaurant';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { PaginatedResponse } from '$lib/types/auth'; // Import PaginatedResponse

// Fetch all restaurants
export const createGetRestaurantsQuery = (page: number = 1, page_size: number = 10) => createQuery<PaginatedResponse<Restaurant>, Error>({
  queryKey: ['restaurants', page, page_size],
  queryFn: () => apiFetch<PaginatedResponse<Restaurant>>(`${PUBLIC_BACKEND_URL}/api/restaurants/?page=${page}&page_size=${page_size}`),
});

// Export restaurant queries object for compatibility
export const restaurantQueries = {
  getRestaurants: (filters: { page?: number; pageSize?: number } = {}) => ({
    queryKey: ['restaurants', filters],
    queryFn: async (): Promise<{ restaurants: Restaurant[] }> => {
      const page = filters.page || 1;
      const page_size = filters.pageSize || 100;
      const response = await apiFetch<PaginatedResponse<Restaurant>>(`${PUBLIC_BACKEND_URL}/api/restaurants/?page=${page}&page_size=${page_size}`);
      return { restaurants: response.results };
    }
  })
};

// Fetch a single restaurant by ID
export const createGetRestaurantByIdQuery = (id: string | undefined) => createQuery<Restaurant, Error>({
  queryKey: ['restaurant', id],
  queryFn: () => apiFetch<Restaurant>(`${PUBLIC_BACKEND_URL}/api/restaurants/${id}/`),
  enabled: !!id,
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

// ===== NEW ADMIN RESTAURANT ENDPOINTS =====

// Fetch admin restaurant list with metrics and user info
export const createGetAdminRestaurantsQuery = (page: number = 1, page_size: number = 10) => 
  createQuery<AdminRestaurantListResponse, Error>({
    queryKey: ['admin-restaurants', page, page_size],
    queryFn: () => apiFetch<AdminRestaurantListResponse>(
      `${PUBLIC_BACKEND_URL}/api/admin/restaurants/?page=${page}&page_size=${page_size}`
    ),
  });

// Fetch detailed admin restaurant data with insights
export const createGetAdminRestaurantDetailQuery = (id: string | number | undefined) => 
  createQuery<AdminRestaurantDetail, Error>({
    queryKey: ['admin-restaurant-detail', id],
    queryFn: () => apiFetch<AdminRestaurantDetail>(
      `${PUBLIC_BACKEND_URL}/api/admin/restaurants/${id}/`
    ),
    enabled: !!id,
  });

// Add user to restaurant
export const createAddUserToRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<any, Error, { restaurantId: string | number; userData: { email: string; first_name: string; last_name: string; phone: string; password: string; role: number } }>({
    mutationFn: ({ restaurantId, userData }) => 
      apiFetch(`${PUBLIC_BACKEND_URL}/api/admin/restaurants/${restaurantId}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurant-detail', variables.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
    },
  });
};

// Remove user from restaurant
export const createRemoveUserFromRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<void, Error, { restaurantId: string | number; userId: number }>({
    mutationFn: ({ restaurantId, userId }) => 
      apiFetch(`${PUBLIC_BACKEND_URL}/api/admin/restaurants/${restaurantId}/users/${userId}/`, {
        method: 'DELETE',
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurant-detail', variables.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
    },
  });
};

// ===== RESTAURANT ADMIN SUBSCRIPTION ENDPOINT =====

// Fetch restaurant admin's own subscription
export const createGetMySubscriptionQuery = () => 
  createQuery<MySubscriptionResponse, Error>({
    queryKey: ['my-subscription'],
    queryFn: () => apiFetch<MySubscriptionResponse>(`${PUBLIC_BACKEND_URL}/api/my-subscription/`),
  });