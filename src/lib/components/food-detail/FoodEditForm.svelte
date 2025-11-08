<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import ImageUploader from "$lib/components/new-restaurant/ImageUploader.svelte";
  import MenuVariantManager from "$lib/components/menu-management/MenuVariantManager.svelte";
  import { X, Save } from "@lucide/svelte";
  import type { MenuItem } from "$lib/types/menu";
  import { toast } from "svelte-french-toast";
  import { createUpdateMenuItemMutation } from "$lib/queries/menu-queries";
  import { uploadImages } from "$lib/utils/menu-management";

  let {
    foodItem,
    onUpdate,
  }: {
    foodItem: MenuItem;
    onUpdate: (updatedItem: MenuItem) => void;
  } = $props();

  const updateMenuItemMutation = createUpdateMenuItemMutation();

  // Form state
  let formData = $state({
    name: foodItem.name,
    description: foodItem.description,
    price:
      typeof foodItem.price === "string"
        ? parseFloat(foodItem.price.replace(/[^\d.]/g, "")) || 0
        : foodItem.price,
    calories: foodItem.meta_data?.calories || "",
    ingredients: foodItem.meta_data?.ingredients || [],
    variants: foodItem.meta_data?.variants || [],
    has_variants: foodItem.meta_data?.has_variants || false,
    is_available: foodItem.is_available,
  });

  let selectedFiles = $state<File[]>([]);
  let newIngredient = $state("");
  let isLoading = $state(false);
  let errors = $state<Record<string, string>>({});

  // Update form data when foodItem changes
  $effect(() => {
    if (foodItem) {
      formData = {
        name: foodItem.name,
        description: foodItem.description,
        price:
          typeof foodItem.price === "string"
            ? parseFloat(foodItem.price.replace(/[^\d.]/g, "")) || 0
            : foodItem.price,
        calories: foodItem.meta_data?.calories || "",
        ingredients: foodItem.meta_data?.ingredients || [],
        variants: foodItem.meta_data?.variants || [],
        has_variants: foodItem.meta_data?.has_variants || false,
        is_available: foodItem.is_available,
      };
      selectedFiles = [];
    }
  });

  function handleImageSelect(event: CustomEvent<{ files: File[] }>) {
    selectedFiles = event.detail.files;
  }

  function addIngredient() {
    if (
      newIngredient.trim() &&
      !formData.ingredients.includes(newIngredient.trim())
    ) {
      formData.ingredients = [...formData.ingredients, newIngredient.trim()];
      newIngredient = "";
    }
  }

  function removeIngredient(index: number) {
    formData.ingredients = formData.ingredients.filter((_, i) => i !== index);
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      addIngredient();
    }
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    isLoading = true;
    errors = {};

    try {
      const uploadedImageUrls =
        selectedFiles.length > 0 ? await uploadImages(selectedFiles) : [];
      const finalImageUrls = [...(foodItem.img_urls || []), ...uploadedImageUrls];

      const submissionPayload = {
        id: foodItem.id,
        restaurant: foodItem.restaurant,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        is_available: formData.is_available,
        categories: foodItem.categories,
        meta_data: {
          calories: Number(formData.calories) || 0,
          ingredients: formData.ingredients,
          variants: formData.variants,
          has_variants: formData.has_variants,
        },
        img_urls: finalImageUrls,
      };

      $updateMenuItemMutation.mutate(submissionPayload, {
        onSuccess: (updatedItem) => {
          toast.success("Хоолны мэдээлэл амжилттай шинэчлэгдлээ");
          if (onUpdate) {
            onUpdate(updatedItem);
          }
        },
        onError: (err: Error) => {
          console.error("Update failed:", err);
          errors = err.response?.data?.errors || {};
          toast.error("Хоолны мэдээлэл шинэчлэхэд алдаа гарлаа");
        },
        onSettled: () => {
          isLoading = false;
        },
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Хоолны мэдээлэл шинэчлэхэд алдаа гарлаа");
      isLoading = false;
    }
  }
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="p-6 border-b border-gray-200">
    <h2 class="text-xl font-semibold text-gray-900">Хоол засах</h2>
    <p class="text-sm text-gray-600 mt-1">
      Хоолны мэдээлэл болон тохиргоог шинэчлэх
    </p>
  </div>

  <form onsubmit={handleSubmit} class="p-6 space-y-6">
    <!-- Food Images -->
    <div class="space-y-4">
      <h3 class="text-sm font-medium text-gray-900">Хоолны зураг</h3>
      <div class="border border-gray-200 rounded-lg p-4">
        <ImageUploader
          id="food-edit-images"
          name="food_images"
          layout="horizontal"
          on:select={handleImageSelect}
        />
      </div>

      <!-- Current Images -->
      {#if foodItem.img_urls && foodItem.img_urls.length > 0}
        <div class="space-y-3">
          <p class="text-sm font-medium text-gray-700">Одоогийн зургууд:</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each foodItem.img_urls as imageUrl (imageUrl)}
              <div
                class="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-200"
              >
                <img
                  src={imageUrl}
                  alt="Current"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Basic Info -->
    <div class="grid grid-cols-1 gap-4">
      <Input
        label="Хоолны нэр"
        placeholder="Хоолны нэрийг оруулна уу"
        bind:value={formData.name}
        required
        error={errors.name}
      />

      <div class="space-y-2">
        <label for="description" class="text-sm font-medium text-gray-700"
          >Тайлбар</label
        >
        <textarea
          id="description"
          bind:value={formData.description}
          placeholder="Хоолны тайлбарыг оруулна уу"
          rows="3"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
        {#if errors.description}
        <p class="text-sm text-red-600">{errors.description}</p>
        {/if}
      </div>

      <Input
        label="Үнэ (₮)"
        type="number"
        placeholder="0"
        bind:value={formData.price}
        required
        min="0"
        step="100"
        error={errors.price}
      />

      <Input
        label="Калори"
        placeholder="жнь: 650"
        bind:value={formData.calories}
        error={errors.calories}
      />
    </div>

    <!-- Ingredients -->
    <div class="space-y-4">
      <h3 class="text-sm font-medium text-gray-900">Найрлага</h3>

      <div class="flex gap-2">
        <input
          type="text"
          placeholder="Найрлага нэмэх"
          bind:value={newIngredient}
          onkeypress={handleKeyPress}
          class="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onclick={addIngredient}
        >
          Нэмэх
        </Button>
      </div>

      {#if formData.ingredients.length > 0}
        <div class="flex flex-wrap gap-2">
          {#each formData.ingredients as ingredient, index (index)}
            <div
              class="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
            >
              <span>{ingredient}</span>
              <button
                type="button"
                onclick={() => removeIngredient(index)}
                class="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
          {/each}
        </div>
      {/if}
       {#if errors.ingredients}
        <p class="text-sm text-red-600">{errors.ingredients}</p>
      {/if}
    </div>

    <!-- Variants -->
    <div class="space-y-4">
      <h3 class="text-sm font-medium text-gray-900">Хувилбарууд</h3>
      <MenuVariantManager
        bind:variants={formData.variants}
        bind:hasVariants={formData.has_variants}
        errors={errors}
      />
    </div>

    <!-- Availability -->
    <div class="flex items-center space-x-3">
      <input
        type="checkbox"
        id="availability"
        bind:checked={formData.is_available}
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
      />
      <label for="availability" class="text-sm font-medium text-gray-700">
        Боломжтой
      </label>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <Button
        type="submit"
        disabled={isLoading || $updateMenuItemMutation.isPending}
        class="flex items-center gap-2"
      >
        <Save class="w-4 h-4" />
        {isLoading || $updateMenuItemMutation.isPending ? "Хадгалж байна..." : "Хадгалах"}
      </Button>
    </div>
  </form>
</div>