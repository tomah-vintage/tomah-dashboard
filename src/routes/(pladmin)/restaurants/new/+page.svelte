<script lang="ts">
  import { NewRestaurantMain } from "$lib/components/new-restaurant";
  import { ChevronRight } from "lucide-svelte";
  export let form;
</script>

<svelte:head>
  <title>New Restaurant | Qpick</title>
</svelte:head>

<div class="bg-slate-100 w-full h-full">
  <!-- Breadcrumbs -->
  <div class="flex items-center space-x-2 text-sm text-gray-500 py-6 bg-white">
    <div class="h-5 w-2 bg-primary-blue rounded-sm"></div>
    <a href="/restaurants" class="hover:underline text-lg">Ресторанууд</a>
    <ChevronRight size={20} />
    <span class="font-semibold">Ресторан нэмэх</span>
  </div>

  <NewRestaurantMain {form} />
</div>
