<script lang="ts">
  import {
    createPatchRestaurantMutation,
    createGetRestaurantByIdQuery,
  } from "$lib/queries/restaurant-queries";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import MapLocationPicker from "$lib/components/ui/MapLocationPicker.svelte";
  import WeeklyHoursInput from "$lib/components/ui/WeeklyHoursInput.svelte";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import type { RestaurantSettingsData } from "$lib/types/restaurant";
  import { toast } from "svelte-french-toast";

  export let restaurantId: string;

  // Get current restaurant data
  $: getRestaurant = createGetRestaurantByIdQuery(restaurantId);
  $: ({ data: restaurant, isLoading: isLoadingRestaurant } = $getRestaurant);

  // Create the PATCH mutation
  const patchRestaurantMutation = createPatchRestaurantMutation();
  $: ({ mutate: patchRestaurant, isPending: isSaving } =
    $patchRestaurantMutation);

  // Form data - initialize with restaurant data when available
  let formData: RestaurantSettingsData = {};

  // Separate state for credentials to avoid confusion
  let currentApiKey: string = "";
  let newBonumApiKey: string = "";
  let newBonumSecretKey: string = "";

  // Container fee display value
  let containerFeeDisplay: string = "";

  // Track if form has changes
  let hasChanges: boolean = false;
  let originalFormData: RestaurantSettingsData = {};

  // Update form when restaurant data loads
  $: if (restaurant && !isLoadingRestaurant) {
    formData = {
      name: restaurant.name || "",
      address: restaurant.address || "",
      latitude:
        typeof restaurant.latitude === "string"
          ? parseFloat(restaurant.latitude)
          : restaurant.latitude || undefined,
      longitude:
        typeof restaurant.longitude === "string"
          ? parseFloat(restaurant.longitude)
          : restaurant.longitude || undefined,
      open_hours: restaurant.open_hours || restaurant.opening_hours || [],
      container_fee: restaurant.container_fee || 0,
    };
    // Store original data for comparison
    originalFormData = { ...formData };
    // Set current API key for display only
    currentApiKey = restaurant.bonum_api_key || "";
    // Initialize container fee display
    containerFeeDisplay = restaurant.container_fee
      ? String(restaurant.container_fee)
      : "0";
    // Reset hasChanges
    hasChanges = false;
  }

  // Check for changes whenever formData changes
  $: if (Object.keys(originalFormData).length > 0) {
    hasChanges =
      formData.name !== originalFormData.name ||
      formData.address !== originalFormData.address ||
      formData.latitude !== originalFormData.latitude ||
      formData.longitude !== originalFormData.longitude ||
      formData.container_fee !== originalFormData.container_fee ||
      JSON.stringify(formData.open_hours) !==
        JSON.stringify(originalFormData.open_hours) ||
      newBonumApiKey !== "" ||
      newBonumSecretKey !== "";
  }

  // Explicitly track these for reactivity
  $: (formData.name,
    formData.address,
    formData.latitude,
    formData.longitude,
    formData.container_fee,
    formData.open_hours,
    newBonumApiKey,
    newBonumSecretKey,
    checkChanges());

  function checkChanges() {
    // Trigger change detection
  }

  // Handle container fee input
  function handleContainerFeeInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = input.value.replace(/[^\d]/g, ""); // Remove non-digits
    containerFeeDisplay = value;
    formData.container_fee = value ? parseInt(value) : 0;
  }

  // Prevent non-numeric key presses
  function handleContainerFeeKeydown(e: KeyboardEvent) {
    const char = e.key;
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if (
      char === "Backspace" ||
      char === "Delete" ||
      char === "Tab" ||
      char === "Escape" ||
      char === "Enter" ||
      char === "ArrowLeft" ||
      char === "ArrowRight" ||
      char === "ArrowUp" ||
      char === "ArrowDown" ||
      char === "Home" ||
      char === "End"
    ) {
      return;
    }
    // Prevent if not a digit
    if (!/^\d$/.test(char)) {
      e.preventDefault();
    }
  }

  // Handle form submission
  function handleSubmit(e: Event) {
    e.preventDefault();

    // Filter out undefined/empty values to only send changed fields
    const dataToUpdate: RestaurantSettingsData = {};
    Object.entries(formData).forEach(([key, value]) => {
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
    if (newBonumApiKey) {
      dataToUpdate.bonum_api_key = newBonumApiKey;
    }
    if (newBonumSecretKey) {
      dataToUpdate.bonum_secret_key = newBonumSecretKey;
    }

    console.log("Илгээгдэж буй формын өгөгдөл:", dataToUpdate);

    patchRestaurant(
      { id: restaurantId, data: dataToUpdate },
      {
        onSuccess: () => {
          toast.success("Рестораны мэдээлэл амжилттай шинэчлэгдлээ");
          // Clear credentials fields after successful update
          newBonumApiKey = "";
          newBonumSecretKey = "";
          // Reset original data and hasChanges
          originalFormData = { ...formData };
          hasChanges = false;
        },
        onError: (error) => {
          toast.error(`Алдаа гарлаа: ${error.message}`);
        },
      },
    );
  }

  function handleLocationChange(lat: number, lng: number) {
    formData.latitude = lat;
    formData.longitude = lng;
  }

  interface OpenHoursEntry {
    day_of_week: number;
    opening_time: string;
    closing_time: string;
  }

  function handleHoursChange(hours: OpenHoursEntry[]) {
    formData.open_hours = hours;
  }
</script>

{#if isLoadingRestaurant}
  <div class="flex justify-center items-center py-8">
    <CircularLoader size="md" color="blue" />
  </div>
{:else if restaurant}
  <div class="space-y-8">
    <!-- Basic Information Section -->
    <div id="section-basic" class="scroll-mt-24">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-blue-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Үндсэн мэдээлэл</h2>
          <p class="text-sm text-gray-600 mt-1">
            Рестораны нэр, хаяг болон бусад үндсэн мэдээллийг тохируулах
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <Input
            label="Рестораны нэр"
            placeholder="Рестораны нэрийг оруулна уу"
            bind:value={formData.name}
          />
        </div>

        <div class="md:col-span-2">
          <Input
            label="Хаяг"
            type="textarea"
            placeholder="Рестораны дэлгэрэнгүй хаягийг оруулна уу"
            bind:value={formData.address}
          />
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200"></div>

    <!-- Container Fee Section -->
    <div id="section-container" class="scroll-mt-24">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-indigo-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Савлагааны төлбөр</h2>
          <p class="text-sm text-gray-600 mt-1">
            Авч явах захиалгад нэмэх савлагааны төлбөрийг тохируулах
          </p>
        </div>
      </div>

      <div class="max-w-md">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Савлагааны төлбөр
        </label>
        <div class="relative">
          <input
            type="text"
            inputmode="numeric"
            placeholder="0"
            value={containerFeeDisplay}
            on:input={handleContainerFeeInput}
            on:keydown={handleContainerFeeKeydown}
            class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <span class="text-gray-500 font-medium">₮</span>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          Авч явах захиалгад нэмэх төлбөр (₮). 0 утга оруулбал төлбөргүй байна.
        </p>

        <!-- Info box -->
        <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg
              class="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h4 class="text-sm font-medium text-blue-800">Мэдээлэл</h4>
              <p class="text-sm text-blue-700 mt-1">
                Энэ төлбөр нь авч явах захиалгын нийт дүнд автоматаар нэмэгдэх
                бөгөөд захиалгын жагсаалт болон тайлангуудад тусад нь харагдана.
              </p>
            </div>
          </div>
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
          <p class="text-sm text-gray-600 mt-1">
            Газрын зураг дээрээс рестораны байршлыг сонгоно уу
          </p>
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
          <p class="text-sm text-gray-600 mt-1">
            7 хоногийн ажлын цагийн хуваарийг эндээс тохируулна уу
          </p>
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
          <h2 class="text-xl font-semibold text-gray-900">
            Төлбөрийн тохиргоо
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            Bonum төлбөрийн системийн нэвтрэх мэдээллийг тохируулах
          </p>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Current API Key Display -->
        {#if currentApiKey}
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Одоо ашиглаж буй Terminal ID
            </label>
            <div
              class="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded border border-gray-300"
            >
              {currentApiKey}
            </div>
          </div>
        {/if}

        <!-- Warning Message -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex">
            <svg
              class="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-yellow-800">Анхааруулга</h3>
              <p class="text-sm text-yellow-700 mt-1">
                App Secret-г хадгалсны дараа дахин харах боломжгүй тул
                мэдээллийг аюулгүй газар хадгална уу.
              </p>
            </div>
          </div>
        </div>

        <!-- New Credentials Input -->
        <div class="grid grid-cols-1 gap-6">
          <div>
            <Input
              label="Terminal ID (API Key)"
              placeholder="Bonum-с олгосон Terminal ID-г энд оруулна уу"
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
              placeholder="Bonum-с олгосон App Secret-г энд оруулна уу"
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
            <svg
              class="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-blue-800">Мэдээлэл</h3>
              <ul
                class="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1"
              >
                <li>
                  Terminal ID болон App Secret-г хамтад нь заавал оруулах
                  шаардлагатай
                </li>
                <li>
                  Мэдээллийг шинэчлэх үед хоёр талбарыг дахин бөглөх
                  шаардлагатай
                </li>
                <li>
                  Bonum системтэй холбоотой асуудал гарвал Bonum-н оператортой
                  холбогдоно уу
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button - Floating in bottom right when changes detected -->
    {#if hasChanges}
      <div class="fixed bottom-6 right-6 z-[9999]">
        <div class="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <p class="text-sm text-gray-700 mb-3 font-medium">
            Өөрчлөлт хадгалаагүй
          </p>
          <Button
            on:click={handleSubmit}
            disabled={isSaving}
            variant="primary"
            size="lg"
            class="w-full"
          >
            {isSaving ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="text-center py-8">
    <p class="text-gray-500">Рестораны мэдээлэл олдсонгүй</p>
  </div>
{/if}
