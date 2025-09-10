<script lang="ts">
  import { X, ChevronLeft, ChevronRight, ZoomIn } from "@lucide/svelte";

  export let images: string[] | undefined = [];

  let showLightbox = false;
  let currentImageIndex = 0;

  function openLightbox(index: number) {
    currentImageIndex = index;
    showLightbox = true;
  }

  function closeLightbox() {
    showLightbox = false;
  }

  function nextImage() {
    if (images && currentImageIndex < images.length - 1) {
      currentImageIndex++;
    }
  }

  function prevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!showLightbox) return;

    switch (event.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowRight":
        nextImage();
        break;
      case "ArrowLeft":
        prevImage();
        break;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if images && images.length > 0}
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    {#each images as image, i (image)}
      <button
        class="w-full h-40 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200 hover:scale-105"
        on:click={() => openLightbox(i)}
      >
        <img
          src={image}
          alt="Ресторанги зураг {i + 1}"
          class="w-full h-full object-cover rounded-lg shadow-md"
        />
        <div
          class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center rounded-lg"
        >
          <ZoomIn
            class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </div>
      </button>
    {/each}
  </div>
{:else}
  <div
    class="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300"
  >
    <div class="flex flex-col items-center space-y-2">
      <ZoomIn class="w-12 h-12 text-gray-400" />
      <p class="text-gray-500">Зураг оруулаагүй байна.</p>
    </div>
  </div>
{/if}

<!-- Lightbox Modal -->
{#if showLightbox && images && images[currentImageIndex]}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    style="background-color: rgba(0, 0, 0, 0.5);"
    on:click={closeLightbox}
    role="dialog"
    aria-modal="true"
  >
    <div class="relative max-w-4xl max-h-full" on:click|stopPropagation>
      <!-- Close Button -->
      <button
        class="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        on:click={closeLightbox}
        aria-label="Хаах"
      >
        <X class="w-6 h-6" />
      </button>

      <!-- Image -->
      <img
        src={images[currentImageIndex]}
        alt="Ресторанги зураг {currentImageIndex + 1}"
        class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
      />

      <!-- Navigation Buttons -->
      {#if images.length > 1}
        <!-- Previous Button -->
        {#if currentImageIndex > 0}
          <button
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            on:click={prevImage}
            aria-label="Өмнөх зураг"
          >
            <ChevronLeft class="w-8 h-8" />
          </button>
        {/if}

        <!-- Next Button -->
        {#if currentImageIndex < images.length - 1}
          <button
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            on:click={nextImage}
            aria-label="Дараах зураг"
          >
            <ChevronRight class="w-8 h-8" />
          </button>
        {/if}

        <!-- Image Counter -->
        <div
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm"
        >
          {currentImageIndex + 1} / {images.length}
        </div>
      {/if}
    </div>
  </div>
{/if}
