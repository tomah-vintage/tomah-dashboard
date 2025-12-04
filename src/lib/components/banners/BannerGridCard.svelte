<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import type { Banner } from "$lib/types/banner";
  import { Trash2, GripVertical } from "@lucide/svelte";

  const dispatch = createEventDispatcher();

  export let banner: Banner;
  export let index: number;
  export let dragOverIndex: number | null;
  export let layoutType: string;
  export let onDragStart: (e: DragEvent, banner: Banner) => void;
  export let onDragOver: (e: DragEvent, index: number) => void;
  export let onDragLeave: () => void;
  export let onDrop: (e: DragEvent, index: number) => void;

  function handleDelete() {
    dispatch("delete", banner.id);
  }

  function getImageAspectClass(layoutType: string) {
    switch (layoutType) {
      case "HERO":
        return "aspect-[16/6]";
      case "CAROUSEL":
        return "aspect-square";
      case "FEATURED":
        return "aspect-[3/2]";
      case "PROMOTIONAL":
        return "aspect-[4/3]";
      default:
        return "aspect-[4/3]";
    }
  }
</script>

<!-- Standard Grid Card (src/lib/components/banners/BannerGrid.svelte:277-362) -->
<div
  class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
  class:border-blue-300={dragOverIndex === index}
  class:bg-blue-50={dragOverIndex === index}
  draggable="true"
  on:dragstart={(e) => onDragStart(e, banner)}
  on:dragover|preventDefault={(e) => onDragOver(e, index)}
  on:dragleave={onDragLeave}
  on:drop={(e) => onDrop(e, index)}
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
          on:click={handleDelete}
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
    <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
      <span>Эрэмбэ: #{banner.order_index}</span>
      <span>
        {new Date(banner.updated_at).toLocaleDateString("mn-MN")}
      </span>
    </div>
  </div>
</div>
