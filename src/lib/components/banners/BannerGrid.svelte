<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import type { Banner } from "$lib/types/banner";
  import { BannerLayoutType } from "$lib/types/banner";
  import {
    Edit,
    Trash2,
    ExternalLink,
    GripVertical,
    Eye,
    EyeOff,
  } from "@lucide/svelte";

  const dispatch = createEventDispatcher();

  export let banners: Banner[];
  export let layoutType: string;

  let draggedBanner: Banner | null = null;
  let dragOverIndex: number | null = null;

  function handleDragStart(e: DragEvent, banner: Banner) {
    draggedBanner = banner;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
    dragOverIndex = index;
  }

  function handleDragLeave() {
    dragOverIndex = null;
  }

  function handleDrop(e: DragEvent, dropIndex: number) {
    e.preventDefault();
    if (!draggedBanner) return;

    const dragIndex = banners.findIndex((b) => b.id === draggedBanner?.id);
    if (dragIndex === -1 || dragIndex === dropIndex) return;

    // Reorder banners
    const reorderedBanners = [...banners];
    const [draggedItem] = reorderedBanners.splice(dragIndex, 1);
    reorderedBanners.splice(dropIndex, 0, draggedItem);

    // Update order_index
    const updatedBanners = reorderedBanners.map((banner, index) => ({
      ...banner,
      order_index: index,
    }));

    dispatch("reorderBanners", { banners: updatedBanners });

    draggedBanner = null;
    dragOverIndex = null;
  }

  function handleToggleActive(banner: Banner) {
    // Since there's no is_active field in the backend model, we'll remove this functionality for now
    // This could be implemented as a separate field if needed
    console.log("Toggle active not implemented yet");
  }

  function handleDelete(bannerId: string) {
    dispatch("deleteBanner", bannerId);
  }

  function getLayoutGridClass(layoutType: string) {
    switch (layoutType) {
      case "HERO":
        return "grid-cols-1";
      case "CAROUSEL":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      case "FEATURED":
        return "grid-cols-1 md:grid-cols-2";
      case "PROMOTIONAL":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case "MAGAZINE":
        return "magazine-layout";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  }

  function getImageAspectClass(layoutType: string, index?: number) {
    switch (layoutType) {
      case "HERO":
        return "aspect-[16/6]";
      case "CAROUSEL":
        return "aspect-square";
      case "FEATURED":
        return "aspect-[3/2]";
      case "PROMOTIONAL":
        return "aspect-[4/3]";
      case "MAGAZINE":
        return index === 0 ? "aspect-[4/3]" : "aspect-[16/9]";
      default:
        return "aspect-[4/3]";
    }
  }
</script>

{#if banners.length > 0}
  {#if layoutType === "MAGAZINE"}
    <!-- Magazine Layout Preview - Shows how it will look to customers -->
    <div class="magazine-layout-container min-h-96 bg-gray-50 rounded-lg p-4">
      <div class="flex flex-col md:flex-row gap-4 h-full">
        <!-- Main large banner (left side) -->
        {#if banners[0]}
          <div class="flex-1 md:w-2/3 relative group">
            <div
              class="relative bg-white border-2 border-dashed border-blue-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all h-64 md:h-80"
              class:border-solid={banners[0]}
              class:border-blue-500={dragOverIndex === 0}
              class:bg-blue-50={dragOverIndex === 0}
              draggable="true"
              on:dragstart={(e) => handleDragStart(e, banners[0])}
              on:dragover|preventDefault={(e) => handleDragOver(e, 0)}
              on:dragleave={handleDragLeave}
              on:drop={(e) => handleDrop(e, 0)}
            >
              <!-- Drag Handle -->
              <div class="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="bg-white rounded p-2 shadow-md cursor-move">
                  <GripVertical class="w-4 h-4 text-gray-600" />
                </div>
              </div>

              <!-- Order Badge -->
              <div class="absolute top-2 right-2 z-20">
                <Badge variant="default" class="bg-blue-600">Main Banner #{banners[0].order_index}</Badge>
              </div>

              <!-- Image -->
              <img src={banners[0].image_url} alt="Main banner" class="w-full h-full object-cover" />

              <!-- Delete overlay on hover -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="secondary" on:click={() => handleDelete(banners[0].id)} class="bg-white hover:bg-red-50 text-red-600">
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>

              <!-- Content overlay -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 class="text-white font-semibold text-lg">{banners[0].position} Position</h3>
                <p class="text-white/80 text-sm mt-1">Updated: {new Date(banners[0].updated_at).toLocaleDateString("mn-MN")}</p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Right side stacked banners -->
        <div class="flex flex-col md:w-1/3 gap-2">
          {#each banners.slice(1, 4) as banner, index (banner.id)}
            <div class="flex-1 relative group min-h-20">
              <div
                class="relative bg-white border-2 border-dashed border-green-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full"
                class:border-solid={banner}
                class:border-green-500={dragOverIndex === index + 1}
                class:bg-green-50={dragOverIndex === index + 1}
                draggable="true"
                on:dragstart={(e) => handleDragStart(e, banner)}
                on:dragover|preventDefault={(e) => handleDragOver(e, index + 1)}
                on:dragleave={handleDragLeave}
                on:drop={(e) => handleDrop(e, index + 1)}
              >
                <!-- Drag Handle -->
                <div class="absolute top-1 left-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="bg-white rounded p-1 shadow-sm cursor-move">
                    <GripVertical class="w-3 h-3 text-gray-500" />
                  </div>
                </div>

                <!-- Order Badge -->
                <div class="absolute top-1 right-1 z-20">
                  <Badge variant="default" class="bg-green-600 text-xs">#{banner.order_index}</Badge>
                </div>

                <!-- Image -->
                <img src={banner.image_url} alt="Side banner" class="w-full h-full object-cover" />

                <!-- Delete overlay on hover -->
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="secondary" on:click={() => handleDelete(banner.id)} class="bg-white hover:bg-red-50 text-red-600">
                    <Trash2 class="w-3 h-3" />
                  </Button>
                </div>

                <!-- Content overlay -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <h5 class="text-white font-medium text-xs">{banner.position}</h5>
                </div>
              </div>
            </div>
          {/each}

          <!-- Show empty slots if less than 3 side banners -->
          {#each Array(3 - Math.min(banners.length - 1, 3)) as _, emptyIndex}
            <div class="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 min-h-20 flex items-center justify-center">
              <span class="text-gray-400 text-xs">Empty slot #{banners.length + emptyIndex}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Info panel -->
      <div class="mt-4 p-3 bg-white rounded-lg border">
        <h4 class="font-medium text-gray-900 mb-2">Magazine Layout Preview</h4>
        <p class="text-sm text-gray-600">This shows how your magazine banners will appear to customers. Drag to reorder, hover to delete.</p>
        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>Total banners: {banners.length}</span>
          <span>Max recommended: 4 (1 main + 3 side)</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="grid gap-4 {getLayoutGridClass(layoutType)}">
      {#each banners as banner, index (banner.id)}
        <div
          class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          class:border-blue-300={dragOverIndex === index}
          class:bg-blue-50={dragOverIndex === index}
          draggable="true"
          on:dragstart={(e) => handleDragStart(e, banner)}
          on:dragover|preventDefault={(e) => handleDragOver(e, index)}
          on:dragleave={handleDragLeave}
          on:drop={(e) => handleDrop(e, index)}
        >
          <!-- Drag Handle -->
          <div
            class="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div class="bg-white rounded p-1 shadow-sm cursor-move">
              <GripVertical class="w-4 h-4 text-gray-500" />
            </div>
          </div>

          <!-- Position Badge -->
          <div class="absolute top-2 right-2 z-10">
            <Badge variant="default">
              {banner.position}
            </Badge>
          </div>

          <!-- Image -->
          <div class="relative {getImageAspectClass(layoutType)}">
            <img
              src={banner.image_url}
              alt="Banner image"
              class="w-full h-full object-cover"
            />

            <!-- Overlay on hover -->
            <div
              class="absolute inset-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center"
              style="background-color: rgba(0, 0, 0, 0.5);"
            >
              <div
                class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2"
              >
                <Button
                  size="sm"
                  variant="secondary"
                  on:click={() => handleDelete(banner.id)}
                  class="bg-white hover:bg-red-50 text-red-600"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  {banner.layout_type} - {banner.position}
                </h4>
                {#if banner.animation_type}
                  <p class="text-xs text-gray-500 mt-1 truncate">
                    Animation: {banner.animation_type}
                  </p>
                {/if}
                {#if banner.width && banner.height}
                  <p class="text-xs text-gray-500 mt-1">
                    {banner.width} × {banner.height}px
                  </p>
                {/if}
              </div>
            </div>

            <!-- Meta info -->
            <div
              class="mt-2 flex items-center justify-between text-xs text-gray-500"
            >
              <span>Эрэмбэ: #{banner.order_index}</span>
              <span>
                {new Date(banner.updated_at).toLocaleDateString("mn-MN")}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{:else}
  <div class="text-center py-8 text-gray-500">
    <p>Энэ байршилд баннер олдсонгүй</p>
  </div>
{/if}
