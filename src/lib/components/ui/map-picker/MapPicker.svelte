<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import 'leaflet/dist/leaflet.css';
  import L from 'leaflet';

  export let latitude: number;
  export let longitude: number;

  let mapContainer: HTMLElement;
  let map: L.Map;
  let marker: L.Marker;

  onMount(() => {
    map = L.map(mapContainer).setView([latitude || 47.9186, longitude || 106.9176], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([latitude || 47.9186, longitude || 106.9176], { draggable: true }).addTo(map);

    marker.on('dragend', (event) => {
      const { lat, lng } = event.target.getLatLng();
      latitude = lat;
      longitude = lng;
      dispatch('locationselected', { latitude, longitude });
    });

    map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      marker.setLatLng([lat, lng]);
      latitude = lat.toFixed(4);
      longitude = lng.toFixed(4);
      dispatch('locationselected', { latitude, longitude });
    });
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Reactively update marker position if latitude/longitude props change
  $: if (marker && latitude && longitude) {
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude]);
  }
</script>

<div bind:this={mapContainer} class="w-full h-96 rounded-md shadow-md"></div>

<style>
  :global(.leaflet-control-attribution a) {
    color: #333;
  }
</style>
