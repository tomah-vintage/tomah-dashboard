<script lang="ts">
  import type { PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import { Plus, Image, LayoutGrid, Settings } from "@lucide/svelte";
  import type { Banner, BannerPosition } from "$lib/types/banner";
  import { BannerLayoutType } from "$lib/types/banner";
  import {
    createGetBannersQuery,
    createAddBannerMutation,
    createUpdateBannerMutation,
    createDeleteBannerMutation,
  } from "$lib/queries/banner-queries";
  import {
    BannerGrid,
    BannerUploadModal,
    BannerLayoutManager,
    BannerTypeSelector,
  } from "$lib/components/banners";
  import { sessionStore } from "$lib/stores/sessionStore";

  export let data: PageData;

  let showTypeSelector = false;
  let showUploadModal = false;
  let showLayoutManager = false;
  let selectedLayoutType: BannerLayoutType | null = null;
  let banners: Banner[] = [];

  // Initialize queries and mutations
  const getBannersQuery = createGetBannersQuery(data.banners || []);
  const addBannerMutation = createAddBannerMutation();
  const updateBannerMutation = createUpdateBannerMutation();
  const deleteBannerMutation = createDeleteBannerMutation();

  // Update banners when query data changes
  $: if ($getBannersQuery.data) {
    banners = $getBannersQuery.data;
  }

  // Initialize banners with server data
  if (data.banners && banners.length === 0) {
    banners = data.banners;
  }

  function handleUploadBanner() {
    showTypeSelector = true;
  }

  function handleBannerTypeSelected(
    event: CustomEvent<{ bannerType: BannerLayoutType }>,
  ) {
    selectedLayoutType = event.detail.bannerType;
    showTypeSelector = false;
    showUploadModal = true;
  }

  function handleTypeSelectorClose() {
    showTypeSelector = false;
    selectedLayoutType = null;
  }

  function handleManageLayout(layoutType: string) {
    selectedLayoutType = layoutType as BannerLayoutType;
    showLayoutManager = true;
  }

  function handleCloseUploadModal() {
    showUploadModal = false;
    selectedLayoutType = null;
  }

  function handleCloseLayoutManager() {
    showLayoutManager = false;
    selectedLayoutType = null;
  }

  async function handleSaveBanner(
    event: CustomEvent<{
      file: File;
      layout_type: BannerLayoutType;
      position: BannerPosition;
    }>,
  ) {
    const restaurantId = $sessionStore.user?.restaurant?.id;
    if (!restaurantId) {
      console.error("Рестораны ID сессэнд олдсонгүй");
      return;
    }

    const bannerData = {
      ...event.detail,
      restaurant: restaurantId.toString(),
    };

    try {
      await $addBannerMutation.mutateAsync(bannerData);
      showUploadModal = false;
      selectedLayoutType = null;
    } catch (error) {
      console.error("Баннер үүсгэхэд алдаа гарлаа:", error);
      // You might want to show a toast or error message here
    }
  }

  async function handleUpdateBanner(banner: Banner) {
    await $updateBannerMutation.mutateAsync(banner);
  }

  async function handleDeleteBanner(bannerId: string) {
    if (confirm("Та энэ баннерыг устгахыг хүсч байна уу?")) {
      await $deleteBannerMutation.mutateAsync(bannerId);
    }
  }

  async function handleReorderBanners(
    event: CustomEvent<{ banners: Banner[] }>,
  ) {
    const updatedBanners = event.detail.banners;
    // Update order_index for all banners
    for (let i = 0; i < updatedBanners.length; i++) {
      if (updatedBanners[i].order_index !== i) {
        updatedBanners[i].order_index = i;
        await $updateBannerMutation.mutateAsync(updatedBanners[i]);
      }
    }
  }

  // Group banners by layout type
  $: bannersByLayoutType = banners.reduce(
    (acc, banner) => {
      const layoutKey = banner.layout_type;
      if (!acc[layoutKey]) {
        acc[layoutKey] = [];
      }
      acc[layoutKey].push(banner);
      return acc;
    },
    {} as Record<string, Banner[]>,
  );

  // Sort each layout group by order_index
  $: Object.keys(bannersByLayoutType).forEach((layoutType) => {
    bannersByLayoutType[layoutType].sort(
      (a, b) => a.order_index - b.order_index,
    );
  });
</script>

<svelte:head>
  <title>Баннер удирдлага | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Баннер удирдлага</h1>
            <p class="mt-1 text-sm text-gray-500">
              Рестораны баннеруудыг удирдаж, байрлалыг тохируулах
            </p>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Нийт баннер: {banners.length}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Action Buttons -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-4">
        <Button on:click={handleUploadBanner} class="flex items-center">
          <Plus class="w-4 h-4 mr-2" />
          Шинэ баннер нэмэх
        </Button>
        <Button
          variant="secondary"
          on:click={() => handleManageLayout(BannerLayoutType.Hero)}
          class="flex items-center"
        >
          <LayoutGrid class="w-4 h-4 mr-2" />
          Hero загвар
        </Button>
        <Button
          variant="secondary"
          on:click={() => handleManageLayout(BannerLayoutType.Carousel)}
          class="flex items-center"
        >
          <Settings class="w-4 h-4 mr-2" />
          Carousel загвар
        </Button>
        <Button
          variant="secondary"
          on:click={() => handleManageLayout(BannerLayoutType.Magazine)}
          class="flex items-center"
        >
          <LayoutGrid class="w-4 h-4 mr-2" />
          Magazine загвар
        </Button>
      </div>
    </div>

    <!-- Banner Layouts -->
    <div class="space-y-8">
      {#each Object.entries(bannersByLayoutType) as [layoutType, layoutBanners]}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 capitalize">
                  {layoutType} Загвар
                </h3>
                <p class="text-sm text-gray-500">
                  {layoutBanners.length} баннер
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                on:click={() => handleManageLayout(layoutType)}
              >
                Удирдах
              </Button>
            </div>
          </div>

          <div class="p-6">
            <BannerGrid
              banners={layoutBanners}
              {layoutType}
              on:updateBanner={(e) => handleUpdateBanner(e.detail)}
              on:deleteBanner={(e) => handleDeleteBanner(e.detail)}
              on:reorderBanners={handleReorderBanners}
            />
          </div>
        </div>
      {/each}

      {#if banners.length === 0}
        <div class="text-center py-12">
          <Image class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Баннер байхгүй байна
          </h3>
          <p class="text-gray-500">
            Дээрх "Шинэ баннер нэмэх" товчийг дарж эхлээрэй
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Modals -->
<BannerTypeSelector
  open={showTypeSelector}
  on:select={handleBannerTypeSelected}
  on:close={handleTypeSelectorClose}
/>

<BannerUploadModal
  open={showUploadModal}
  {selectedLayoutType}
  on:save={handleSaveBanner}
  on:close={handleCloseUploadModal}
/>

<BannerLayoutManager
  open={showLayoutManager}
  layoutType={selectedLayoutType}
  banners={selectedLayoutType
    ? bannersByLayoutType[selectedLayoutType] || []
    : []}
  on:updateBanners={(e) => handleReorderBanners(e)}
  on:close={handleCloseLayoutManager}
/>
