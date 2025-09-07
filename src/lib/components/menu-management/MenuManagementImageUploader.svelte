<script lang="ts">
  import ImageUploader from "$lib/components/new-restaurant/ImageUploader.svelte";

  let { imgUrls = $bindable() } = $props<{ imgUrls: File[] }>();

  function handleImageSelect(event: CustomEvent) {
    imgUrls = event.detail.files;
  }
</script>

<div class="space-y-4">
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Хоолны зураг</h3>
    <ImageUploader on:select={handleImageSelect} layout="vertical" />
  </div>
</div>
