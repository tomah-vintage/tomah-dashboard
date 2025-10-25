<script lang="ts">
  import { createAddPlatformBannerMutation, createUpdatePlatformBannerMutation } from "$lib/queries/platform-banner-queries";
  import { createGetAllRestaurantsQuery } from "$lib/queries/menu-queries";
  import type { PlatformBanner } from "$lib/types/platform-banner";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { X } from "@lucide/svelte";
  import { createEventDispatcher } from "svelte";

  export let showModal = false;
  export let banner: PlatformBanner | null = null;

  const dispatch = createEventDispatcher();
  const addPlatformBannerMutation = createAddPlatformBannerMutation();
  const updatePlatformBannerMutation = createUpdatePlatformBannerMutation();
  const restaurantsQuery = createGetAllRestaurantsQuery();

  let selectedRestaurant: number = 0;
  let orderIndex: number = 0;
  let imageFile: File | null = null;
  let imagePreview: string = '';
  let uploading = false;

  $: isEditing = !!banner;
  $: modalTitle = isEditing ? 'Баннер засах' : 'Баннер нэмэх';
  $: submitButtonText = isEditing ? 'Баннер засах' : 'Баннер нэмэх';

  // Get restaurants data - handle both array and paginated response
  $: restaurants = Array.isArray($restaurantsQuery.data) 
    ? $restaurantsQuery.data 
    : $restaurantsQuery.data?.results || [];

  $: if (banner && showModal) {
    selectedRestaurant = banner.restaurant;
    orderIndex = banner.order_index;
    imagePreview = banner.image_url;
    imageFile = null;
  } else if (showModal && !banner) {
    resetForm();
  }

  function resetForm() {
    selectedRestaurant = 0;
    orderIndex = 0;
    imageFile = null;
    imagePreview = '';
  }

  function closeModal() {
    showModal = false;
    resetForm();
    dispatch('close');
  }

  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    imageFile = file;
  }

  function removeImage() {
    imageFile = null;
    imagePreview = '';
    // Reset file input
    const fileInput = document.getElementById('banner-image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  async function handleSubmit() {
    if (!selectedRestaurant || (!imageFile && !isEditing)) return;

    try {
      uploading = true;

      if (isEditing && banner) {
        $updatePlatformBannerMutation.mutate({
          id: banner.id,
          file: imageFile || undefined,
          restaurant: selectedRestaurant,
          order_index: orderIndex
        });
      } else if (imageFile) {
        $addPlatformBannerMutation.mutate({
          file: imageFile,
          restaurant: selectedRestaurant,
          order_index: orderIndex
        });
      }
    } catch (error) {
      console.error('Error submitting banner:', error);
    } finally {
      uploading = false;
    }
  }

  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  $: if ($addPlatformBannerMutation.isSuccess || $updatePlatformBannerMutation.isSuccess) {
    closeModal();
  }
</script>

{#if showModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background-color: rgba(55, 65, 81, 0.5);"
    on:click={handleOutsideClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 id="modal-title" class="text-xl font-bold">{modalTitle}</h2>
        <button
          on:click={closeModal}
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- Restaurant Selection -->
        <div>
          <label for="restaurant-select" class="block text-sm font-medium text-gray-700 mb-1">
            Ресторан *
          </label>
          {#if $restaurantsQuery.isLoading}
            <div class="text-gray-500">Ресторан ачаалж байна...</div>
          {:else if restaurants.length === 0}
            <div class="text-red-500">Ресторан олдсонгүй</div>
          {:else}
            <select
              id="restaurant-select"
              bind:value={selectedRestaurant}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={0}>Ресторан сонгоно уу</option>
              {#each restaurants as restaurant (restaurant.id)}
                <option value={restaurant.id}>{restaurant.name}</option>
              {/each}
            </select>
          {/if}
        </div>

        <!-- Image Upload -->
        <div>
          <label for="banner-image-upload" class="block text-sm font-medium text-gray-700 mb-1">
            Баннер зураг *
          </label>
          
          {#if imagePreview}
            <div class="mb-3">
              <div class="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Banner preview" 
                  class="w-48 h-32 object-cover rounded border"
                />
                <button
                  type="button"
                  on:click={removeImage}
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          {/if}
          
          <input
            id="banner-image-upload"
            type="file"
            accept="image/*"
            on:change={handleImageUpload}
            disabled={uploading}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={!isEditing && !imagePreview}
          />
          <p class="text-xs text-gray-500 mt-1">Баннерт харуулах зураг сонгоно уу (PNG, JPG, GIF)</p>
          {#if uploading}
            <p class="text-xs text-blue-600 mt-1">Зураг илгээж байна...</p>
          {/if}
        </div>

        <!-- Order Index -->
        <div>
          <label for="order-index" class="block text-sm font-medium text-gray-700 mb-1">
            Эрэмбийн дугаар
          </label>
          <Input
            id="order-index"
            type="number"
            bind:value={orderIndex}
            min="0"
            placeholder="0"
          />
          <p class="text-xs text-gray-500 mt-1">Бага тоо эхэнд харагдана</p>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            on:click={closeModal}
          >
            Болих
          </Button>
          <Button
            type="submit"
            disabled={!selectedRestaurant || (!imageFile && !isEditing) || uploading || $addPlatformBannerMutation.isPending || $updatePlatformBannerMutation.isPending}
          >
            {#if $addPlatformBannerMutation.isPending || $updatePlatformBannerMutation.isPending}
              {isEditing ? 'Засч байна...' : 'Нэмж байна...'}
            {:else}
              {submitButtonText}
            {/if}
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}