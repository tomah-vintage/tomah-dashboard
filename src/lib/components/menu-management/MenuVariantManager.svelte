<script lang="ts">
  import { Plus, X, Star, AlertCircle } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import type { MenuItemVariant } from "$lib/types/menu";

  let { 
    variants = $bindable(),
    hasVariants = $bindable(),
    errors
  } = $props<{
    variants: MenuItemVariant[];
    hasVariants: boolean;
    errors: Record<string, string>;
  }>();

  function addVariant() {
    const newVariant: MenuItemVariant = {
      name: "",
      price: 0,
      is_default: variants.length === 0
    };
    variants = [...variants, newVariant];
  }

  function removeVariant(index: number) {
    const removedVariant = variants[index];
    variants = variants.filter((_, i) => i !== index);
    
    // If we removed the default variant, make the first one default
    if (removedVariant.is_default && variants.length > 0) {
      variants[0].is_default = true;
    }
  }

  function setAsDefault(index: number) {
    variants = variants.map((variant, i) => ({
      ...variant,
      is_default: i === index
    }));
  }

  function toggleVariants() {
    hasVariants = !hasVariants;
    if (!hasVariants) {
      variants = [];
    } else {
      // Add a default variant when enabling variants
      if (variants.length === 0) {
        addVariant();
      }
    }
  }

  // Auto-generate variant names based on common patterns
  const variantSuggestions = [
    "Жижиг", "Дунд", "Том",
    "Small", "Medium", "Large", 
    "Өндөр", "Өргөн",
    "Энгийн", "Тусгай"
  ];
</script>

<div class="bg-white rounded-lg shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900">Хоолны хувилбарууд</h3>
    <div class="flex items-center">
      <Input
        type="checkbox"
        id="has_variants"
        label="Хувилбартай"
        bind:value={hasVariants}
        on:change={toggleVariants}
      />
    </div>
  </div>

  {#if !hasVariants}
    <div class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div class="flex flex-col items-center space-y-2">
        <Star class="w-8 h-8 text-gray-400" />
        <p class="text-gray-500 text-sm">
          Энэ хоол нь зөвхөн нэг төрөлтэй. Олон хэмжээ эсвэл төрөл нэмэхийг хүсвэл дээрх товчийг идэвхжүүлнэ үү.
        </p>
        <p class="text-xs text-gray-400">
          Жишээ нь: Пицца - Жижиг, Дунд, Том
        </p>
      </div>
    </div>
  {:else}
    <div class="space-y-4">
      <!-- Variants List -->
      {#if variants.length > 0}
        <div class="space-y-3">
          {#each variants as variant, index (index)}
            <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border transition-all duration-200 hover:shadow-sm">
              <!-- Default indicator -->
              <button
                type="button"
                class="flex-shrink-0"
                on:click={() => setAsDefault(index)}
                title={variant.is_default ? "Үндсэн хувилбар" : "Үндсэн болгох"}
              >
                <Star 
                  class="w-5 h-5 {variant.is_default ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 hover:text-yellow-400'} transition-colors"
                />
              </button>

              <!-- Variant name -->
              <div class="flex-1">
                <Input
                  label="Нэр"
                  bind:value={variant.name}
                  placeholder="Жишээ нь: Жижиг, Дунд, Том гэх мэт..."
                  list="variant-suggestions-{index}"
                />
                <datalist id="variant-suggestions-{index}">
                  {#each variantSuggestions as suggestion (suggestion)}
                    <option value={suggestion} />
                  {/each}
                </datalist>
              </div>

              <!-- Variant price -->
              <div class="flex-1">
                <Input
                  label="Үнэ"
                  type="price"
                  bind:value={variant.price}
                  placeholder="12000"
                />
              </div>

              <!-- Remove button -->
              <button
                type="button"
                class="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                on:click={() => removeVariant(index)}
                title="Хувилбар устгах"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Add Variant Button -->
      <Button
        type="button"
        variant="secondary"
        class="w-full"
        on:click={addVariant}
      >
        <Plus class="w-4 h-4 mr-2" />
        Шинэ хувилбар нэмэх
      </Button>

      <!-- Validation Errors -->
      {#if errors["meta_data.variants"] || errors.variants}
        <div class="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle class="w-4 h-4 mr-1" />
          {errors["meta_data.variants"] || errors.variants}
        </div>
      {/if}

      <!-- Info Section -->
      {#if variants.length > 0}
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start space-x-2">
            <AlertCircle class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-blue-800">
              <p class="font-medium">Хувилбарын заавар:</p>
              <ul class="mt-1 space-y-1 text-blue-700">
                <li>• Одтой хувилбар нь үндсэн хувилбар юм.</li>
                <li>• Хэрэглэгч анх үүнийг харна.</li>
                <li>• Хамгийн багадаа 1 хувилбар байх ёстой.</li>
              </ul>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>