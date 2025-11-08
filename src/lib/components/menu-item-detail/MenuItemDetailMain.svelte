<script lang="ts">
  import { menuItemDetailStore } from "$lib/stores/menu-item-detail";
  import {
    apiEndpoints,
    validateMenuItemDetailFormData,
  } from "$lib/utils/menu-item-detail";
  import { apiFetch } from "$lib/utils/api";
  import { Button } from "$lib/components/ui/button";
  import MenuItemImageDisplay from "./MenuItemImageDisplay.svelte";
  import MenuItemDetailForm from "./MenuItemDetailForm.svelte";
  import MenuItemVariantEditor from "./MenuItemVariantEditor.svelte";
  import type {
    MenuItemDetail,
    MenuItemDetailFormData,
  } from "$lib/types/menu-item-detail";
  import type { Category } from "$lib/types/category";
  import toast from "svelte-french-toast";
  import { queryClient } from "$lib/utils/query-client";

  export let data: { menuItem: MenuItemDetail; categories: Category[] };

  let menuItemId: number;
  let formData: MenuItemDetailFormData;
  let formErrors: { [key: string]: string } = {};
  let categories: Category[] = [];

  $: if (data.menuItem) {
    menuItemId = data.menuItem.id;
    formData = {
      name: data.menuItem.name,
      description: data.menuItem.description,
      price: parseFloat(data.menuItem.price),
      categories: data.menuItem.categories,
      is_available: data.menuItem.is_available,
      meta_data: {
        calories: parseInt(data.menuItem.meta_data.calories) || 0,
        ingredients: data.menuItem.meta_data.ingredients || [],
        variants: data.menuItem.variants || [],
        has_variants: data.menuItem.has_variants || false,
      },
      img_urls: [], // Initialize as empty array since we can't convert strings to Files
      code: data.menuItem.code,
      variants: data.menuItem.variants || [],
    };
  }

  $: if (data.categories) {
    categories = data.categories;
  }

  async function handleSubmit() {
    formErrors = {}; // Clear previous errors
    const validationError = validateMenuItemDetailFormData(formData);
    if (validationError) {
      toast.error(validationError);
      // You might want to map validationError to specific formErrors fields here
      return;
    }

    menuItemDetailStore.update((state) => ({ ...state, loading: true }));
    try {
      await apiFetch(apiEndpoints.updateMenuItem(menuItemId), {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      toast.success("Хоолны зүйл амжилттай шинэчлэгдлээ!");
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      queryClient.invalidateQueries({ queryKey: ["menuItem", menuItemId] });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Хоолны зүйл шинэчлэхэд алдаа гарлаа.",
      );
      console.error("Update error:", error);
    } finally {
      menuItemDetailStore.update((state) => ({ ...state, loading: false }));
    }
  }

  function handleCancel() {
    // Navigate back or reset form
    window.history.back();
  }
</script>

<div class="container p-4 mx-auto">
  <h1 class="mb-6 text-2xl font-bold">Хоолны зүйл засах</h1>

  {#if $menuItemDetailStore.loading}
    <p>Ачаалж байна...</p>
  {:else if $menuItemDetailStore.error}
    <p class="text-red-500">Алдаа: {$menuItemDetailStore.error}</p>
  {:else if formData}
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-1">
        <MenuItemImageDisplay imageUrl={data.menuItem.img_urls[0] || ""} />
      </div>
      <div class="space-y-6 lg:col-span-2">
        <MenuItemDetailForm bind:formData {categories} bind:formErrors />
        <MenuItemVariantEditor bind:variants={formData.variants} />

        <div class="flex justify-end gap-4 mt-6">
          <Button variant="secondary" onclick={handleCancel}>Цуцлах</Button>
          <Button onclick={handleSubmit}>Хадгалах</Button>
        </div>
      </div>
    </div>
  {:else}
    <p>Хоолны зүйлсийн мэдээлэл байхгүй байна.</p>
  {/if}
</div>
