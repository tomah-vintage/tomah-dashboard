<script lang="ts">
  import PatchExamples from "$lib/components/restaurant-settings/PatchExamples.svelte";
  import { ChevronRight } from "@lucide/svelte";
  import { sessionStore } from "$lib/stores/sessionStore";

  // Get restaurant ID from session store
  $: restaurantId = $sessionStore.user?.restaurant?.id || $sessionStore.user?.restaurantId || "1";
</script>

<svelte:head>
  <title>PATCH API жишээнүүд | Qpick</title>
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
        <span class="font-medium text-gray-900">PATCH API жишээнүүд</span>
      </div>
      
      <!-- Page Header -->
      <div class="pb-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg mr-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">PATCH API жишээнүүд</h1>
            <p class="mt-2 text-gray-600">Ресторан тохиргоог хэсэгчлэн шинэчлэх янз бүрийн арга</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <PatchExamples {restaurantId} />
  </div>
</div>