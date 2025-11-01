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

  // Separate state for credentials to avoid confusion
  let currentApiKey: string = '';
  let newBonumApiKey: string = '';
  let newBonumSecretKey: string = '';

  // Update form when restaurant data loads
  $: if (restaurant && !isLoadingRestaurant) {
    formData = {
      name: restaurant.name || '',
      address: restaurant.address || '',
      latitude: typeof restaurant.latitude === 'string' ? parseFloat(restaurant.latitude) : restaurant.latitude || undefined,
      longitude: typeof restaurant.longitude === 'string' ? parseFloat(restaurant.longitude) : restaurant.longitude || undefined,
      open_hours: restaurant.open_hours || restaurant.opening_hours || ''
    };
    // Set current API key for display only
    currentApiKey = restaurant.bonum_api_key || '';
  }

  // Handle form submission
  function handleSubmit(e: Event) {
    e.preventDefault();

    // Filter out undefined/empty values to only send changed fields
    const dataToUpdate: RestaurantSettingsData = {};
    Object.entries(formData).forEach(([key, value]) => {
      // Special handling for open_hours - parse JSON string to array
      if (key === 'open_hours') {
        if (value && typeof value === 'string') {
          try {
            (dataToUpdate as any)[key] = JSON.parse(value);
          } catch (error) {
            console.error('Error parsing open_hours JSON:', error);
            (dataToUpdate as any)[key] = [];
          }
        } else {
          (dataToUpdate as any)[key] = [];
        }
      } else if (value !== undefined && value !== '' && value !== null) {
        (dataToUpdate as any)[key] = value;
      }
    });

    // Add Bonum credentials if provided
    if (newBonumApiKey) {
      dataToUpdate.bonum_api_key = newBonumApiKey;
    }
    if (newBonumSecretKey) {
      dataToUpdate.bonum_secret_key = newBonumSecretKey;
    }

    console.log('Form data being sent:', dataToUpdate);

    patchRestaurant(
      { id: restaurantId, data: dataToUpdate },
      {
        onSuccess: () => {
          toast.success('Ресторанй мэдээлэл амжилттай шинэчлэгдлээ');
          // Clear credentials fields after successful update
          newBonumApiKey = '';
          newBonumSecretKey = '';
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
    formData.open_hours = hours;
  }

</script>

{#if isLoadingRestaurant}
  <div class="flex justify-center items-center py-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
{:else if restaurant}
  <div class="space-y-8">

    <!-- Basic Information Section -->
    <div id="section-basic" class="scroll-mt-24">
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

    <!-- Divider -->
    <div class="border-t border-gray-200"></div>

    <!-- Location Section -->
    <div id="section-location" class="scroll-mt-24">
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

    <!-- Divider -->
    <div class="border-t border-gray-200"></div>

    <!-- Operating Hours Section -->
    <div id="section-hours" class="scroll-mt-24">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-orange-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Ажлын цаг</h2>
          <p class="text-sm text-gray-600 mt-1">Долоо хоногийн ажлын цагийг тохируулна уу</p>
        </div>
      </div>

      <WeeklyHoursInput
        value={formData.open_hours}
        onChange={handleHoursChange}
      />
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200"></div>

    <!-- Payment Credentials Section -->
    <div id="section-payment" class="scroll-mt-24">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-purple-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Төлбөрийн тохиргоо</h2>
          <p class="text-sm text-gray-600 mt-1">Bonum төлбөрийн системийн нэвтрэх мэдээлэл</p>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Current API Key Display -->
        {#if currentApiKey}
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Одоогийн Terminal ID
            </label>
            <div class="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded border border-gray-300">
              {currentApiKey}
            </div>
          </div>
        {/if}

        <!-- Warning Message -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-yellow-800">Анхааруулга</h3>
              <p class="text-sm text-yellow-700 mt-1">
                App Secret-ийг хадгалсны дараа дахин харах боломжгүй. Мэдээллийг аюулгүй газарт хадгална уу.
              </p>
            </div>
          </div>
        </div>

        <!-- New Credentials Input -->
        <div class="grid grid-cols-1 gap-6">
          <div>
            <Input
              label="Terminal ID (API Key)"
              placeholder="Bonum-аас олгосон Terminal ID-ээ оруулна уу"
              bind:value={newBonumApiKey}
              type="text"
            />
            <p class="text-xs text-gray-500 mt-1">
              Энэ нь Bonum системээс олгосон Terminal ID байна
            </p>
          </div>

          <div>
            <Input
              label="App Secret"
              placeholder="Bonum-аас олгосон App Secret-ээ оруулна уу"
              bind:value={newBonumSecretKey}
              type="password"
            />
            <p class="text-xs text-gray-500 mt-1">
              Энэ мэдээллийг хадгалсны дараа дахин харах боломжгүй
            </p>
          </div>
        </div>

        <!-- Information Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-blue-800">Мэдээлэл</h3>
              <ul class="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                <li>Terminal ID болон App Secret хоёуланг оруулах шаардлагатай</li>
                <li>Мэдээллийг шинэчлэх үед хоёр талбарыг дахин бөглөнө үү</li>
                <li>Bonum системтэй холбоотой асуудал гарвал тэдэнтэй холбогдоно уу</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200"></div>

    <!-- Save Section -->
    <div class="bg-blue-50 rounded-xl p-6 border border-blue-200 mt-8">
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