<script lang="ts">
  import { ArrowLeft, AlertCircle, CheckCircle } from "@lucide/svelte";
  import {
    MenuManagementActions,
    MenuManagementFields,
    MenuManagementImageUploader,
    MenuVariantManager,
  } from ".";
  import { createAddMenuItemMutation } from "$lib/queries/menu-queries";
  import type { MenuItemFormData } from "$lib/types/menu";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    menuItemFormSchema,
    uploadImages,
    processIngredients,
  } from "$lib/utils/menu-management";
  import toast from 'svelte-french-toast';

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
      variants: [],
      has_variants: false,
    },
    img_urls: [],
  });

  let ingredientsInput = $state("");
  let errors = $state<Record<string, string>>({});
  let isUploading = $state(false);
  let showSuccessMessage = $state(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    errors = {};

    formData.meta_data.ingredients = processIngredients(ingredientsInput);

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
        
        // Show validation error toast
        toast.error('Форм бөглөхөд алдаа гарлаа. Шаардлагатай талбаруудыг шалгана уу.');
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
            showSuccessMessage = true;
            toast.success('Хоолны цэс амжилттай нэмэгдлээ!');
            setTimeout(() => {
              goto(`${base}/menu`);
            }, 1500);
          },
          onError: (err) => {
            console.error("Failed to create menu item:", err);
            errors = { ...errors, api: "Хоолны цэс үүсгэхэд алдаа гарлаа." };
            toast.error('Хоолны цэс үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.');
          },
        }
      );
    } catch (error) {
      errors = {
        ...errors,
        img_urls: error instanceof Error ? error.message : "Алдаа гарлаа.",
      };
      toast.error('Зураг ачаалахад алдаа гарлаа.');
    } finally {
      isUploading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 py-6">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header with Breadcrumb -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <a href="{base}/menu" class="hover:text-gray-700 transition-colors">Цэс</a>
            <span>/</span>
            <span class="text-gray-900">Шинэ хоол нэмэх</span>
          </nav>
          <h1 class="text-2xl font-bold text-gray-900">Шинэ хоол нэмэх</h1>
          <p class="text-gray-600 mt-1">Хоолны цэсэнд шинэ зүйл нэмж тохиргоог хийнэ үү</p>
        </div>
        <a
          href="{base}/menu"
          class="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Буцах
        </a>
      </div>
    </div>

    <!-- Success Message -->
    {#if showSuccessMessage}
      <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
        <div class="flex items-center">
          <CheckCircle class="w-5 h-5 text-green-600 mr-3" />
          <div>
            <h3 class="text-green-800 font-medium">Амжилттай!</h3>
            <p class="text-green-700 text-sm">Хоолны цэс амжилттай нэмэгдлээ. Хуудас шилжүүлж байна...</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Global Error Message -->
    {#if errors.api}
      <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-red-600 mr-3" />
          <div>
            <h3 class="text-red-800 font-medium">Алдаа гарлаа</h3>
            <p class="text-red-700 text-sm">{errors.api}</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Form Container -->
    <form onsubmit={handleSubmit} class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Images Section -->
        <div class="lg:col-span-1">
          <MenuManagementImageUploader bind:imgUrls={formData.img_urls} />
          {#if errors.img_urls}
            <div class="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle class="w-4 h-4 mr-1" />
              {errors.img_urls}
            </div>
          {/if}
        </div>

        <!-- Form Fields -->
        <div class="lg:col-span-2 space-y-6">
          <MenuManagementFields bind:formData bind:ingredientsInput {errors} />
          
          <!-- Variants Section -->
          <MenuVariantManager 
            bind:variants={formData.meta_data.variants}
            bind:hasVariants={formData.meta_data.has_variants}
            {errors}
          />
        </div>
      </div>

      <!-- Actions Section -->
      <div class="sticky bottom-0 z-10 bg-gray-50 -mx-4 -mb-6 px-4 py-6 border-t bg-opacity-95 backdrop-blur-sm">
        <div class="max-w-6xl mx-auto">
          <MenuManagementActions
            isPending={$addMenuItemMutation.isPending || isUploading}
          />
        </div>
      </div>
    </form>
  </div>
</div>
