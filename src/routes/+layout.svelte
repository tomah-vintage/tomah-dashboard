<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/utils/query-client';
  import '../app.css';
  import Sidebar from '../lib/components/Sidebar.svelte';
  import { page } from '$app/stores';

  const noSidebarRoutes = ['/login', '/register'];
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex">
    {#if !noSidebarRoutes.includes($page.url.pathname)}
      <Sidebar />
    {/if}
    <main class="flex-1 p-4">
      <slot />
    </main>
  </div>
</QueryClientProvider>
