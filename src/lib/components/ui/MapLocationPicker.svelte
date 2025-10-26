<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { Map, Marker } from 'leaflet';

  export let latitude: number = 47.9143;
  export let longitude: number = 106.9167;
  export let onLocationChange: (lat: number, lng: number) => void = () => {};

  // Helper function to limit coordinate precision to max 9 digits total
  function limitCoordinatePrecision(coord: number): number {
    // Convert to string to count digits
    const coordStr = Math.abs(coord).toString();
    const [intPart, decPart] = coordStr.split('.');
    
    // If total digits exceed 9, reduce decimal places
    const totalDigits = intPart.length + (decPart?.length || 0);
    if (totalDigits > 9) {
      const maxDecimalPlaces = Math.max(0, 9 - intPart.length);
      return parseFloat(coord.toFixed(maxDecimalPlaces));
    }
    
    return coord;
  }

  let mapContainer: HTMLElement;
  let map: Map;
  let marker: Marker;

  onMount(async () => {
    if (browser) {
      // Dynamic import for Leaflet to avoid SSR issues
      const L = await import('leaflet');
      
      // Ensure we have valid coordinates
      const validLat = typeof latitude === 'number' ? latitude : 47.9143;
      const validLng = typeof longitude === 'number' ? longitude : 106.9167;
      
      // Initialize map
      map = L.map(mapContainer).setView([validLat, validLng], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Create marker
      marker = L.marker([validLat, validLng], {
        draggable: true
      }).addTo(map);

      // Handle marker drag
      marker.on('dragend', function(e) {
        const position = marker.getLatLng();
        latitude = limitCoordinatePrecision(position.lat);
        longitude = limitCoordinatePrecision(position.lng);
        onLocationChange(latitude, longitude);
      });

      // Handle map click
      map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        latitude = limitCoordinatePrecision(lat);
        longitude = limitCoordinatePrecision(lng);
        onLocationChange(latitude, longitude);
      });

      // Import and set default icon (fixes Leaflet icon issue)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    }
  });

  // Update marker position when props change
  $: if (map && marker && typeof latitude === 'number' && typeof longitude === 'number') {
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude]);
  }

  function getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = limitCoordinatePrecision(position.coords.latitude);
          const lng = limitCoordinatePrecision(position.coords.longitude);
          latitude = lat;
          longitude = lng;
          if (map && marker) {
            marker.setLatLng([lat, lng]);
            map.setView([lat, lng], 13);
          }
          onLocationChange(lat, lng);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-medium text-gray-900">Байршил сонгох</h3>
      <p class="text-sm text-gray-600">Газрын зураг дээр товшиж эсвэл marker-ийг чирж байршлаа сонгоно уу</p>
    </div>
    <button
      type="button"
      on:click={getCurrentLocation}
      class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
    >
      Одоогийн байршил
    </button>
  </div>

  <div 
    bind:this={mapContainer}
    class="w-full h-64 rounded-lg border border-gray-300"
  ></div>

  <div class="grid grid-cols-2 gap-4 text-sm">
    <div class="flex items-center space-x-2">
      <span class="text-gray-600">Өргөрөг:</span>
      <span class="font-mono text-gray-900">{typeof latitude === 'number' ? latitude.toFixed(6) : '0.000000'}</span>
    </div>
    <div class="flex items-center space-x-2">
      <span class="text-gray-600">Уртраг:</span>
      <span class="font-mono text-gray-900">{typeof longitude === 'number' ? longitude.toFixed(6) : '0.000000'}</span>
    </div>
  </div>
</div>