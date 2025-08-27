<script lang="ts">
  import { X } from "lucide-svelte";
  import ImageUploader from "$lib/components/new-restaurant/ImageUploader.svelte";

  let { imgUrls = $bindable() } = $props<{ imgUrls: File[] }>();

  let selectedFiles = $state<File[]>([]);
  let previewUrls = $state<string[]>([]);

  function handleImageSelect(event: CustomEvent) {
    selectedFiles = event.detail.files;
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    previewUrls = selectedFiles.map((file: File) => URL.createObjectURL(file));
    imgUrls = selectedFiles;
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previewUrls[index]);
    previewUrls.splice(index, 1);
    selectedFiles.splice(index, 1);
    imgUrls.splice(index, 1);
    // Re-assign to trigger reactivity for arrays
    previewUrls = [...previewUrls];
    selectedFiles = [...selectedFiles];
    imgUrls = [...imgUrls];
  }
</script>

<div class="md:col-span-1 space-y-2">
  <ImageUploader on:select={handleImageSelect} />
  {#if previewUrls.length > 0}
    <div class="flex flex-wrap gap-2 mt-4">
      {#each previewUrls as url, i (url)}
        <div class="relative group">
          <img
            src={url}
            alt={`Preview ${i + 1}`}
            class="w-24 h-24 object-cover rounded-md"
          />
          <button
            type="button"
            onclick={() => removeImage(i)}
            class="absolute top-1 right-1 bg-primary-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
