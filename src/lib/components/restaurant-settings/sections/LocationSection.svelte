<script lang="ts">
  import MapLocationPicker from "$lib/components/ui/MapLocationPicker.svelte";
  import { restaurantSettingsStore } from "$lib/stores/restaurantSettingsStore";

  let latitude = 47.9143;
  let longitude = 106.9167;

  // Subscribe to store
  restaurantSettingsStore.subscribe(state => {
    latitude = state.formData.latitude || 47.9143;
    longitude = state.formData.longitude || 106.9167;
  });

  function handleLocationChange(lat: number, lng: number) {
    restaurantSettingsStore.updateField('latitude', lat);
    restaurantSettingsStore.updateField('longitude', lng);
  }
</script>

<div id="section-location" class="scroll-mt-24">
  <div class="flex items-center mb-6">
    <div class="w-2 h-8 bg-green-600 rounded-sm mr-3"></div>
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Байршил</h2>
      <p class="text-sm text-gray-600 mt-1">
        Газрын зураг дээрээс рестораны байршлыг сонгоно уу
      </p>
    </div>
  </div>

  <MapLocationPicker
    {latitude}
    {longitude}
    onLocationChange={handleLocationChange}
  />
</div>
