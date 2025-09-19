<script lang="ts">
  import type { Restaurant } from "$lib/types/restaurant";
  import RestaurantsTableRow from "./RestaurantsTableRow.svelte";

  export let restaurants: (Restaurant & {
    register?: string;
    rating?: number;
    logo?: string;
  })[] = [];
</script>

<table class="min-w-full text-sm text-left">
  <thead class="text-gray-600 font-medium">
    <tr>
      <th class="p-3">Нэр</th>
      <th class="p-3">Зураг</th>
      <th class="p-3">И-мэйл</th>
      <th class="p-3">Утас</th>
      <th class="p-3">Хаяг</th>
      <th class="p-3">Статус</th>
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
