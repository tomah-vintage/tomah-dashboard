<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import {
    MenuManagementActions,
    MenuManagementFields,
    MenuManagementImageUploader,
  } from ".";
  import { createAddMenuItemMutation } from "$lib/queries/menu-queries";
  import type { MenuItemFormData } from "$lib/types/menu";
  import { goto } from "$app/navigation";
  import {
    menuItemFormSchema,
    uploadImages,
    processIngredients,
    processCategories,
  } from "$lib/utils/menu-management";

  let { restaurantId } = $props<{ restaurantId: number }>();

  const addMenuItemMutation = createAddMenuItemMutation();

  let formData: MenuItemFormData = $state({
    name: "",
    description: "",
    price: 0,
    categories: [],
    is_available: true,
    meta_data: {
      calories: 0,
      ingredients: [],
    },
    img_urls: [],
  });

  let ingredientsInput = $state("");
  let categoryInput = $state("");
  let errors = $state<Record<string, string>>({});
  let isUploading = $state(false);

  async function handleSubmit() {
    errors = {};

    formData.meta_data.ingredients = processIngredients(ingredientsInput);
    formData.categories = processCategories(categoryInput);

    try {
      isUploading = true;
      const result = menuItemFormSchema.safeParse(formData);

      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((error) => {
          const path = error.path.join(".");
          newErrors[path] = error.message;
        });
        errors = newErrors;
        return;
      }

      const uploadedImageUrls = await uploadImages(formData.img_urls);

      $addMenuItemMutation.mutate(
        {
          ...result.data,
          img_urls: uploadedImageUrls,
          restaurant: restaurantId,
        },
        {
          onSuccess: () => {
            goto("/menu");
          },
          onError: (err) => {
            console.error("Failed to create menu item:", err);
            errors = { ...errors, api: "Хоолны цэс үүсгэхэд алдаа гарлаа." };
          },
        }
      );
    } catch (error) {
      console.log("error", error);
      errors = {
        ...errors,
        img_urls: error instanceof Error ? error.message : "Алдаа гарлаа.",
      };
    } finally {
      isUploading = false;
    }
  }
</script>

<div class="p-4 sm:p-6 bg-content-background">
  <div class="mb-4">
    <a
      href="/menu"
      class="flex items-center text-sm text-gray-500 hover:underline"
    >
      <ArrowLeft class="w-4 h-4 mr-2" />
      Хоол нэмэх
    </a>
  </div>

  <div class="bg-card-background rounded-lg shadow p-4 sm:p-6">
    <form
      on:submit|preventDefault={handleSubmit}
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <MenuManagementImageUploader bind:imgUrls={formData.img_urls} />

      <MenuManagementFields bind:formData bind:ingredientsInput {errors} />

      <MenuManagementActions
        isPending={$addMenuItemMutation.isPending || isUploading}
      />
    </form>
  </div>
</div>
