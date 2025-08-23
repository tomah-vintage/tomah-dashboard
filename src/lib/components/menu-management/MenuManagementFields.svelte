<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { MultiSelectInput } from "$lib/components/ui/multi-select-input"; // Import MultiSelectInput
  import type { MenuItemFormData } from "$lib/types/menu";
  import { createGetCategoriesQuery } from "$lib/queries/menu-queries"; // Import the categories query

  let {
    formData = $bindable(),
    ingredientsInput = $bindable(),
    errors,
  } = $props<{
    formData: MenuItemFormData;
    ingredientsInput: string;
    errors: Record<string, string>;
  }>();

  const categoriesQuery = createGetCategoriesQuery();
  let categories = $derived($categoriesQuery.data || []);
</script>

<div class="md:col-span-2 space-y-4">
  <Input
    id="name"
    label="Нэр"
    bind:value={formData.name}
    placeholder="Жишээ: Цуйван"
    error={errors.name}
  />
  <Input
    id="description"
    label="Тайлбар"
    type="textarea"
    bind:value={formData.description}
    placeholder="Жишээ: ..."
    error={errors.description}
  />
  <Input
    id="price"
    label="Үнэ"
    type="price"
    bind:value={formData.price}
    placeholder="Жишээ: 12000.00"
    error={errors.price}
  />
  <!-- Multi-select for categories -->
  <MultiSelectInput
    id="categories"
    label="Ангилал"
    bind:value={formData.categories}
    suggestions={categories}
    placeholder="Ангилал сонгох"
    error={errors.categories}
  />
  <Input
    id="calories"
    label="Калори"
    type="number"
    bind:value={formData.meta_data.calories}
    placeholder="Жишээ: 700"
    error={errors["meta_data.calories"]}
  />
  <Input
    id="ingredients"
    label="Орц (таслалаар тусгаарлаж оруулах)"
    bind:value={ingredientsInput}
    placeholder="Жишээ: үхрийн мах, бяслаг"
    error={errors["meta_data.ingredients"]}
  />
  <Input
    type="checkbox"
    id="is_available"
    label="Идэвхтэй"
    bind:value={formData.is_available}
  />
</div>
