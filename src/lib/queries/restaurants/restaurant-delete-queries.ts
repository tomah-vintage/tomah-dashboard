import { createMutation, useQueryClient } from "@tanstack/svelte-query";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Delete a restaurant (src/lib/queries/restaurant-queries.ts:128-140)
export const createDeleteRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<void, Error, string>({
    mutationFn: (id) =>
      apiFetch<void>(`${PUBLIC_BACKEND_URL}/api/restaurants/${id}/`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
};

// Remove user from restaurant (src/lib/queries/restaurant-queries.ts:206-228)
export const createRemoveUserFromRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    void,
    Error,
    { restaurantId: string | number; userId: number }
  >({
    mutationFn: ({ restaurantId, userId }) =>
      apiFetch(
        `${PUBLIC_BACKEND_URL}/api/admin/restaurants/${restaurantId}/users/${userId}/`,
        {
          method: "DELETE",
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
