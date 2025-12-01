import { writable, derived } from "svelte/store";
import type { RestaurantSettingsData } from "$lib/types/restaurant";

interface RestaurantSettingsState {
  formData: RestaurantSettingsData;
  originalFormData: RestaurantSettingsData;
  newBonumApiKey: string;
  newBonumSecretKey: string;
  containerFeeDisplay: string;
  currentApiKey: string;
}

function createRestaurantSettingsStore() {
  const initialState: RestaurantSettingsState = {
    formData: {},
    originalFormData: {},
    newBonumApiKey: "",
    newBonumSecretKey: "",
    containerFeeDisplay: "0",
    currentApiKey: "",
  };

  const { subscribe, set, update } =
    writable<RestaurantSettingsState>(initialState);

  // Derived store to check for changes
  const hasChanges = derived({ subscribe }, ($state) => {
    if (Object.keys($state.originalFormData).length === 0) return false;

    return (
      $state.formData.name !== $state.originalFormData.name ||
      $state.formData.address !== $state.originalFormData.address ||
      $state.formData.latitude !== $state.originalFormData.latitude ||
      $state.formData.longitude !== $state.originalFormData.longitude ||
      $state.formData.takeout_container_price !==
        $state.originalFormData.takeout_container_price ||
      JSON.stringify($state.formData.open_hours) !==
        JSON.stringify($state.originalFormData.open_hours) ||
      $state.newBonumApiKey !== "" ||
      $state.newBonumSecretKey !== ""
    );
  });

  return {
    subscribe,
    set,
    update,
    hasChanges,

    // Initialize form with restaurant data
    initialize: (data: RestaurantSettingsData, apiKey: string = "") => {
      const formData = {
        name: data.name || "",
        address: data.address || "",
        latitude: data.latitude,
        longitude: data.longitude,
        open_hours: data.open_hours || [],
        takeout_container_price: data.takeout_container_price || "0",
      };

      update((state) => ({
        ...state,
        formData,
        originalFormData: { ...formData },
        currentApiKey: apiKey,
        containerFeeDisplay: data.takeout_container_price || "0",
        newBonumApiKey: "",
        newBonumSecretKey: "",
      }));
    },

    // Update a form field
    updateField: (field: keyof RestaurantSettingsData, value: any) => {
      update((state) => ({
        ...state,
        formData: {
          ...state.formData,
          [field]: value,
        },
      }));
    },

    // Update container fee
    updateContainerFee: (value: string) => {
      update((state) => ({
        ...state,
        containerFeeDisplay: value,
        formData: {
          ...state.formData,
          takeout_container_price: value,
        },
      }));
    },

    // Update credentials
    updateCredentials: (apiKey: string, secretKey: string) => {
      update((state) => ({
        ...state,
        newBonumApiKey: apiKey,
        newBonumSecretKey: secretKey,
      }));
    },

    // Reset after successful save
    resetChanges: () => {
      update((state) => ({
        ...state,
        originalFormData: { ...state.formData },
        newBonumApiKey: "",
        newBonumSecretKey: "",
      }));
    },

    // Reset store
    reset: () => set(initialState),
  };
}

export const restaurantSettingsStore = createRestaurantSettingsStore();
