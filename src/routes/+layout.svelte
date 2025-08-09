<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { queryClient } from "$lib/utils/query-client";
  import "../app.css";
  import Sidebar from "../lib/components/Sidebar.svelte";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  import { sessionStore } from "$lib/stores/sessionStore";

  export let data: PageData;

  // Set the store value whenever the layout data changes
  $: $sessionStore.user = data.user;

  const noSidebarRoutes = ["/login", "/register"];
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex">
    {#if !noSidebarRoutes.includes($page.url.pathname)}
      <Sidebar />
    {/if}
    <main class="flex-1 p-4 bg-[#F8F9FA] dark:bg-gray-900">
      <slot />
    </main>
  </div>
</QueryClientProvider>
