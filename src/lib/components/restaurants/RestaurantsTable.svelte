<script lang="ts">
  import type { Restaurant } from "$lib/types/restaurant";
  import RestaurantsTableRow from "./RestaurantsTableRow.svelte";
  import { Input } from "$lib/components/ui/input";
  import { createEventDispatcher } from 'svelte';

  export let restaurants: (Restaurant & {
    register?: string;
    rating?: number;
  })[] = [];
  
  let selectAll = false;
  let selectedItems: boolean[] = restaurants.map(() => false);
  
  const dispatch = createEventDispatcher();
  
  $: {
    // Update selectAll based on individual selections
    const selectedCount = selectedItems.filter(Boolean).length;
    if (selectedCount === 0) {
      selectAll = false;
    } else if (selectedCount === restaurants.length) {
      selectAll = true;
    } else {
      selectAll = false; // Indeterminate state could be handled here
    }
  }
  
  function handleSelectAll() {
    selectedItems = restaurants.map(() => selectAll);
    dispatch('selectionChange', {
      selectedItems,
      selectedCount: selectAll ? restaurants.length : 0
    });
  }
  
  function handleItemSelect(index: number) {
    selectedItems[index] = !selectedItems[index];
    selectedItems = [...selectedItems]; // Trigger reactivity
    
    const selectedCount = selectedItems.filter(Boolean).length;
    dispatch('selectionChange', {
      selectedItems,
      selectedCount
    });
  }
  
  // Reset selections when restaurants change
  $: if (restaurants) {
    selectedItems = restaurants.map(() => false);
  }
</script>

<table class="min-w-full text-sm text-left">
  <thead class="text-gray-600 font-medium">
    <tr>
      <th class="p-3 w-12 text-center">
        <Input 
          type="checkbox" 
          label="" 
          bind:value={selectAll} 
          on:change={handleSelectAll}
        />
      </th>
      <th class="p-3">Нэр</th>
      <th class="p-3">Зураг</th>
      <th class="p-3">Утас</th>
      <th class="p-3">Хаяг</th>
      <th class="p-3">Регистр</th>
      <th class="p-3">Үнэлгээ</th>
      <th class="p-3 text-center">Үйлдэл</th>
    </tr>
  </thead>
  <tbody>
    {#each restaurants as restaurant, index (restaurant.id)}
      <RestaurantsTableRow 
        {restaurant} 
        selected={selectedItems[index]} 
        on:select={() => handleItemSelect(index)}
      />
    {/each}
  </tbody>
</table>
