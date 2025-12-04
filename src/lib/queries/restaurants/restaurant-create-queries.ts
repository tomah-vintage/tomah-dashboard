import { createMutation, useQueryClient } from "@tanstack/svelte-query";
import type { Restaurant, RestaurantFormData } from "$lib/types/restaurant";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Add a new restaurant (src/lib/queries/restaurant-queries.ts:62-75)
export const createAddRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<Restaurant, Error, RestaurantFormData>({
    mutationFn: (newRestaurant) =>
      apiFetch<Restaurant>(`${PUBLIC_BACKEND_URL}/api/restaurants/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRestaurant),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
};

// Add user to restaurant (src/lib/queries/restaurant-queries.ts:171-204)
export const createAddUserToRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    any,
    Error,
    {
      restaurantId: string | number;
      userData: {
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        password: string;
        role: number;
      };
    }
  >({
    mutationFn: ({ restaurantId, userData }) =>
      apiFetch(
        `${PUBLIC_BACKEND_URL}/api/admin/restaurants/${restaurantId}/users/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        },
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-restaurant-detail", variables.restaurantId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
    },
  });
};
