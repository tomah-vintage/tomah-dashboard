<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { AlertTriangle, Home, RefreshCw } from "@lucide/svelte";

  $: status = $page.status;
  $: message = $page.error?.message || 'Алдаа гарлаа';

  function goHome() {
    window.location.href = '/';
  }

  function reload() {
    window.location.reload();
  }

  $: isNotFound = status === 404;
  $: errorTitle = isNotFound ? 'Хуудас олдсонгүй' : 'Алдаа гарлаа';
  $: errorDescription = isNotFound 
    ? 'Таны хайж буй хуудас олдсонгүй эсвэл устгагдсан байна.'
    : 'Системд алдаа гарлаа. Дахин оролдоод үзнэ үү.';
</script>

<svelte:head>
  <title>{errorTitle} | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center px-4">
  <div class="max-w-md w-full text-center">
    <div class="mb-8">
      <div class="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={48} class="text-destructive" />
      </div>
      
      <h1 class="text-6xl font-bold text-foreground mb-2">
        {status}
      </h1>
      
      <h2 class="text-2xl font-semibold text-foreground mb-4">
        {errorTitle}
      </h2>
      
      <p class="text-muted-foreground text-lg leading-relaxed">
        {errorDescription}
      </p>
      
      {#if message && message !== 'Not Found'}
        <div class="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded-md">
          <p class="text-sm text-destructive">{message}</p>
        </div>
      {/if}
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <Button on:click={goHome} class="flex items-center gap-2">
        <Home size={16} />
        Нүүр хуудас руу буцах
      </Button>
      
      {#if !isNotFound}
        <Button variant="outline" on:click={reload} class="flex items-center gap-2">
          <RefreshCw size={16} />
          Дахин оролдох
        </Button>
      {/if}
    </div>
  </div>
</div>