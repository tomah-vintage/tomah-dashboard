import { createQuery } from "@tanstack/svelte-query";
import type {
  Restaurant,
  AdminRestaurantListResponse,
  AdminRestaurantDetail,
} from "$lib/types/restaurant";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { PaginatedResponse } from "$lib/types/auth";

// Fetch all restaurants (src/lib/queries/restaurant-queries.ts:24-35)
export const createGetRestaurantsQuery = (
  page: number = 1,
  page_size: number = 10,
) =>
  createQuery<PaginatedResponse<Restaurant>, Error>({
    queryKey: ["restaurants", page, page_size],
    queryFn: () =>
      apiFetch<PaginatedResponse<Restaurant>>(
        `${PUBLIC_BACKEND_URL}/api/restaurants/?page=${page}&page_size=${page_size}`,
      ),
  });

// Export restaurant queries object for compatibility (src/lib/queries/restaurant-queries.ts:37-50)
export const restaurantQueries = {
  getRestaurants: (filters: { page?: number; pageSize?: number } = {}) => ({
    queryKey: ["restaurants", filters],
    queryFn: async (): Promise<{ restaurants: Restaurant[] }> => {
      const page = filters.page || 1;
      const page_size = filters.pageSize || 100;
      const response = await apiFetch<PaginatedResponse<Restaurant>>(
        `${PUBLIC_BACKEND_URL}/api/restaurants/?page=${page}&page_size=${page_size}`,
      );
      return { restaurants: response.results };
    },
  }),
};

// Fetch a single restaurant by ID (src/lib/queries/restaurant-queries.ts:52-59)
export const createGetRestaurantByIdQuery = (id: string | undefined) =>
  createQuery<Restaurant, Error>({
    queryKey: ["restaurant", id],
    queryFn: () =>
      apiFetch<Restaurant>(`${PUBLIC_BACKEND_URL}/api/restaurants/${id}/`),
    enabled: !!id,
  });

// Fetch admin restaurant list with metrics and user info (src/lib/queries/restaurant-queries.ts:144-155)
export const createGetAdminRestaurantsQuery = (
  page: number = 1,
  page_size: number = 10,
) =>
  createQuery<AdminRestaurantListResponse, Error>({
    queryKey: ["admin-restaurants", page, page_size],
    queryFn: () =>
      apiFetch<AdminRestaurantListResponse>(
        `${PUBLIC_BACKEND_URL}/api/admin/restaurants/?page=${page}&page_size=${page_size}`,
      ),
  });

// Fetch detailed admin restaurant data with insights (src/lib/queries/restaurant-queries.ts:157-168)
export const createGetAdminRestaurantDetailQuery = (
  id: string | number | undefined,
) =>
  createQuery<AdminRestaurantDetail, Error>({
    queryKey: ["admin-restaurant-detail", id],
    queryFn: () =>
      apiFetch<AdminRestaurantDetail>(
        `${PUBLIC_BACKEND_URL}/api/admin/restaurants/${id}/`,
      ),
    enabled: !!id,
  });

// Fetch restaurant details for restaurant admin (src/lib/queries/restaurant-queries.ts:232-236)
export const getRestaurantDetails = (restaurantId: string | number) =>
  apiFetch<AdminRestaurantDetail>(
    `${PUBLIC_BACKEND_URL}/api/admin/restaurants/${restaurantId}/`,
  );
