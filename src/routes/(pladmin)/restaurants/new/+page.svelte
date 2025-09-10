<script lang="ts">
  import { NewRestaurantMain } from "$lib/components/new-restaurant";
  import { ChevronRight } from "@lucide/svelte";
  import { base } from "$app/paths";
  export let form;
</script>

<svelte:head>
  <title>Шинэ ресторан | Qpick</title>
</svelte:head>

<div class="bg-slate-100 w-full h-full">
  <!-- Breadcrumbs -->
  <div class="flex items-center space-x-2 text-sm text-gray-500 py-6 bg-white">
    <div class="h-5 w-2 bg-primary-blue rounded-sm"></div>
    <a href="{base}/restaurants" class="hover:underline text-lg">Ресторанууд</a>
    <ChevronRight size={20} />
    <span class="font-semibold">Ресторан нэмэх</span>
  </div>

  <NewRestaurantMain {form} />
</div>
