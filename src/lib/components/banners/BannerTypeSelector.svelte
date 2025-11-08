<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "$lib/components/ui/dialog";
  import { BannerLayoutType } from "$lib/types/banner";
  import {
    Monitor,
    RotateCcw,
    BookOpen,
  } from "@lucide/svelte";

  const dispatch = createEventDispatcher();

  export let open = false;

  const bannerTypes = [
    {
      type: BannerLayoutType.Hero,
      title: "Hero баннер",
      description:
        "Нүүр хуудсанд байрлах гол, том хэмжээтэй баннер.",
      icon: Monitor,
      features: ["Том хэмжээ", "Зураг, видео", "Анимэйшн"],
    },
    {
      type: BannerLayoutType.Carousel,
      title: "Carousel баннер",
      description: "Олон баннерыг гүйлгэж харуулах хэлбэр.",
      icon: RotateCcw,
      features: ["Олон зураг", "Автомат гүйлт", "Хэрэглэгчийн удирдлага"],
    },
    {
      type: BannerLayoutType.Magazine,
      title: "Magazine баннер",
      description: "Нэг том, хэд хэдэн жижиг баннерыг сэтгүүл мэт зохион байгуулалттайгаар харуулах хэлбэр.",
      icon: BookOpen,
      features: ["Контент төвтэй", "Мэдээ, мэдээлэл", "Түүх өгүүлэх"],
    },
  ];

  function selectBannerType(type: BannerLayoutType) {
    dispatch("select", { bannerType: type });
  }

  function handleClose() {
    dispatch("close");
  }
</script>

<Dialog {open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
  <DialogContent class_="max-w-7xl w-[95vw]">
    <DialogHeader>
      <DialogTitle>Баннерын төрөл сонгох</DialogTitle>
    </DialogHeader>

    <div class="p-6">
      <p class="text-gray-600 mb-6">
        Та өөрийн ресторанд тохирох баннерын төрлийг сонгоно уу.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each bannerTypes as bannerType}
          <button
            type="button"
            class="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
            on:click={() => selectBannerType(bannerType.type)}
          >
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors"
              >
                <svelte:component
                  this={bannerType.icon}
                  class="w-6 h-6 text-blue-600"
                />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">
                  {bannerType.title}
                </h3>
              </div>
            </div>

            <p class="text-sm text-gray-600 mb-4">
              {bannerType.description}
            </p>

            <div class="space-y-1">
              {#each bannerType.features as feature}
                <div class="flex items-center text-xs text-gray-500">
                  <div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  {feature}
                </div>
              {/each}
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100">
              <div
                class="text-xs text-blue-600 font-medium group-hover:text-blue-700"
              >
                Сонгох →
              </div>
            </div>
          </button>
        {/each}
      </div>

      <div class="flex justify-end mt-8">
        <Button variant="secondary" on:click={handleClose}>Болих</Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
