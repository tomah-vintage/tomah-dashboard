<script lang="ts">
  import RestaurantSettingsFormModern from "./RestaurantSettingsFormModern.svelte";

  export let restaurantId: string;
</script>

<div class="max-w-4xl mx-auto">
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
      <div class="flex items-center">
        <div class="p-3 bg-white/10 rounded-lg mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold">Ресторан тохиргоо</h1>
          <p class="text-blue-100 mt-1">Рестораны мэдээлэл, байршил болон ажлын цагийг тохируулна уу</p>
        </div>
      </div>
    </div>
    
    <div class="p-8">
      <RestaurantSettingsFormModern {restaurantId} />
    </div>
  </div>
</div>