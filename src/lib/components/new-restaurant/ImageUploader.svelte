<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { UploadCloud, X, Image, Grid3X3, Rows, Columns } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";

  export let multiple: boolean = true;
  export let id = "image-uploader";
  export let name = "image";
  export let layout: "horizontal" | "vertical" | "grid" = "grid";
  export let showLayoutSelector: boolean = false;
  export let existingImages: string[] = [];

  let currentLayout: "horizontal" | "vertical" | "grid" = layout;

  const dispatch = createEventDispatcher();

  let selectedFiles: File[] = [];
  let previewUrls: string[] = [];

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);

      if (multiple) {
        selectedFiles = [...selectedFiles, ...files];
        if (typeof window !== 'undefined') {
          previewUrls = [
            ...previewUrls,
            ...files.map((file) => URL.createObjectURL(file)),
          ];
        }
      } else {
        selectedFiles = files;
        // Create preview URLs
        if (typeof window !== 'undefined') {
          previewUrls.forEach((url) => URL.revokeObjectURL(url)); // Clean up old URLs
          previewUrls = files.map((file) => URL.createObjectURL(file));
        }
      }

      dispatch("select", { files });
    } else {
      selectedFiles = [];
      if (typeof window !== 'undefined') {
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
      }
      previewUrls = [];
      dispatch("select", { files: [] });
    }
  }

  function removeImage(index: number) {
    // Revoke the URL for the removed image
    if (typeof window !== 'undefined') {
      URL.revokeObjectURL(previewUrls[index]);
    }

    // Remove from arrays
    selectedFiles = selectedFiles.filter((_, i) => i !== index);
    previewUrls = previewUrls.filter((_, i) => i !== index);

    // Update the file input
    if (typeof window !== 'undefined') {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) {
        // Create a new FileList with remaining files
        const dt = new DataTransfer();
        selectedFiles.forEach((file) => dt.items.add(file));
        input.files = dt.files;
      }
    }

    dispatch("select", { files: selectedFiles });
  }

  function removeExistingImage(index: number) {
    existingImages = existingImages.filter((_, i) => i !== index);
    dispatch("remove", { index, images: existingImages });
  }

  // Clean up URLs when component is destroyed
  import { onDestroy } from "svelte";
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    }
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
  {#if selectedFiles.length > 0 || existingImages.length > 0}
    <div class="mt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-gray-800 flex items-center">
          <Image class="w-5 h-5 mr-2" />
          Сонгосон зургууд ({selectedFiles.length + existingImages.length})
        </h3>
        
        {#if showLayoutSelector}
          <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              class="p-2 rounded-md transition-colors {currentLayout === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}"
              on:click={() => currentLayout = 'grid'}
              title="Grid цэгцүүлэг"
            >
              <Grid3X3 class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 rounded-md transition-colors {currentLayout === 'horizontal' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}"
              on:click={() => currentLayout = 'horizontal'}
              title="Хэвтээ харуулах"
            >
              <Rows class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="p-2 rounded-md transition-colors {currentLayout === 'vertical' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}"
              on:click={() => currentLayout = 'vertical'}
              title="Босоо харуулах"
            >
              <Columns class="w-4 h-4" />
            </button>
          </div>
        {/if}
      </div>
      <div
        class="{currentLayout === 'horizontal' 
          ? 'flex flex-wrap gap-4' 
          : currentLayout === 'vertical' 
            ? 'flex flex-col gap-4' 
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}"
      >
        {#each existingImages as url, index (url)}
          <div class="relative group {currentLayout === 'horizontal' ? 'flex-shrink-0' : ''}">
            <div
              class="{currentLayout === 'horizontal' 
                ? 'w-32 h-32 sm:w-40 sm:h-40' 
                : currentLayout === 'vertical' 
                  ? 'w-full h-48' 
                  : 'aspect-[4/3]'} 
              rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <img
                src={url}
                alt="Existing {index + 1}"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <!-- Remove button for existing images -->
            <button
              type="button"
              class="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              on:click={() => removeExistingImage(index)}
              aria-label="Зураг устгах"
            >
              <X class="w-5 h-5" />
            </button>

            <!-- Image number indicator -->
            <div class="absolute top-3 left-3 bg-green-500 text-white text-sm font-medium px-2 py-1 rounded-full">
              {index + 1}
            </div>
          </div>
        {/each}
        
        {#each previewUrls as url, index (url)}
          <div class="relative group {currentLayout === 'horizontal' ? 'flex-shrink-0' : ''}">
            <div
              class="{currentLayout === 'horizontal' 
                ? 'w-32 h-32 sm:w-40 sm:h-40' 
                : currentLayout === 'vertical' 
                  ? 'w-full h-48' 
                  : 'aspect-[4/3]'} 
              rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <img
                src={url}
                alt="Preview {index + 1}"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <!-- Remove button -->
            <button
              type="button"
              class="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              on:click={() => removeImage(index)}
              aria-label="Зураг устгах"
            >
              <X class="w-5 h-5" />
            </button>

            <!-- File info overlay -->
            <div
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <p class="font-medium truncate mb-1" title={selectedFiles[index]?.name}>
                {selectedFiles[index]?.name}
              </p>
              <p class="text-gray-300 text-sm">
                {(selectedFiles[index]?.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <!-- Image number indicator -->
            <div class="absolute top-3 left-3 bg-black/50 text-white text-sm font-medium px-2 py-1 rounded-full">
              {existingImages.length + index + 1}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
