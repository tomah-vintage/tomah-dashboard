import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
import type {
  EbarimtConfig,
  EbarimtConfigUpdate,
  EbarimtStatusResponse,
} from "$lib/types/restaurant";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Get EBARIMT configuration for a restaurant (src/lib/queries/restaurant-queries.ts:406-417)
export const createGetEbarimtConfigQuery = (
  restaurantId: string | number | undefined,
) =>
  createQuery<EbarimtConfig, Error>({
    queryKey: ["ebarimt-config", restaurantId],
    queryFn: () =>
      apiFetch<EbarimtConfig>(
        `${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/ebarimt-config/`,
      ),
    enabled: !!restaurantId,
  });

// Update EBARIMT configuration (src/lib/queries/restaurant-queries.ts:419-451)
export const createUpdateEbarimtConfigMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    EbarimtConfig,
    Error,
    { restaurantId: string | number; data: EbarimtConfigUpdate }
  >({
    mutationFn: ({ restaurantId, data }) => {
      console.log("🔧 PATCH EBARIMT Config Request:", {
        url: `${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/ebarimt-config/`,
        method: "PATCH",
        data,
      });
      return apiFetch<EbarimtConfig>(
        `${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/ebarimt-config/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ebarimt-config", variables.restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["restaurant", variables.restaurantId.toString()],
      });
    },
  });
};

// Check EBARIMT registration status (src/lib/queries/restaurant-queries.ts:453-485)
export const createCheckEbarimtStatusMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    EbarimtStatusResponse,
    Error,
    { restaurantId: string | number }
  >({
    mutationFn: ({ restaurantId }) => {
      console.log("🔍 Checking EBARIMT Status:", {
        url: `${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/ebarimt-status/`,
        method: "POST",
      });
      return apiFetch<EbarimtStatusResponse>(
        `${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/ebarimt-status/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ebarimt-config", variables.restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["restaurant", variables.restaurantId.toString()],
      });
    },
  });
};

// Sync merchant registration status (src/lib/queries/restaurant-queries.ts:487-523)
export const createSyncMerchantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<
    {
      success: boolean;
      message: string;
      data: {
        restaurant_id: number;
        restaurant_name: string;
        restaurant_tin: string;
        merchant_registered: boolean;
        status_changed: boolean;
      };
    },
    Error,
    void
  >({
    mutationFn: () => {
      console.log("🔄 Syncing Merchant Status:", {
        url: `${PUBLIC_BACKEND_URL}/api/merchants/sync/`,
        method: "POST",
      });
      return apiFetch(`${PUBLIC_BACKEND_URL}/api/merchants/sync/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ebarimt-config"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
};
