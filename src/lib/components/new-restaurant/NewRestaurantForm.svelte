<script lang="ts">
  import { enhance } from '$app/forms';
  import ImageUploader from './ImageUploader.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  export let form;

  form = form ?? {};
</script>

<form method="POST" use:enhance enctype="multipart/form-data" class="w-full flex justify-center">
  <div class="flex flex-col gap-8 max-w-[800px] w-full">
    <div class="flex space-y-4 items-center gap-6">
      <ImageUploader />
      <div class="flex space-x-2 gap-4">
        <Button type="button">+ Зураг татах</Button>
        <Button type="button" variant="secondary">Цуцлах</Button>
      </div>
    </div>

    <div class="md:col-span-2 grid grid-cols-1 gap-6">
      <Input id="name" name="name" label="Рестораны нэр" placeholder="Рестораны нэрээ оруулна уу" bind:value={form.name} error={form?.errors?.name?.[0]} />
      <Input id="representativeName" name="representativeName" label="Төлөөлөгчийн нэр" placeholder="Төлөөлөгчийн нэрээ оруулна уу" bind:value={form.representativeName} error={form?.errors?.representativeName?.[0]} />
      <Input id="phone" name="phone" label="Утас" placeholder="Утасны дугаараа оруулна уу" bind:value={form.phone} error={form?.errors?.phone?.[0]} />
      <Input id="registrationNumber" name="registrationNumber" label="Байгууллагын регистр" placeholder="Байгуулагын регистрээ оруулна уу" bind:value={form.registrationNumber} error={form?.errors?.registrationNumber?.[0]} />
      <Input id="workingHours" name="workingHours" label="Ажилын цаг" placeholder="Ажилын цагаа оруулна yy" bind:value={form.workingHours} error={form?.errors?.workingHours?.[0]} />
      <Input id="address" name="address" label="Хаяг" type="textarea" placeholder="Хаягаа оруулна уу" bind:value={form.address} error={form?.errors?.address?.[0]} />
    </div>

    <div class="flex justify-end pb-5">
      <Button type="submit" disabled={form.submitting}>
        {form.submitting ? 'Илгээж байна...' : 'Илгээх'}
      </Button>
    </div>
  </div>
</form>