import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Types for restaurant staff (src/lib/queries/restaurant-queries.ts:240-259)
export interface RestaurantStaffUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: number;
  created_at: string;
  updated_at: string;
  last_login: string;
  restaurant: number;
}

export interface RestaurantStaffResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RestaurantStaffUser[];
}

// Fetch restaurant staff (src/lib/queries/restaurant-queries.ts:261-267)
export const createGetRestaurantStaffQuery = () =>
  createQuery<RestaurantStaffResponse, Error>({
    queryKey: ["restaurant-staff"],
    queryFn: () =>
      apiFetch<RestaurantStaffResponse>(`${PUBLIC_BACKEND_URL}/api/users/`),
  });

// Create new restaurant staff (src/lib/queries/restaurant-queries.ts:269-295)
export const createAddRestaurantStaffMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    RestaurantStaffUser,
    Error,
    {
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
      role: number;
      restaurant: number;
      password: string;
    }
  >({
    mutationFn: (userData) =>
      apiFetch<RestaurantStaffUser>(`${PUBLIC_BACKEND_URL}/api/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-staff"] });
    },
  });
};

// Update restaurant staff (src/lib/queries/restaurant-queries.ts:297-324)
export const createUpdateRestaurantStaffMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    RestaurantStaffUser,
    Error,
    {
      id: string | number;
      data: Partial<{
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        role: number;
      }>;
    }
  >({
    mutationFn: ({ id, data }) =>
      apiFetch<RestaurantStaffUser>(`${PUBLIC_BACKEND_URL}/api/users/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-staff"] });
    },
  });
};

// Delete restaurant staff (src/lib/queries/restaurant-queries.ts:326-338)
export const createDeleteRestaurantStaffMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<void, Error, string | number>({
    mutationFn: (id) =>
      apiFetch(`${PUBLIC_BACKEND_URL}/api/users/${id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-staff"] });
    },
  });
};
