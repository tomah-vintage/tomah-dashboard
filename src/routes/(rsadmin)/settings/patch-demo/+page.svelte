<script lang="ts">
  import RestaurantSettingsMainModern from "$lib/components/restaurant-settings/RestaurantSettingsMainModern.svelte";
  import { ChevronRight } from "@lucide/svelte";
  import { sessionStore } from "$lib/stores/sessionStore";

  // Get restaurant ID from session store
  $: restaurantId = $sessionStore.user?.restaurant?.id || $sessionStore.user?.restaurantId || "1";
</script>

<svelte:head>
  <title>Ресторан тохиргоо (PATCH API) | Qpick</title>
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
        <span class="font-medium text-gray-900">PATCH API Demo</span>
      </div>
      
      <!-- Page Header -->
      <div class="pb-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg mr-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Ресторан тохиргоо (PATCH API)</h1>
            <p class="mt-2 text-gray-600">PATCH endpoint ашиглан хэсэгчлэн шинэчлэх функционал</p>
          </div>
        </div>
        
        <!-- API Information -->
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-sm font-semibold text-blue-800">PATCH Endpoint мэдээлэл</h3>
              <p class="text-sm text-blue-700 mt-1">
                <code class="bg-blue-100 px-2 py-1 rounded">PATCH /api/restaurants/{"{restaurant_id}/"}</code>
              </p>
              <p class="text-sm text-blue-600 mt-2">
                Энэ хуудас нь зөвхөн өөрчлөгдсөн талбаруудыг илгээж рестораны мэдээллийг шинэчлэх боломжийг олгодог.
                Хэсгээрээ хадгалах товчнууд ашиглан зөвхөн тухайн хэсгийн мэдээллийг шинэчлэх боломжтой.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <RestaurantSettingsMainModern {restaurantId} />
  </div>
</div>