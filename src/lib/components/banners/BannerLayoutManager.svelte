<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
  import { Badge } from "$lib/components/ui/badge";
  import type { Banner } from "$lib/types/banner";
  import { BannerLayoutType } from "$lib/types/banner";
  import { GripVertical, Eye, EyeOff, ExternalLink } from "@lucide/svelte";

  const dispatch = createEventDispatcher();

  export let open = false;
  export let layoutType: string | null = null;
  export let banners: Banner[] = [];

  let draggedBanner: Banner | null = null;
  let dragOverIndex: number | null = null;
  let localBanners: Banner[] = [];

  // Update local banners when props change
  $: if (banners) {
    localBanners = [...banners].sort((a, b) => a.order_index - b.order_index);
  }

  function handleDragStart(e: DragEvent, banner: Banner) {
    draggedBanner = banner;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    dragOverIndex = index;
  }

  function handleDragLeave() {
    dragOverIndex = null;
  }

  function handleDrop(e: DragEvent, dropIndex: number) {
    e.preventDefault();
    if (!draggedBanner) return;

    const dragIndex = localBanners.findIndex(b => b.id === draggedBanner?.id);
    if (dragIndex === -1 || dragIndex === dropIndex) return;

    // Reorder banners locally
    const reorderedBanners = [...localBanners];
    const [draggedItem] = reorderedBanners.splice(dragIndex, 1);
    reorderedBanners.splice(dropIndex, 0, draggedItem);

    // Update order_index
    localBanners = reorderedBanners.map((banner, index) => ({
      ...banner,
      order_index: index
    }));

    draggedBanner = null;
    dragOverIndex = null;
  }

  function handleToggleActive(index: number) {
    // Remove this functionality as is_active doesn't exist in backend model
    console.log('Toggle active not implemented');
  }

  function handleSave() {
    dispatch('updateBanners', { banners: localBanners });
    handleClose();
  }

  function handleClose() {
    // Reset local state
    localBanners = [...banners];
    draggedBanner = null;
    dragOverIndex = null;
    dispatch('close');
  }

  function getLayoutTitle(layoutType: string | null) {
    switch (layoutType) {
      case 'HERO':
        return 'Hero Layout - Том баннер';
      case 'CAROUSEL':
        return 'Carousel Layout - Гүйдэг баннер';
      case 'FEATURED':
        return 'Featured Layout - Онцлох';
      case 'PROMOTIONAL':
        return 'Promotional Layout - Зар сурталчилгаа';
      case 'MAGAZINE':
        return 'Magazine Layout - Сэтгүүлийн төрөл';
      default:
        return 'Layout удирдах';
    }
  }

  function getLayoutDescription(layoutType: string | null) {
    switch (layoutType) {
      case 'HERO':
        return 'Сайтын дээд хэсэгт харагдах том баннер. Онцлох зарууд.';
      case 'CAROUSEL':
        return 'Гүйдэг баннер хэлбэрээр харуулах. Дараалан солигдох баннерууд.';
      case 'FEATURED':
        return 'Онцлох хэсэгт байрлах баннер. Чухал мэдээллүүдэд зориулагдсан.';
      case 'PROMOTIONAL':
        return 'Зар сурталчилгааны баннерууд. Урамшуулал, хөнгөлөлт зэрэг.';
      case 'MAGAZINE':
        return 'Сэтгүүлийн төрлийн байрлал. Том баннер болон жижиг баннерууд хослуулан харуулах.';
      default:
        return '';
    }
  }

  function getMaxItems(layoutType: string | null) {
    switch (layoutType) {
      case 'HERO':
        return 3;
      case 'CAROUSEL':
        return 8;
      case 'FEATURED':
        return 4;
      case 'PROMOTIONAL':
        return 10;
      case 'MAGAZINE':
        return 5;
      default:
        return 10;
    }
  }
</script>

<Dialog {open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
  <DialogContent class_="max-w-4xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>{getLayoutTitle(layoutType)}</DialogTitle>
      <p class="text-sm text-gray-600">
        {getLayoutDescription(layoutType)}
      </p>
    </DialogHeader>

    <div class="p-6 space-y-6">
      <!-- Layout Info -->
      {#if layoutType}
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex justify-between items-center text-sm">
            <span>Нийт баннер: <strong>{localBanners.length}</strong></span>
            <span>Максимум: <strong>{getMaxItems(layoutType)}</strong></span>
          </div>
        </div>
      {/if}

      <!-- Banner List -->
      {#if localBanners.length > 0}
        <div class="space-y-3">
          <h4 class="font-medium text-gray-900">Баннерууд (дарааллаар эрэмбэлэх боломжтой)</h4>
          
          <div class="space-y-2">
            {#each localBanners as banner, index (banner.id)}
              <div
                class="flex items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                class:border-blue-300={dragOverIndex === index}
                class:bg-blue-50={dragOverIndex === index}
                draggable="true"
                on:dragstart={(e) => handleDragStart(e, banner)}
                on:dragover|preventDefault={(e) => handleDragOver(e, index)}
                on:dragleave={handleDragLeave}
                on:drop={(e) => handleDrop(e, index)}
              >
                <!-- Drag Handle -->
                <div class="cursor-move mr-3 text-gray-400 hover:text-gray-600">
                  <GripVertical class="w-5 h-5" />
                </div>

                <!-- Order Index -->
                <div class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4">
                  {banner.order_index}
                </div>

                <!-- Preview Image -->
                <div class="flex-shrink-0 w-16 h-12 bg-gray-200 rounded overflow-hidden mr-4">
                  <img
                    src={banner.image_url}
                    alt="Banner preview"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Banner Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <h5 class="text-sm font-medium text-gray-900 truncate">
                      {banner.layout_type} - {banner.position}
                    </h5>
                  </div>
                  
                  {#if banner.animation_type}
                    <p class="text-xs text-gray-500 truncate">
                      Animation: {banner.animation_type}
                    </p>
                  {/if}
                  {#if banner.width && banner.height}
                    <p class="text-xs text-gray-500 truncate">
                      {banner.width} × {banner.height}px
                    </p>
                  {/if}
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2">
                  <!-- Actions could be added here if needed -->
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="text-center py-8 text-gray-500">
          <p>Энэ байрлалд баннер байхгүй байна</p>
          <p class="text-sm mt-2">Шинэ баннер нэмэхийн тулд "Шинэ баннер нэмэх" товчийг дарна уу</p>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" on:click={handleClose}>
          Болих
        </Button>
        <Button on:click={handleSave} disabled={localBanners.length === 0}>
          Хадгалах
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>