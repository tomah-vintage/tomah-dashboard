<script lang="ts">
  import { createPatchRestaurantMutation, createGetRestaurantByIdQuery } from '$lib/queries/restaurant-queries';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import MapLocationPicker from "$lib/components/ui/MapLocationPicker.svelte";
  import WeeklyHoursInput from "$lib/components/ui/WeeklyHoursInput.svelte";
  import type { RestaurantSettingsData } from '$lib/types/restaurant';
  import { toast } from 'svelte-french-toast';

  export let restaurantId: string;

  // Get current restaurant data
  $: getRestaurant = createGetRestaurantByIdQuery(restaurantId);
  $: ({ data: restaurant, isLoading: isLoadingRestaurant } = $getRestaurant);

  // Create the PATCH mutation
  const patchRestaurantMutation = createPatchRestaurantMutation();
  $: ({ mutate: patchRestaurant, isPending: isSaving } = $patchRestaurantMutation);

  // Form data - initialize with restaurant data when available
  let formData: RestaurantSettingsData = {};

  // Update form when restaurant data loads
  $: if (restaurant && !isLoadingRestaurant) {
    formData = {
      name: restaurant.name || '',
      address: restaurant.address || '',
      latitude: restaurant.latitude || undefined,
      longitude: restaurant.longitude || undefined,
      opening_hours: restaurant.opening_hours || ''
    };
  }

  // Handle form submission
  function handleSubmit(e: Event) {
    e.preventDefault();
    
    // Filter out undefined/empty values to only send changed fields
    const dataToUpdate: RestaurantSettingsData = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        (dataToUpdate as any)[key] = value;
      }
    });

    patchRestaurant(
      { id: restaurantId, data: dataToUpdate },
      {
        onSuccess: () => {
          toast.success('Ресторанй мэдээлэл амжилттай шинэчлэгдлээ');
        },
        onError: (error) => {
          toast.error(`Алдаа гарлаа: ${error.message}`);
        }
      }
    );
  }


  function handleLocationChange(lat: number, lng: number) {
    formData.latitude = lat;
    formData.longitude = lng;
  }

  function handleHoursChange(hours: string) {
    formData.opening_hours = hours;
  }

</script>

{#if isLoadingRestaurant}
  <div class="flex justify-center items-center py-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
{:else if restaurant}
  <div class="space-y-8">
    
    <!-- Basic Information Section -->
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-blue-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Үндсэн мэдээлэл</h2>
          <p class="text-sm text-gray-600 mt-1">Рестораны нэр, хаяг</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <Input
            label="Рестораны нэр"
            placeholder="Рестораны нэрээ оруулна уу"
            bind:value={formData.name}
          />
        </div>

        <div class="md:col-span-2">
          <Input
            label="Хаяг"
            type="textarea"
            placeholder="Рестораны хаягаа оруулна уу"
            bind:value={formData.address}
          />
        </div>
      </div>
    </div>

    <!-- Location Section -->
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-green-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Байршил</h2>
          <p class="text-sm text-gray-600 mt-1">Газрын зураг дээрээс байршлаа сонгоно уу</p>
        </div>
      </div>

      <MapLocationPicker
        latitude={formData.latitude || 47.9143}
        longitude={formData.longitude || 106.9167}
        onLocationChange={handleLocationChange}
      />
    </div>


    <!-- Operating Hours Section -->
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-orange-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Ажлын цаг</h2>
          <p class="text-sm text-gray-600 mt-1">Долоо хоногийн ажлын цагийг тохируулна уу</p>
        </div>
      </div>

      <WeeklyHoursInput
        value={formData.opening_hours}
        onChange={handleHoursChange}
      />
    </div>


    <!-- Save Section -->
    <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Өөрчлөлт хадгалах</h3>
          <p class="text-sm text-gray-600 mt-1">
            Бүх хэсэгт хийсэн өөрчлөлтийг хадгална уу
          </p>
        </div>
        <Button
          on:click={handleSubmit}
          disabled={isSaving}
          variant="primary"
          size="lg"
          class="px-8"
        >
          {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
        </Button>
      </div>
    </div>

  </div>
{:else}
  <div class="text-center py-8">
    <p class="text-gray-500">Ресторанй мэдээлэл олдсонгүй</p>
  </div>
{/if}