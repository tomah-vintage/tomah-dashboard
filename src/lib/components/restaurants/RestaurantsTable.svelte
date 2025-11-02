<script lang="ts">
  import type { AdminRestaurantListItem } from "$lib/types/restaurant";
  import RestaurantsTableRow from "./RestaurantsTableRow.svelte";

  export let restaurants: AdminRestaurantListItem[] = [];
</script>

<table class="min-w-full text-sm text-left">
  <thead class="text-gray-600 font-medium">
    <tr>
      <th class="p-3">Нэр</th>
      <th class="p-3">Зураг</th>
      <th class="p-3">Орлого</th>
      <th class="p-3">Үнэлгээ</th>
      <th class="p-3">Захиалга төлөлт</th>
      <th class="p-3">Үүссэн огноо</th>
      <th class="p-3 text-center">Үйлдэл</th>
    </tr>
  </thead>
  <tbody>
    {#each restaurants as restaurant (restaurant.id)}
      <RestaurantsTableRow {restaurant} />
    {/each}
  </tbody>
</table>
