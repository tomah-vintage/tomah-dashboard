<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "$lib/components/ui/dialog";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import { BannerLayoutType, BannerPosition } from "$lib/types/banner";
  import ImageUploader from "$lib/components/new-restaurant/ImageUploader.svelte";
  import AspectRatioSelector from "./AspectRatioSelector.svelte";

  const dispatch = createEventDispatcher();

  export let open = false;

  let selectedLayoutType: BannerLayoutType = BannerLayoutType.Hero;
  let selectedPosition: BannerPosition = BannerPosition.Top;
  let animationType = "";
  let selectedFile: File | null = null;
  let aspectRatio = "16:9";

  const layoutTypeOptions = [
    { value: BannerLayoutType.Hero, label: "Hero - Том баннер" },
    { value: BannerLayoutType.Carousel, label: "Carousel - Гүйдэг баннер" },
    { value: BannerLayoutType.Featured, label: "Featured - Онцлох" },
    { value: BannerLayoutType.Promotional, label: "Promotional - Зар сурталчилгаа" },
    { value: BannerLayoutType.Magazine, label: "Magazine - Сэтгүүлийн төрөл" },
  ];

  const positionOptions = [
    { value: BannerPosition.Top, label: "Top - Дээд хэсэг" },
    { value: BannerPosition.Middle, label: "Middle - Дундаж хэсэг" },
    { value: BannerPosition.Bottom, label: "Bottom - Доод хэсэг" },
    { value: BannerPosition.Sidebar, label: "Sidebar - Хажуугийн хэсэг" },
  ];

  function handleImageSelect(event: CustomEvent<{ files: File[] }>) {
    const files = event.detail.files;
    if (files && files.length > 0) {
      selectedFile = files[0];
    }
  }

  function handleAspectRatioChange(event: CustomEvent<{ aspectRatio: string }>) {
    aspectRatio = event.detail.aspectRatio;
  }

  function handleSave() {
    if (!selectedFile) {
      alert("Зураг сонгоно уу");
      return;
    }

    // Parse aspect ratio to get width and height
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    const baseSize = 300; // Base size for calculation
    const calculatedWidth = Math.round(baseSize * (widthRatio / Math.max(widthRatio, heightRatio)));
    const calculatedHeight = Math.round(baseSize * (heightRatio / Math.max(widthRatio, heightRatio)));

    dispatch("save", {
      file: selectedFile,
      layout_type: selectedLayoutType,
      position: selectedPosition,
      width: calculatedWidth,
      height: calculatedHeight,
      animation_type: animationType.trim() || undefined,
    });

    // Reset form
    resetForm();
  }

  function handleClose() {
    resetForm();
    dispatch("close");
  }

  function resetForm() {
    selectedLayoutType = BannerLayoutType.Hero;
    selectedPosition = BannerPosition.Top;
    animationType = "";
    selectedFile = null;
    aspectRatio = "16:9";
  }
</script>

<Dialog {open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
  <DialogContent class_="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Шинэ баннер нэмэх</DialogTitle>
    </DialogHeader>

    <div class="p-6 space-y-6">
      <!-- File Upload Area -->
      <div class="space-y-2">
        <Label>Баннер зураг сонгох</Label>
        <ImageUploader
          multiple={false}
          id="banner-uploader"
          name="banner"
          on:select={handleImageSelect}
        />
      </div>

      <!-- Aspect Ratio Selector -->
      <AspectRatioSelector 
        bind:selectedAspectRatio={aspectRatio}
        on:change={handleAspectRatioChange}
      />

      <!-- Form Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for_="layoutType">Төрөл *</Label>
          <select
            id="layoutType"
            bind:value={selectedLayoutType}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {#each layoutTypeOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-2">
          <Label for_="position">Байрлал *</Label>
          <select
            id="position"
            bind:value={selectedPosition}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {#each positionOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <Label for_="animationType">Хөдөлгөөний төрөл</Label>
        <Input
          id="animationType"
          bind:value={animationType}
          placeholder="CSS animation class (fade-in, slide-up, гэх мэт)"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <Button variant="outline" on:click={handleClose}>Болих</Button>
        <Button on:click={handleSave} disabled={!selectedFile}>
          Хадгалах
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
