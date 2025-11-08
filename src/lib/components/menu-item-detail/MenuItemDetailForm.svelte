<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import MultiSelectInput from "$lib/components/ui/multi-select-input/MultiSelectInput.svelte";
  import type { MenuItemDetailFormData } from "$lib/types/menu-item-detail";
  import type { Category } from "$lib/types/category";

  export let formData: MenuItemDetailFormData;
  export let categories: Category[] = []; // Will be populated from parent
  export let formErrors: { [key: string]: string } = {};

  // Placeholder for categories until real data is fetched
  const placeholderCategories: Category[] = [
    { id: 1, name: "Pizza", restaurant: "" },
    { id: 2, name: "Drinks", restaurant: "" },
    { id: 3, name: "Desserts", restaurant: "" },
  ];

  // Use actual categories if provided, otherwise use placeholder
  let availableCategories = categories.length > 0 ? categories : placeholderCategories;

  // Function to handle category selection change
  function handleCategoryChange(selectedCategoryIds: number[]) {
    formData.categories = selectedCategoryIds;
  }
</script>

<div class="space-y-4">
  <Input
    label="Нэр (Англи)"
    bind:value={formData.name}
    placeholder="Хоолны нэрийг оруулна уу"
    error={formErrors.name}
  />
  <Input
    label="Тайлбар"
    type="textarea"
    bind:value={formData.description}
    placeholder="Тайлбарыг оруулна уу"
    error={formErrors.description}
  />
  <Input
    label="Үнэ"
    type="number"
    bind:value={formData.price}
    placeholder="Үнийг оруулна уу"
    error={formErrors.price}
  />
  <Input
    label="Код"
    bind:value={formData.code}
    placeholder="Өвөрмөц кодыг оруулна уу"
    error={formErrors.code}
  />

  <MultiSelectInput
    id="category-select"
    label="Ангилал"
    suggestions={availableCategories}
    value={formData.categories}
    onchange={handleCategoryChange}
    error={formErrors.categories}
  />
</div>
