<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { queryClient } from "$lib/utils/query-client";
  import "../app.css";
  import Sidebar from "../lib/components/Sidebar.svelte";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  import { sessionStore } from "$lib/stores/sessionStore";
  import { Toaster } from "svelte-french-toast";

  export let data: PageData;

  // Set the store value whenever the layout data changes
  $: $sessionStore.user = data.user!;

  const noSidebarRoutes = ["/login", "/forgot-password", "/reset-password"];
</script>

<QueryClientProvider client={queryClient}>
  <Toaster />
  <div class="flex">
    {#if !noSidebarRoutes.includes($page.url.pathname)}
      <Sidebar />
    {/if}
    <main class="flex-1 bg-content-background">
      <slot />
    </main>
  </div>
</QueryClientProvider>
