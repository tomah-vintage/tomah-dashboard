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

  const dispatch = createEventDispatcher();

  export let open = false;
  export let selectedLayoutType: BannerLayoutType | undefined = BannerLayoutType.Hero;

  let selectedPosition: BannerPosition = BannerPosition.Top;
  let selectedFile: File | null = null;

  const layoutTypeOptions = [
    { value: BannerLayoutType.Hero, label: "Hero баннер" },
    { value: BannerLayoutType.Carousel, label: "Carousel баннер" },
    { value: BannerLayoutType.Magazine, label: "Magazine баннер" },
  ];

  const positionOptions = [
    { 
      value: BannerPosition.Top, 
      label: "Дээд хэсэг", 
      description: "Хуудасны хамгийн дээд талд харагдана",
      icon: "⬆️"
    },
    { 
      value: BannerPosition.Middle, 
      label: "Дунд хэсэг", 
      description: "Хуудасны голд байрлана",
      icon: "➡️"
    },
    { 
      value: BannerPosition.Bottom, 
      label: "Доод хэсэг", 
      description: "Хуудасны хамгийн доод талд харагдана",
      icon: "⬇️"
    },
    { 
      value: BannerPosition.Sidebar, 
      label: "Хажуугийн хэсэг", 
      description: "Хуудасны хажуу талд байрлана",
      icon: "↔️"
    },
  ];

  function handleImageSelect(event: CustomEvent<{ files: File[] }>) {
    const files = event.detail.files;
    if (files && files.length > 0) {
      selectedFile = files[0];
    }
  }


  function handleSave() {
    if (!selectedFile) {
      alert("Зураг сонгоно уу");
      return;
    }

    const layoutType = selectedLayoutType || BannerLayoutType.Hero;
    
    dispatch("save", {
      file: selectedFile,
      layout_type: layoutType,
      position: layoutType === BannerLayoutType.Magazine ? selectedPosition : BannerPosition.Top,
    });

    // Reset form
    resetForm();
  }

  function handleClose() {
    resetForm();
    dispatch("close");
  }

  function resetForm() {
    selectedPosition = BannerPosition.Top;
    selectedFile = null;
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


      <!-- Banner Type -->
      <div class="space-y-2">
        <Label for_="layoutType">Сонгосон төрөл</Label>
        <div class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-medium text-gray-700">
          {layoutTypeOptions.find(opt => opt.value === selectedLayoutType)?.label || selectedLayoutType || BannerLayoutType.Hero}
        </div>
      </div>

      <!-- Position Selection - Only for Magazine banners -->
      {#if selectedLayoutType === BannerLayoutType.Magazine}
        <div class="space-y-3">
          <Label>Баннерын байрлал *</Label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {#each positionOptions as option}
              <button
                type="button"
                class="p-4 border-2 rounded-lg transition-all duration-200 text-left {selectedPosition === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}"
                on:click={() => selectedPosition = option.value}
              >
                <div class="flex items-start space-x-3">
                  <div class="text-2xl">{option.icon}</div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 mb-1">
                      {option.label}
                    </div>
                    <div class="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                  {#if selectedPosition === option.value}
                    <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        </div>
      {:else}
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-sm text-gray-600">
              {#if selectedLayoutType === BannerLayoutType.Hero}
                Hero баннер нүүр хуудасны дээд хэсэгт байрлана
              {:else if selectedLayoutType === BannerLayoutType.Carousel}
                Carousel баннер тодорхой байрлалтай байдаг
              {/if}
            </span>
          </div>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <Button variant="secondary" on:click={handleClose}>Болих</Button>
        <Button on:click={handleSave} disabled={!selectedFile}>
          Хадгалах
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
