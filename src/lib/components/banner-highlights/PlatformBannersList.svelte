<script lang="ts">
  import type { PlatformBanner } from "$lib/types/platform-banner";
  import { createDeletePlatformBannerMutation } from "$lib/queries/platform-banner-queries";
  import PlatformBannerTableRow from "./PlatformBannerTableRow.svelte";
  import { createEventDispatcher } from "svelte";

  export let banners: PlatformBanner[];

  const deletePlatformBannerMutation = createDeletePlatformBannerMutation();
  const dispatch = createEventDispatcher<{
    edit: PlatformBanner;
  }>();

  function handleEdit(event: CustomEvent<PlatformBanner>) {
    dispatch('edit', event.detail);
  }

  function handleDelete(event: CustomEvent<number>) {
    $deletePlatformBannerMutation.mutate(event.detail);
  }
</script>

<div class="overflow-x-auto">
  <table class="w-full border-collapse">
    <thead>
      <tr class="border-b border-gray-200">
        <th class="p-4 text-left text-sm font-medium text-gray-600">Зураг</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Ресторан</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Эрэмбэ</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Огноо</th>
        <th class="p-4 text-right text-sm font-medium text-gray-600">Үйлдэл</th>
      </tr>
    </thead>
    <tbody>
      {#each banners as banner (banner.id)}
        <PlatformBannerTableRow 
          {banner}
          isDeleting={$deletePlatformBannerMutation.isPending}
          on:edit={handleEdit}
          on:delete={handleDelete}
        />
      {/each}
    </tbody>
  </table>
</div>