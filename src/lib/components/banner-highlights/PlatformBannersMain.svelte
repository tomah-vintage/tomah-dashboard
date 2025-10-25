<script lang="ts">
  import { createGetPlatformBannersQuery } from "$lib/queries/platform-banner-queries";
  import PlatformBannersList from "./PlatformBannersList.svelte";
  import PlatformBannerFormModal from "./PlatformBannerFormModal.svelte";
  import SearchInput from "$lib/components/ui/SearchInput.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Plus } from "@lucide/svelte";
  import type { PlatformBanner } from "$lib/types/platform-banner";

  const platformBannersQuery = createGetPlatformBannersQuery();

  $: platformBanners = $platformBannersQuery.data || [];

  let searchValue = "";
  let showAddBannerModal = false;
  let selectedBanner: PlatformBanner | null = null;

  // Filter banners by restaurant name
  $: filteredBanners = searchValue.trim() 
    ? platformBanners.filter(banner => 
        banner.restaurant_name.toLowerCase().includes(searchValue.toLowerCase().trim())
      )
    : platformBanners;

  function openAddBannerModal() {
    selectedBanner = null;
    showAddBannerModal = true;
  }

  function handleEdit(event: CustomEvent<PlatformBanner>) {
    selectedBanner = event.detail;
    showAddBannerModal = true;
  }
</script>

<div class="min-h-screen p-6 font-sans bg-gray-100">
  <div class="p-6 bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <span class="w-1 h-6 mr-3 bg-purple-600"></span>
        <h1 class="text-2xl font-bold">Баннер сурталчилгаа</h1>
      </div>
      <div class="flex items-center space-x-2">
        <SearchInput 
          placeholder="Ресторанаар хайх..."
          bind:value={searchValue}
          size="md"
        />
        <Button on:click={openAddBannerModal}>
          <Plus class="w-4 h-4 mr-1" />
          Баннер нэмэх
        </Button>
      </div>
    </div>

    <!-- Platform Banners List -->
    {#if $platformBannersQuery.isLoading}
      <div class="flex items-center justify-center py-8">
        <div class="text-gray-600">Баннер сурталчилгаа уншиж байна...</div>
      </div>
    {:else if $platformBannersQuery.isError}
      <div class="flex items-center justify-center py-8">
        <div class="text-red-600">Алдаа: {$platformBannersQuery.error?.message}</div>
      </div>
    {:else if filteredBanners.length === 0}
      <div class="flex items-center justify-center py-8">
        <div class="text-gray-600">
          {searchValue.trim() ? 'Хайлтад тохирох баннер олдсонгүй.' : 'Баннер сурталчилгаа олдсонгүй.'}
        </div>
      </div>
    {:else}
      <PlatformBannersList banners={filteredBanners} on:edit={handleEdit} />
    {/if}
  </div>
</div>

<PlatformBannerFormModal 
  bind:showModal={showAddBannerModal} 
  banner={selectedBanner}
  on:close={() => { selectedBanner = null; }}
/>