<script lang="ts">
  import {
    createPatchRestaurantMutation,
    createGetRestaurantByIdQuery,
  } from "$lib/queries/restaurant-queries";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import { toast } from "svelte-french-toast";
  import { restaurantSettingsStore } from "$lib/stores/restaurantSettingsStore";
  import BasicInfoSection from "./sections/BasicInfoSection.svelte";
  import ContainerFeeSection from "./sections/ContainerFeeSection.svelte";
  import LocationSection from "./sections/LocationSection.svelte";
  import OperatingHoursSection from "./sections/OperatingHoursSection.svelte";
  import PaymentCredentialsSection from "./sections/PaymentCredentialsSection.svelte";
  import FloatingSaveButton from "./FloatingSaveButton.svelte";
  import type { RestaurantSettingsData } from "$lib/types/restaurant";

  export let restaurantId: string;

  // Get current restaurant data
  $: getRestaurant = createGetRestaurantByIdQuery(restaurantId);
  $: ({ data: restaurant, isLoading: isLoadingRestaurant } = $getRestaurant);

  // Create the PATCH mutation
  const patchRestaurantMutation = createPatchRestaurantMutation();
  $: ({ mutate: patchRestaurant, isPending: isSaving } =
    $patchRestaurantMutation);

  // Initialize store when restaurant data loads
  $: if (restaurant && !isLoadingRestaurant) {
    restaurantSettingsStore.initialize(
      {
        name: restaurant.name,
        address: restaurant.address,
        latitude:
          typeof restaurant.latitude === "string"
            ? parseFloat(restaurant.latitude)
            : restaurant.latitude,
        longitude:
          typeof restaurant.longitude === "string"
            ? parseFloat(restaurant.longitude)
            : restaurant.longitude,
        open_hours: restaurant.open_hours || restaurant.opening_hours || [],
        takeout_container_price: restaurant.takeout_container_price || "0",
      },
      restaurant.bonum_api_key || "",
    );
  }

  // Handle form submission
  function handleSubmit() {
    let state;
    restaurantSettingsStore.subscribe((s) => (state = s))();

    if (!state) return;

    // Filter out undefined/empty values to only send changed fields
    const dataToUpdate: RestaurantSettingsData = {};
    Object.entries(state.formData).forEach(([key, value]) => {
      // Special handling for open_hours - it's already an array
      if (key === "open_hours") {
        if (Array.isArray(value) && value.length > 0) {
          (dataToUpdate as any)[key] = value;
        } else {
          (dataToUpdate as any)[key] = [];
        }
      } else if (value !== undefined && value !== "" && value !== null) {
        (dataToUpdate as any)[key] = value;
      }
    });

    // Add Bonum credentials if provided
    if (state.newBonumApiKey) {
      dataToUpdate.bonum_api_key = state.newBonumApiKey;
    }
    if (state.newBonumSecretKey) {
      dataToUpdate.bonum_secret_key = state.newBonumSecretKey;
    }

    console.log("Илгээгдэж буй формын өгөгдөл:", dataToUpdate);

    patchRestaurant(
      { id: restaurantId, data: dataToUpdate },
      {
        onSuccess: () => {
          toast.success("Рестораны мэдээлэл амжилттай шинэчлэгдлээ");
          restaurantSettingsStore.resetChanges();
        },
        onError: (error) => {
          toast.error(`Алдаа гарлаа: ${error.message}`);
        },
      },
    );
  }
</script>

{#if isLoadingRestaurant}
  <div class="flex justify-center items-center py-8">
    <CircularLoader size="md" color="blue" />
  </div>
{:else if restaurant}
  <div class="space-y-8">
    <BasicInfoSection />

    <div class="border-t border-gray-200"></div>

    <ContainerFeeSection />

    <div class="border-t border-gray-200"></div>

    <LocationSection />

    <div class="border-t border-gray-200"></div>

    <OperatingHoursSection />

    <div class="border-t border-gray-200"></div>

    <PaymentCredentialsSection />

    <FloatingSaveButton onSave={handleSubmit} {isSaving} />
  </div>
{:else}
  <div class="text-center py-8">
    <p class="text-gray-500">Рестораны мэдээлэл олдсонгүй</p>
  </div>
{/if}
