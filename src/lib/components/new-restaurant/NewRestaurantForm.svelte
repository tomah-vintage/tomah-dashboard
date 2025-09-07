<script lang="ts">
  import { enhance } from "$app/forms";
  import ImageUploader from "./ImageUploader.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import MapPicker from "$lib/components/ui/map-picker/MapPicker.svelte";
  import OpenHoursInput from "$lib/components/ui/open-hours-input/OpenHoursInput.svelte";
  import type {
    OpeningHours,
    FormattedDailyHours,
  } from "$lib/types/restaurant";

  export let form: any;

  form = form ?? {};

  let submitting = false;

  function handleLocationSelected(
    event: CustomEvent<{ latitude: number; longitude: number }>
  ) {
    form.latitude = event.detail.latitude;
    form.longitude = event.detail.longitude;
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
        event.detail.hasOwnProperty(dayId) &&
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
  class="w-full flex justify-center"
>
  <div class="flex flex-col gap-8 max-w-[800px] w-full">
    <div class="flex flex-col gap-4">
      <h2 class="text-lg font-bold">Лого зураг</h2>
      <ImageUploader
        id="logo-uploader"
        name="logo_file"
        multiple={false}
        layout="horizontal"
        on:select={(e) => (form.logo_file = e.detail.files[0])}
      />
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-lg font-bold">Рестораны зургууд</h2>
      <ImageUploader
        id="restaurant-images-uploader"
        name="restaurant_images"
        showLayoutSelector={true}
        on:select={(e) => (form.restaurant_img_urls = e.detail.files)}
      />
    </div>

    <div class="md:col-span-2 grid grid-cols-1 gap-6">
      <Input
        id="name"
        name="name"
        label="Рестораны нэр"
        placeholder="Рестораны нэрээ оруулна уу"
        bind:value={form.name}
        error={form?.errors?.name?.[0]}
      />
      <Input
        id="address"
        name="address"
        label="Хаяг"
        type="textarea"
        placeholder="Хаягаа оруулна уу"
        bind:value={form.address}
        error={form?.errors?.address?.[0]}
      />
      <MapPicker
        bind:latitude={form.latitude}
        bind:longitude={form.longitude}
        on:locationselected={handleLocationSelected}
      />
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

      <h2 class="text-lg font-bold mt-4">Хэрэглэгчийн мэдээлэл</h2>
      <Input
        id="first_name"
        name="first_name"
        label="Нэр"
        placeholder="Нэрээ оруулна уу"
        bind:value={form.first_name}
        error={form?.errors?.first_name?.[0]}
      />
      <Input
        id="last_name"
        name="last_name"
        label="Овог"
        placeholder="Овогоо оруулна уу"
        bind:value={form.last_name}
        error={form?.errors?.last_name?.[0]}
      />
      <Input
        id="email"
        name="email"
        label="И-мэйл"
        type="email"
        placeholder="И-мэйл хаягаа оруулна уу"
        bind:value={form.email}
        error={form?.errors?.email?.[0]}
      />
      <Input
        id="password"
        name="password"
        label="Нууц үг"
        type="password"
        placeholder="Нууц үгээ оруулна уу"
        bind:value={form.password}
        error={form?.errors?.password?.[0]}
      />
      <Input
        id="phone"
        name="phone"
        label="Утас"
        placeholder="Утасны дугаараа оруулна уу"
        bind:value={form.phone}
        error={form?.errors?.phone?.[0]}
      />
    </div>

    <div class="flex justify-end pb-5">
      <Button type="submit" disabled={submitting}>
        {submitting ? "Илгээж байна..." : "Илгээх"}
      </Button>
    </div>
  </div>
</form>