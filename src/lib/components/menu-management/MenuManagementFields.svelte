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

<div class="space-y-6">
  <!-- Basic Information -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Үндсэн мэдээлэл</h3>
    <div class="space-y-4">
      <Input
        id="name"
        label="Хоолны нэр"
        bind:value={formData.name}
        placeholder="Жишээ: Цуйван"
        error={errors.name}
      />
      <Input
        id="description"
        label="Тайлбар"
        type="textarea"
        bind:value={formData.description}
        placeholder="Хоолны талаарх дэлгэрэнгүй мэдээлэл бичнэ үү"
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
      <div class="flex items-center">
        <Input
          type="checkbox"
          id="is_available"
          label="Идэвхтэй статустай"
          bind:value={formData.is_available}
        />
      </div>
    </div>
  </div>

  <!-- Categories -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Ангилал</h3>
    <MultiSelectInput
      id="categories"
      label="Хоолны ангилал"
      bind:value={formData.categories}
      suggestions={categories}
      placeholder="Ангилал сонгох"
      error={errors.categories}
    />
  </div>

  <!-- Nutrition Information -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Тэжээлийн үзүүлэлт</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        label="Орц найрлага"
        bind:value={ingredientsInput}
        placeholder="Жишээ: үхрийн мах, бяслаг, сонгино"
        error={errors["meta_data.ingredients"]}
      />
    </div>
    <p class="text-sm text-gray-500 mt-2">
      Орц найрлагыг таслалаар тусгаарлаж оруулна уу
    </p>
  </div>
</div>
