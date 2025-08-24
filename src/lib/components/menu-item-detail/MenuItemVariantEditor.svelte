<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Plus, Trash2 } from "lucide-svelte";
  import type { MenuItemVariant } from "$lib/types/menu-item-detail";

  let { variants = $bindable([]) } = $props<{ variants: MenuItemVariant[] }>();

  function addVariant() {
    variants.push({ option: "", size: "", price: 0 });
  }

  function removeVariant(index: number) {
    variants.splice(index, 1);
  }
</script>

<div class="space-y-4">
  <h3 class="text-lg font-semibold">Хувилбарууд</h3>
  {#each variants as variant, index (index)}
    <div class="flex items-end gap-4 p-4 border rounded-md bg-gray-50">
      <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Сонголт" bind:value={variant.option} placeholder="e.g., Small, Medium" />
        <Input label="Хэмжээ" bind:value={variant.size} placeholder="e.g., 25cm, 30cm" />
        <Input label="Үнэ" type="number" bind:value={variant.price} placeholder="e.g., 15000" />
      </div>
      <Button variant="tertiary" onclick={() => removeVariant(index)}>
        <Trash2 class="w-5 h-5 text-red-500" />
      </Button>
    </div>
  {/each}
  <Button variant="secondary" onclick={addVariant}>
    <Plus class="w-4 h-4 mr-2" />
    Хувилбар нэмэх
  </Button>
</div>
