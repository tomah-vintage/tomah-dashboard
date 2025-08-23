<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import type { MenuItemFormData } from "$lib/types/menu";

  let {
    formData = $bindable(),
    ingredientsInput = $bindable(),
    categoryInput = $bindable(),
    errors,
  } = $props<{
    formData: MenuItemFormData;
    ingredientsInput: string;
    categoryInput: string;
    errors: Record<string, string>;
  }>();
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
  <Input
    id="categories"
    label="Ангилал (ID-гаар, таслалаар тусгаарлаж оруулах)"
    bind:value={categoryInput}
    placeholder="Жишээ: 1, 2"
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
