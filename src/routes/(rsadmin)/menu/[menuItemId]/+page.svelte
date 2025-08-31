<script lang="ts">
  import type { PageData } from "./$types";
  import { MenuItemDetailMain } from "$lib/components/menu-item-detail";

  export let data: PageData;
</script>

<svelte:head>
  <title>Хоолны зүйл засах</title>
</svelte:head>

<MenuItemDetailMain {data} />
