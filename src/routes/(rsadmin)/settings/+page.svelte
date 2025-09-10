<script lang="ts">
  import RestaurantSettingsMain from "$lib/components/restaurant-settings/RestaurantSettingsMain.svelte";
  import { ChevronRight } from "@lucide/svelte";
  import { base } from "$app/paths";
  import type { Restaurant } from "$lib/types/restaurant";
  export let data;
  export let form;
</script>

<svelte:head>
  <title>Ресторан тохиргоо | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <div class="flex items-center space-x-2 text-sm text-gray-500 py-4">
        <div class="h-4 w-1 bg-blue-600 rounded-sm"></div>
        <a href="/settings" class="hover:text-blue-600 transition-colors">Тохиргоо</a>
        <ChevronRight size={16} class="text-gray-400" />
        <span class="font-medium text-gray-900">Ресторан тохиргоо</span>
      </div>
      
      <!-- Page Header -->
      <div class="pb-6">
        <h1 class="text-3xl font-bold text-gray-900">Ресторан тохиргоо</h1>
        <p class="mt-2 text-gray-600">Рестораны мэдээлэл, байршил болон ажлын цагийг тохируулна уу</p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <RestaurantSettingsMain restaurant={data.restaurant as Restaurant | null} {form} />
  </div>
</div>
