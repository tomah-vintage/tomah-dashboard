import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
import type { MySubscriptionResponse } from "$lib/types/restaurant";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Fetch restaurant admin's own subscription (src/lib/queries/restaurant-queries.ts:340-348)
export const createGetMySubscriptionQuery = () =>
  createQuery<MySubscriptionResponse, Error>({
    queryKey: ["my-subscription"],
    queryFn: () =>
      apiFetch<MySubscriptionResponse>(
        `${PUBLIC_BACKEND_URL}/api/my-subscription/`,
      ),
  });

// Activate subscription (src/lib/queries/restaurant-queries.ts:350-375)
export const createActivateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    any,
    Error,
    { subscriptionId: string | number; restaurantId?: string | number }
  >({
    mutationFn: ({ subscriptionId }) =>
      apiFetch(
        `${PUBLIC_BACKEND_URL}/api/subscription/${subscriptionId}/activate/`,
        {
          method: "POST",
        },
      ),
    onSuccess: (data, variables) => {
      if (variables.restaurantId) {
        queryClient.invalidateQueries({
          queryKey: ["admin-restaurant-detail", variables.restaurantId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
    },
  });
};

// Deactivate subscription (src/lib/queries/restaurant-queries.ts:377-402)
export const createDeactivateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    any,
    Error,
    { subscriptionId: string | number; restaurantId?: string | number }
  >({
    mutationFn: ({ subscriptionId }) =>
      apiFetch(
        `${PUBLIC_BACKEND_URL}/api/subscription/${subscriptionId}/deactivate/`,
        {
          method: "POST",
        },
      ),
    onSuccess: (data, variables) => {
      if (variables.restaurantId) {
        queryClient.invalidateQueries({
          queryKey: ["admin-restaurant-detail", variables.restaurantId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
    },
  });
};
