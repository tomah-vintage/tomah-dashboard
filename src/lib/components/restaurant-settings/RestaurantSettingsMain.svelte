<script lang="ts">
  import RestaurantSettingsForm from "./RestaurantSettingsForm.svelte";
  import type { Restaurant } from "$lib/types/restaurant";

  export let form;
  export let restaurant: Restaurant | null = null;
</script>

<div class="max-w-4xl mx-auto">
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
      <div class="flex items-center">
        <div class="p-3 bg-white/10 rounded-lg mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2-2V7a2 2 0 012-2h10a2 2 0 012 2v12M9 7h6m-6 4h6m-6 4h6"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold">{restaurant ? 'Ресторан тохиргоо' : 'Ресторан нэмэх'}</h1>
          <p class="text-blue-100 mt-1">{restaurant ? 'Рестораны мэдээлэл шинэчлэх үүд доороо хэсэг бөглөнө үү' : 'Шинэ рестораны мэдээлэл оруулна үү'}</p>
        </div>
      </div>
    </div>
    
    <div class="p-8">
      <RestaurantSettingsForm {form} {restaurant} />
    </div>
  </div>
</div>