<script lang="ts">
  import MapView from '$lib/components/MapView.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { onMount } from 'svelte';
  import { setupPartyTownFunctions } from '$lib/utils/storage';
  
  let isLoading = true;

  onMount(() => {
      setupPartyTownFunctions();
  });
</script>
  
  <svelte:head>
    <link 
      rel="stylesheet" 
      href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    />
    <link 
      rel="stylesheet" 
      href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.css" 
    />
  </svelte:head>
  
  <main class="w-full h-screen relative">
    <MapView on:mapReady={() => isLoading = false} />
    <LoadingSpinner show={isLoading} />
</main>