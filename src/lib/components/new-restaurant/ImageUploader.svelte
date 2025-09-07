<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { UploadCloud, X } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";

  export let multiple: boolean = true;
  export let id = "image-uploader";
  export let name = "image";

  const dispatch = createEventDispatcher();

  let selectedFiles: File[] = [];
  let previewUrls: string[] = [];

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);

      if (multiple) {
        selectedFiles = [...selectedFiles, ...files];
        previewUrls = [
          ...previewUrls,
          ...files.map((file) => URL.createObjectURL(file)),
        ];
      } else {
        selectedFiles = files;
        // Create preview URLs
        previewUrls.forEach((url) => URL.revokeObjectURL(url)); // Clean up old URLs
        previewUrls = files.map((file) => URL.createObjectURL(file));
      }

      dispatch("select", { files });
    } else {
      selectedFiles = [];
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls = [];
      dispatch("select", { files: [] });
    }
  }

  function removeImage(index: number) {
    // Revoke the URL for the removed image
    URL.revokeObjectURL(previewUrls[index]);

    // Remove from arrays
    selectedFiles = selectedFiles.filter((_, i) => i !== index);
    previewUrls = previewUrls.filter((_, i) => i !== index);

    // Update the file input
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      // Create a new FileList with remaining files
      const dt = new DataTransfer();
      selectedFiles.forEach((file) => dt.items.add(file));
      input.files = dt.files;
    }

    dispatch("select", { files: selectedFiles });
  }

  // Clean up URLs when component is destroyed
  import { onDestroy } from "svelte";
  onDestroy(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
  });
</script>

<div class="w-full">
  <label
    for={id}
    class="cursor-pointer w-full h-56 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors"
  >
    <p class="text-lg text-gray-500 mb-4">Та бүтээгдэхүүний зураг оруулна уу</p>
    <UploadCloud class="w-12 h-12 text-gray-400 mb-4" />
    <Button type="button" variant="secondary">Зураг татах</Button>
  </label>
  <input
    type="file"
    {name}
    {id}
    class="hidden"
    accept="image/*"
    {multiple}
    on:change={handleChange}
  />

  <!-- Image Previews -->
  {#if selectedFiles.length > 0}
    <div class="mt-6">
      <h3 class="text-sm font-medium text-gray-700 mb-3">
        Сонгосон зургууд ({selectedFiles.length})
      </h3>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {#each previewUrls as url, index}
          <div class="relative group">
            <div
              class="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200"
            >
              <img
                src={url}
                alt="Preview {index + 1}"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Remove button -->
            <button
              type="button"
              class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              on:click={() => removeImage(index)}
              aria-label="Зураг устгах"
            >
              <X class="w-4 h-4" />
            </button>

            <!-- File info overlay -->
            <div
              class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <p class="truncate" title={selectedFiles[index]?.name}>
                {selectedFiles[index]?.name}
              </p>
              <p class="text-gray-300">
                {(selectedFiles[index]?.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
