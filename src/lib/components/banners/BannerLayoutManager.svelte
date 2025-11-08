<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "$lib/components/ui/dialog";
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

    const dragIndex = localBanners.findIndex((b) => b.id === draggedBanner?.id);
    if (dragIndex === -1 || dragIndex === dropIndex) return;

    // Reorder banners locally
    const reorderedBanners = [...localBanners];
    const [draggedItem] = reorderedBanners.splice(dragIndex, 1);
    reorderedBanners.splice(dropIndex, 0, draggedItem);

    // Update order_index
    localBanners = reorderedBanners.map((banner, index) => ({
      ...banner,
      order_index: index,
    }));

    draggedBanner = null;
    dragOverIndex = null;
  }

  function handleToggleActive(index: number) {
    // Remove this functionality as is_active doesn't exist in backend model
    console.log("Идэвхтэй/идэвхгүй болгох функц хэрэгжээгүй");
  }

  function handleSave() {
    dispatch("updateBanners", { banners: localBanners });
    handleClose();
  }

  function handleClose() {
    // Reset local state
    localBanners = [...banners];
    draggedBanner = null;
    dragOverIndex = null;
    dispatch("close");
  }

  function getLayoutTitle(layoutType: string | null) {
    switch (layoutType) {
      case "HERO":
        return "Hero - Нүүрний том баннер";
      case "CAROUSEL":
        return "Carousel - Гүйдэг баннер";
      case "FEATURED":
        return "Featured - Онцлох баннер";
      case "PROMOTIONAL":
        return "Promotional - Сурталчилгааны баннер";
      case "MAGAZINE":
        return "Magazine - Сэтгүүл хэлбэрийн баннер";
      default:
        return "Баннер байршлыг удирдах";
    }
  }

  function getLayoutDescription(layoutType: string | null) {
    switch (layoutType) {
      case "HERO":
        return "Вебсайтын нүүр хуудсанд байрлах гол, том хэмжээтэй баннер.";
      case "CAROUSEL":
        return "Олон баннерыг гүйлгэж харуулах хэлбэр.";
      case "FEATURED":
        return "Онцлох бүтээгдэхүүн, үйлчилгээг сурталчлах зориулалттай баннер.";
      case "PROMOTIONAL":
        return "Хямдрал, урамшуулал, онцгой саналуудыг сурталчлах баннер.";
      case "MAGAZINE":
        return "Нэг том, хэд хэдэн жижиг баннерыг сэтгүүл мэт зохион байгуулалттайгаар харуулах хэлбэр.";
      default:
        return "";
    }
  }

  function getMaxItems(layoutType: string | null) {
    switch (layoutType) {
      case "HERO":
        return 3;
      case "CAROUSEL":
        return 8;
      case "FEATURED":
        return 4;
      case "PROMOTIONAL":
        return 10;
      case "MAGAZINE":
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
            <span
              >Нийт баннерын тоо: <strong>{localBanners.length}</strong></span
            >
            <span
              >Хамгийн ихдээ: <strong>{getMaxItems(layoutType)}</strong></span
            >
          </div>
        </div>
      {/if}

      <!-- Banner List -->
      {#if localBanners.length > 0}
        <div class="space-y-3">
          <h4 class="font-medium text-gray-900">
            Баннерууд (чирч эрэмбэлэх боломжтой)
          </h4>

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
                <div
                  class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4"
                >
                  {banner.order_index}
                </div>

                <!-- Preview Image -->
                <div
                  class="flex-shrink-0 w-16 h-12 bg-gray-200 rounded overflow-hidden mr-4"
                >
                  <img
                    src={banner.image_url}
                    alt="Баннерын урьдчилсан харагдац"
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
          <p>Энэ байршилд баннер олдсонгүй</p>
          <p class="text-sm mt-2">
            Та 'Шинэ баннер нэмэх' товчийг дарж, шинээр баннер үүсгэх боломжтой.
          </p>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="secondary" on:click={handleClose}>Болих</Button>
        <Button on:click={handleSave} disabled={localBanners.length === 0}>
          Хадгалах
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
