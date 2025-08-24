<script lang="ts">
  import { CategoryMain } from "$lib/components/category-management";
  export let data;
</script>

<svelte:head>
  <title>Menu Categories | Qpick</title>
</svelte:head>

<CategoryMain restaurantId={data.user!.restaurant.id} />
