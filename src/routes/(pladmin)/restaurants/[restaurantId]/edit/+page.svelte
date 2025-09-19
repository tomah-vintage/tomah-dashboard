<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { ChevronRight, Save, X } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import MapPicker from "$lib/components/ui/map-picker/MapPicker.svelte";
  import OpenHoursInput from "$lib/components/ui/open-hours-input/OpenHoursInput.svelte";
  import ImageUploader from "$lib/components/new-restaurant/ImageUploader.svelte";
  import type { PageData } from './$types';
  import type {
    OpeningHours,
    FormattedDailyHours,
  } from "$lib/types/restaurant";

  export let data: PageData;
  export let form: any;

  let submitting = false;
  let restaurant = data.restaurant || {};

  // Initialize form with restaurant data (with safe defaults)
  let formData = {
    name: restaurant?.name || '',
    address: restaurant?.address || '',
    phone: restaurant?.phone || '',
    latitude: restaurant?.latitude || null,
    longitude: restaurant?.longitude || null,
    open_hours: restaurant?.open_hours || [],
    logo_file: null,
    restaurant_img_urls: null
  };

  function handleLocationSelected(
    event: CustomEvent<{ latitude: number; longitude: number }>
  ) {
    formData.latitude = event.detail.latitude;
    formData.longitude = event.detail.longitude;
  }

  const dayMapping: { [key: string]: number } = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };

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
    formData.open_hours = formattedOpenHours;
  }

  const reverseDayMapping: { [key: number]: string } = {
    0: "monday",
    1: "tuesday",
    2: "wednesday",
    3: "thursday",
    4: "friday",
    5: "saturday",
    6: "sunday",
  };

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

  function handleCancel() {
    goto(`${base}/restaurants/${restaurant?.id || ''}`);
  }
</script>

<svelte:head>
  <title>Ресторан засах | Qpick</title>
</svelte:head>

<div class="bg-slate-100 w-full h-full">
  <!-- Breadcrumbs -->
  <div class="flex items-center space-x-2 text-sm text-gray-500 py-6 bg-white">
    <div class="h-5 w-2 bg-primary-blue rounded-sm"></div>
    <a href="{base}/restaurants" class="hover:underline text-lg">Ресторанууд</a>
    <ChevronRight size={20} />
    <a href="{base}/restaurants/{restaurant?.id}" class="hover:underline text-lg">{restaurant?.name || 'Ресторан'}</a>
    <ChevronRight size={20} />
    <span class="font-semibold">Засах</span>
  </div>

  <div class="card m-6 bg-white rounded-lg">
    <div class="flex items-center gap-2 pt-5 mb-8">
      <div class="h-5 w-2 bg-primary-blue rounded-sm"></div>
      <h1 class="text-xl font-bold">Ресторан засах - {restaurant?.name || 'Ресторан'}</h1>
    </div>

    <form
      method="POST"
      use:enhance={() => {
        submitting = true;
        return async ({ update, result }) => {
          submitting = false;
          if (result.type === 'success') {
            goto(`${base}/restaurants/${restaurant?.id || ''}`);
          }
          update();
        };
      }}
      enctype="multipart/form-data"
      class="w-full flex justify-center"
    >
      <div class="flex flex-col gap-8 max-w-[800px] w-full">
        <!-- Logo Section -->
        <div class="flex flex-col gap-4">
          <h2 class="text-lg font-bold">Лого зураг</h2>
          <div class="flex items-center gap-4">
            {#if restaurant?.logo}
              <img
                src={restaurant.logo}
                alt="{restaurant?.name} лого"
                class="w-20 h-20 rounded-lg object-cover border"
              />
            {:else}
              <div class="w-20 h-20 rounded-lg bg-gray-200 border flex items-center justify-center">
                <span class="text-gray-500 text-xs">Лого байхгүй</span>
              </div>
            {/if}
            <div class="flex-1">
              <p class="text-sm text-gray-600 mb-2">Одоогийн лого</p>
              <ImageUploader
                id="logo-uploader"
                name="logo_file"
                multiple={false}
                layout="horizontal"
                on:select={(e) => (formData.logo_file = e.detail.files[0])}
              />
            </div>
          </div>
        </div>

        <!-- Restaurant Images Section -->
        <div class="flex flex-col gap-4">
          <h2 class="text-lg font-bold">Рестораны зургууд</h2>
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Одоогийн зургууд:</p>
            {#if restaurant?.restaurant_img_urls && restaurant.restaurant_img_urls.length > 0}
              <div class="grid grid-cols-4 gap-2">
                {#each restaurant.restaurant_img_urls as imgUrl}
                  <img
                    src={imgUrl}
                    alt="Restaurant"
                    class="w-full h-20 rounded-md object-cover border"
                  />
                {/each}
              </div>
            {:else}
              <div class="text-gray-500 text-sm py-4 border border-dashed rounded-md text-center">
                Зураг байхгүй
              </div>
            {/if}
          </div>
          <ImageUploader
            id="restaurant-images-uploader"
            name="restaurant_images"
            showLayoutSelector={true}
            on:select={(e) => (formData.restaurant_img_urls = e.detail.files)}
          />
        </div>

        <!-- Basic Information -->
        <div class="md:col-span-2 grid grid-cols-1 gap-6">
          <Input
            id="name"
            name="name"
            label="Рестораны нэр"
            placeholder="Рестораны нэрээ оруулна уу"
            bind:value={formData.name}
            error={form?.errors?.name?.[0]}
          />
          <Input
            id="address"
            name="address"
            label="Хаяг"
            type="textarea"
            placeholder="Хаягаа оруулна уу"
            bind:value={formData.address}
            error={form?.errors?.address?.[0]}
          />
          <Input
            id="phone"
            name="phone"
            label="Утас"
            placeholder="Утасны дугаараа оруулна уу"
            bind:value={formData.phone}
            error={form?.errors?.phone?.[0]}
          />

          <!-- Location -->
          <MapPicker
            bind:latitude={formData.latitude}
            bind:longitude={formData.longitude}
            on:locationselected={handleLocationSelected}
          />
          <Input
            id="latitude"
            name="latitude"
            label="Өргөрөг"
            type="number"
            placeholder="Өргөрөг оруулна уу"
            bind:value={formData.latitude}
            error={form?.errors?.latitude?.[0]}
            readonly
          />
          <Input
            id="longitude"
            name="longitude"
            label="Уртраг"
            type="number"
            placeholder="Уртраг оруулна уу"
            bind:value={formData.longitude}
            error={form?.errors?.longitude?.[0]}
            readonly
          />

          <!-- Opening Hours -->
          <OpenHoursInput
            value={formData.open_hours
              ? convertFormattedToOpeningHours(formData.open_hours)
              : {}}
            on:change={handleOpenHoursChange}
          />
          <input
            type="hidden"
            name="open_hours"
            value={JSON.stringify(formData.open_hours)}
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 pb-5">
          <Button type="button" variant="secondary" on:click={handleCancel}>
            <X class="w-4 h-4 mr-2" />
            Цуцлах
          </Button>
          <Button type="submit" disabled={submitting}>
            <Save class="w-4 h-4 mr-2" />
            {submitting ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </div>
      </div>
    </form>
  </div>
</div>