<script lang="ts">
  import type { DefaultCategoryForm } from "$lib/types/category";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { generateEnglishName } from "$lib/utils/transliteration";

  export let form: DefaultCategoryForm;
  export let isEditing = false;

  // Auto-generate English name when Mongolian name changes (only for new categories)
  $: if (form.mongolian_name && !isEditing) {
    form.name = generateEnglishName(form.mongolian_name);
  }
</script>

<div class="space-y-4">
  <div>
    <label for="category-mongolian-name" class="block text-sm font-medium text-gray-700 mb-1">
      Ангиллын нэр *
    </label>
    <Input
      id="category-mongolian-name"
      type="text"
      placeholder="Ангиллын нэр оруулах"
      bind:value={form.mongolian_name}
      required
    />
  </div>

  <div>
    <label for="category-description" class="block text-sm font-medium text-gray-700 mb-1">
      Тайлбар
    </label>
    <Textarea
      id="category-description"
      placeholder="Ангиллын тайлбар оруулах (заавал биш)"
      bind:value={form.description}
      rows={3}
    />
  </div>
</div>