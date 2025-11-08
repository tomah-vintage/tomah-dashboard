<script lang="ts">
  import RestaurantSettingsMainModern from "$lib/components/restaurant-settings/RestaurantSettingsMainModern.svelte";
  import { ChevronRight } from "@lucide/svelte";
  import { sessionStore } from "$lib/stores/sessionStore";

  // Get restaurant ID from session store - this goes directly to backend
  $: restaurantId = $sessionStore.user?.restaurant?.id || $sessionStore.user?.restaurantId || "1";
</script>

<svelte:head>
  <title>Ресторан тохиргоо | Tomah</title>
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
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <RestaurantSettingsMainModern {restaurantId} />
  </div>
</div>
