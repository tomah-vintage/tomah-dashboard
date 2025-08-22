<script lang="ts">
  import { enhance } from '$app/forms';
  import ImageUploader from './ImageUploader.svelte';
  import { Button } from '$lib/components/ui/button';
  export let form;

  form = form ?? {};
</script>

<form method="POST" use:enhance enctype="multipart/form-data" class="w-full flex justify-center">
  <div class="flex flex-col gap-8 max-w-[800px] w-full">
    <div class="flex space-y-4 items-center gap-6">
      <ImageUploader bind:image={form.image} />
      <div class="flex space-x-2 gap-4">
        <Button type="button">+ Зураг татах</Button>
        <Button type="button" variant="secondary">Цуцлах</Button>
      </div>
    </div>

    <div class="md:col-span-2 grid grid-cols-1 gap-6">
      <div class="flex flex-col gap-3">
        <label for="name" class="block text-sm font-medium text-gray-700">Рестораны нэр</label>
        <input
          type="text"
          name="name"
          id="name"
          class="w-full border py-2.5 px-3 rounded-xl"
          placeholder="Рестораны нэрээ оруулна уу"
          bind:value={form.name}
        />
        {#if form?.errors?.name}
          <p class="text-red-500 text-sm">{form.errors.name[0]}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-3">
        <label for="representativeName" class="block text-sm font-medium text-gray-700"
          >Төлөөлөгчийн нэр</label
        >
        <input
          type="text"
          name="representativeName"
          id="representativeName"
          class="w-full border py-2.5 px-3 rounded-xl"
          placeholder="Төлөөлөгчийн нэрээ оруулна уу"
          bind:value={form.representativeName}
        />
        {#if form?.errors?.representativeName}
          <p class="text-red-500 text-sm">{form.errors.representativeName[0]}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-3">
        <label for="phone" class="block text-sm font-medium text-gray-700">Утас</label>
        <input
          type="text"
          name="phone"
          id="phone"
          class="w-full border py-2.5 px-3 rounded-xl"
          placeholder="Утасны дугаараа оруулна уу"
          bind:value={form.phone}
        />
        {#if form?.errors?.phone}
          <p class="text-red-500 text-sm">{form.errors.phone[0]}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-3">
        <label for="registrationNumber" class="block text-sm font-medium text-gray-700"
          >Байгууллагын регистр</label
        >
        <input
          type="text"
          name="registrationNumber"
          id="registrationNumber"
          class="w-full border py-2.5 px-3 rounded-xl"
          placeholder="Байгуулагын регистрээ оруулна уу"
          bind:value={form.registrationNumber}
        />
        {#if form?.errors?.registrationNumber}
          <p class="text-red-500 text-sm">{form.errors.registrationNumber[0]}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-3">
        <label for="workingHours" class="block text-sm font-medium text-gray-700"
          >Ажилын цаг</label
        >
        <input
          type="text"
          name="workingHours"
          id="workingHours"
          class="w-full border py-2.5 px-3 rounded-xl"
          placeholder="Ажилын цагаа оруулна yy"
          bind:value={form.workingHours}
        />
        {#if form?.errors?.workingHours}
          <p class="text-red-500 text-sm">{form.errors.workingHours[0]}</p>
        {/if}
      </div>

      <div class="flex flex-col gap-3">
        <label for="address" class="block text-sm font-medium text-gray-700">Хаяг</label>
        <textarea
          name="address"
          id="address"
          class="w-full border py-2.5 px-3 rounded-xl"
          rows="4"
          placeholder="Хаягаа оруулна уу"
          bind:value={form.address}
        ></textarea>
        {#if form?.errors?.address}
          <p class="text-red-500 text-sm">{form.errors.address[0]}</p>
        {/if}
      </div>
    </div>

    <div class="flex justify-end pb-5">
      <Button type="submit" disabled={form.submitting}>
        {form.submitting ? 'Илгээж байна...' : 'Илгээх'}
      </Button>
    </div>
  </div>
</form>