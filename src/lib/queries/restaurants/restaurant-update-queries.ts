import { createMutation, useQueryClient } from "@tanstack/svelte-query";
import type {
  Restaurant,
  RestaurantFormData,
  RestaurantSettingsData,
} from "$lib/types/restaurant";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Update an existing restaurant (src/lib/queries/restaurant-queries.ts:78-96)
export const createUpdateRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    Restaurant,
    Error,
    { id: string; data: RestaurantFormData }
  >({
    mutationFn: ({ id, data }) =>
      apiFetch<Restaurant>(`${PUBLIC_BACKEND_URL}/api/restaurants/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", variables.id] });
    },
  });
};

// Update restaurant settings using PUT (src/lib/queries/restaurant-queries.ts:98-126)
export const createPatchRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    Restaurant,
    Error,
    { id: string; data: RestaurantSettingsData }
  >({
    mutationFn: ({ id, data }) => {
      console.log("🔧 PUT Restaurant Request:", {
        url: `${PUBLIC_BACKEND_URL}/api/restaurants/${id}/`,
        method: "PUT",
        data,
      });
      return apiFetch<Restaurant>(
        `${PUBLIC_BACKEND_URL}/api/restaurants/${id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", variables.id] });
    },
  });
};
