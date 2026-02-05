<script lang="ts">
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import ImageUploader from "../new-restaurant/ImageUploader.svelte"; // Adjusted path
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import MapPicker from "$lib/components/ui/map-picker/MapPicker.svelte";
  import OpenHoursInput from "$lib/components/ui/open-hours-input/OpenHoursInput.svelte";
  import { getCsrfToken } from "$lib/utils/csrf";
  import { DAY_MAPPING, REVERSE_DAY_MAPPING } from '$lib/utils/day-mapping';
  import type {
    OpeningHours,
    FormattedDailyHours,
    Restaurant,
  } from "$lib/types/restaurant";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let form: Record<string, any>;
  export let restaurant: Restaurant | null = null;

  let csrfToken = "";

  onMount(() => {
    csrfToken = getCsrfToken() || "";
  });

  form = form ?? {};

  // Initialize form with restaurant data if available
  if (restaurant) {
    form.name = restaurant.name;
    form.address = restaurant.address;
    form.latitude = restaurant.latitude;
    form.longitude = restaurant.longitude;
    form.open_hours = restaurant.open_hours;
    form.logo_url = restaurant.logo_url;
    form.restaurant_img_urls = restaurant.restaurant_img_urls;
    form.user = restaurant.user;
  }

  // Variables for binding existing images
  let logoImages = form.logo_url ? [form.logo_url] : [];
  let restaurantImages = form.restaurant_img_urls || [];

  let submitting = false;

  function handleLocationSelected(
    event: CustomEvent<{ latitude: number; longitude: number }>
  ) {
    form.latitude = event.detail.latitude;
    form.longitude = event.detail.longitude;
  }

  const dayMapping = DAY_MAPPING;

  function handleOpenHoursChange(event: CustomEvent<OpeningHours>) {
    const formattedOpenHours: FormattedDailyHours[] = [];
    for (const dayId in event.detail) {
      if (
        Object.prototype.hasOwnProperty.call(event.detail, dayId) &&
        event.detail[dayId].length > 0
      ) {
        const dayOfWeek = dayMapping[dayId];
        event.detail[dayId].forEach((timeSlot) => {
          formattedOpenHours.push({
            day_of_week: dayOfWeek,
            opening_time: `${timeSlot.open}:00`,
            closing_time: `${timeSlot.close}:00`,
          });
        });
      }
    }
    form.open_hours = formattedOpenHours;
  }

  const reverseDayMapping = REVERSE_DAY_MAPPING;

  function convertFormattedToOpeningHours(
    formattedHours: FormattedDailyHours[]
  ): OpeningHours {
    const openingHours: OpeningHours = {};
    formattedHours.forEach((item) => {
      const dayId = reverseDayMapping[item.day_of_week];
      if (dayId) {
        if (!openingHours[dayId]) {
          openingHours[dayId] = [];
        }
        openingHours[dayId].push({
          open: item.opening_time.substring(0, 5),
          close: item.closing_time.substring(0, 5),
        });
      }
    });
    return openingHours;
  }
</script>

<form
  method="POST"
  use:enhance={() => {
    submitting = true; // Set submitting to true when form submission starts
    return async ({ update }) => {
      submitting = false; // Set submitting to false when form submission ends
      update();
    };
  }}
  enctype="multipart/form-data"
  class="space-y-8"
>
  <input type="hidden" name="csrf_token" value={csrfToken} />
  <div class="space-y-8">
    <!-- Logo Section -->
    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div class="flex items-center mb-4">
        <div class="w-2 h-8 bg-blue-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Лого зураг</h2>
          <p class="text-sm text-gray-600 mt-1">
            Рестораны лого зураг оруулна үү. Хэмжээ: 500x500px
          </p>
        </div>
      </div>
      <ImageUploader
        id="logo-uploader"
        name="logo_file"
        multiple={false}
        layout="horizontal"
        on:select={(e) => (form.logo_file = e.detail.files[0])}
        on:remove={(e) => {
          form.logo_url = null;
          form.remove_logo = true;
          logoImages = [];
        }}
        bind:existingImages={logoImages}
      />
    </div>

    <!-- Restaurant Images Section -->
    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div class="flex items-center mb-4">
        <div class="w-2 h-8 bg-green-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Рестораны зургууд</h2>
          <p class="text-sm text-gray-600 mt-1">
            Рестораны орчин, хоолны зургууд оруулна үү
          </p>
        </div>
      </div>
      <ImageUploader
        id="restaurant-images-uploader"
        name="restaurant_images"
        showLayoutSelector={true}
        on:select={(e) => (form.restaurant_img_urls = e.detail.files)}
        on:remove={(e) => {
          restaurantImages = e.detail.images;
          form.restaurant_img_urls = restaurantImages;
          form.removed_images = form.removed_images || [];
          form.removed_images.push(e.detail.index);
        }}
        bind:existingImages={restaurantImages}
      />
    </div>

    <!-- Restaurant Information Section -->
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-purple-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">үндсэн мэдээлэл</h2>
          <p class="text-sm text-gray-600 mt-1">
            Рестораны нэр, хаяг болон байршлыг оруулна үү
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <Input
            id="name"
            name="name"
            label="Рестораны нэр"
            placeholder="Рестораны нэрээ оруулна уу"
            bind:value={form.name}
            error={form?.errors?.name?.[0]}
          />
        </div>

        <div class="md:col-span-2">
          <Input
            id="address"
            name="address"
            label="Хаяг"
            type="textarea"
            placeholder="Хаягаа оруулна уу"
            bind:value={form.address}
            error={form?.errors?.address?.[0]}
          />
        </div>
      </div>
    </div>

    <!-- Location Section -->
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-red-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Байршил</h2>
          <p class="text-sm text-gray-600 mt-1">
            Газрын дээр клик хийж хаяг сонгоно уу
          </p>
        </div>
      </div>

      <div class="mb-6">
        <MapPicker
          bind:latitude={form.latitude}
          bind:longitude={form.longitude}
          on:locationselected={handleLocationSelected}
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="latitude"
          name="latitude"
          label="Өргөрөг"
          type="number"
          placeholder="Өргөрөг оруулна уу"
          bind:value={form.latitude}
          error={form?.errors?.latitude?.[0]}
          readonly
        />
        <Input
          id="longitude"
          name="longitude"
          label="Уртраг"
          type="number"
          placeholder="Уртраг оруулна уу"
          bind:value={form.longitude}
          error={form?.errors?.longitude?.[0]}
          readonly
        />
      </div>
    </div>

    <!-- Operating Hours Section -->
    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center mb-6">
        <div class="w-2 h-8 bg-orange-600 rounded-sm mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Ажлын цаг</h2>
          <p class="text-sm text-gray-600 mt-1">
            Рестораны ажлын цагийг тохироолно уу
          </p>
        </div>
      </div>

      <OpenHoursInput
        value={form.open_hours
          ? convertFormattedToOpeningHours(form.open_hours)
          : {}}
        on:change={handleOpenHoursChange}
      />
      <input
        type="hidden"
        name="open_hours"
        value={JSON.stringify(form.open_hours)}
      />
      <input
        type="hidden"
        name="user"
        value={JSON.stringify(form.user)}
      />
      {#if form.remove_logo}
        <input type="hidden" name="remove_logo" value="true" />
      {/if}
      {#if form.removed_images}
        <input
          type="hidden"
          name="removed_images"
          value={JSON.stringify(form.removed_images)}
        />
      {/if}
    </div>

    <!-- Submit Section -->
    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Тохиргоо хадгалах</h3>
          <p class="text-sm text-gray-600 mt-1">
            Өөрчлөлтөө баталгаажуулаарай "Хадгалах" товчиг дарна уу
          </p>
        </div>
        <Button
          type="submit"
          disabled={submitting}
          class="px-8 py-3 text-lg font-semibold"
        >
          {submitting ? "Илгээж байна..." : "Хадгалах"}
        </Button>
      </div>
    </div>
  </div>
</form>
