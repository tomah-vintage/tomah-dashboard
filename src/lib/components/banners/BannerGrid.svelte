<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Banner } from "$lib/types/banner";
  import BannerGridCard from "./BannerGridCard.svelte";
  import BannerMagazineLayout from "./BannerMagazineLayout.svelte";

  const dispatch = createEventDispatcher();

  export let banners: Banner[];
  export let layoutType: string;

  let draggedBanner: Banner | null = null;
  let dragOverIndex: number | null = null;

  // Drag and drop handlers (src/lib/components/banners/BannerGrid.svelte:24-65)
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

  function handleDelete(event: CustomEvent<string>) {
    dispatch("deleteBanner", event.detail);
  }

  // Layout helpers (src/lib/components/banners/BannerGrid.svelte:77-92)
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
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  }
</script>

{#if banners.length > 0}
  {#if layoutType === "MAGAZINE"}
    <!-- Magazine Layout (src/lib/components/banners/BannerGrid.svelte:113-274) -->
    <BannerMagazineLayout
      {banners}
      {dragOverIndex}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      on:delete={handleDelete}
    />
  {:else}
    <!-- Standard Grid Layout (src/lib/components/banners/BannerGrid.svelte:276-364) -->
    <div class="grid gap-4 {getLayoutGridClass(layoutType)}">
      {#each banners as banner, index (banner.id)}
        <BannerGridCard
          {banner}
          {index}
          {dragOverIndex}
          {layoutType}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          on:delete={handleDelete}
        />
      {/each}
    </div>
  {/if}
{:else}
  <!-- Empty state (src/lib/components/banners/BannerGrid.svelte:366-369) -->
  <div class="text-center py-8 text-gray-500">
    <p>Энэ байршилд баннер олдсонгүй</p>
  </div>
{/if}
