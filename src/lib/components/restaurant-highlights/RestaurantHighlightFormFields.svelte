<script lang="ts">
  import type { RestaurantHighlightForm } from "$lib/types/restaurant-highlight";
  import { Input } from "$lib/components/ui/input";
  import { HIGHLIGHT_TYPES } from "$lib/constants/restaurant-highlights";

  export let form: RestaurantHighlightForm;
  export let isEditing = false;
</script>

<div class="space-y-4">
  <div>
    <label for="highlight-name" class="block text-sm font-medium text-gray-700 mb-1">
      Нэр *
    </label>
    <Input
      id="highlight-name"
      type="text"
      placeholder="Онцлохын нэр оруулах (ж.нь: санал болгосон, өглөөний цай)"
      bind:value={form.name}
      required
    />
    <p class="text-xs text-gray-500 mt-1">Онцлохын давтагдашгүй тэмдэглэгээ (жижиг үсэг, зай байхгүй)</p>
  </div>

  <div>
    <label for="highlight-display-name" class="block text-sm font-medium text-gray-700 mb-1">
      Харуулах нэр *
    </label>
    <Input
      id="highlight-display-name"
      type="text"
      placeholder="Харуулах нэр оруулах (ж.нь: Санал болгосон, Өглөөний тусгай)"
      bind:value={form.display_name}
      required
    />
    <p class="text-xs text-gray-500 mt-1">Хэрэглэгчдэд харагдах нэр</p>
  </div>

  <div>
    <label for="highlight-type" class="block text-sm font-medium text-gray-700 mb-1">
      Онцлохын төрөл *
    </label>
    <select
      id="highlight-type"
      bind:value={form.highlight_type}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      required
    >
      {#each HIGHLIGHT_TYPES as type (type.value)}
        <option value={type.value}>{type.label}</option>
      {/each}
    </select>
    {#each HIGHLIGHT_TYPES as type (type.value)}
      {#if form.highlight_type === type.value}
        <p class="text-xs text-gray-500 mt-1">{type.description}</p>
      {/if}
    {/each}
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div>
      <label for="highlight-color" class="block text-sm font-medium text-gray-700 mb-1">
        Өнгө *
      </label>
      <div class="flex items-center space-x-2">
        <input
          id="highlight-color"
          type="color"
          bind:value={form.color}
          class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          required
        />
        <Input
          type="text"
          bind:value={form.color}
          placeholder="#007bff"
          class="flex-1"
          required
        />
      </div>
      <p class="text-xs text-gray-500 mt-1">Онцлохын шошгоны Hex өнгөний код</p>
    </div>

    <div>
      <label for="highlight-order" class="block text-sm font-medium text-gray-700 mb-1">
        Эрэмбийн дугаар
      </label>
      <Input
        id="highlight-order"
        type="number"
        bind:value={form.order_index}
        min="0"
        placeholder="0"
      />
      <p class="text-xs text-gray-500 mt-1">Бага тоо эхэнд харагдана</p>
    </div>
  </div>

  <div>
    <label for="highlight-icon" class="block text-sm font-medium text-gray-700 mb-1">
      Дүрс тэмдэг (заавал биш)
    </label>
    <Input
      id="highlight-icon"
      type="text"
      placeholder="од, зүрх, дөл (дүрс тэмдгийн нэр эсвэл класс)"
      bind:value={form.icon}
    />
    <p class="text-xs text-gray-500 mt-1">Онцлохын дүрс тэмдгийн нэр эсвэл CSS класс</p>
  </div>

  <div>
    <label class="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        bind:checked={form.is_active}
        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span class="text-sm font-medium text-gray-700">Идэвхтэй</span>
    </label>
    <p class="text-xs text-gray-500 mt-1">Зөвхөн идэвхтэй онцлох хэрэглэгчдэд харагдана</p>
  </div>
</div>