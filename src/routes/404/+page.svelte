<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Search, Home, ArrowLeft } from "@lucide/svelte";
  import { goto } from "$app/navigation";

  function goHome() {
    goto('/');
  }

  function goBack() {
    window.history.back();
  }
</script>

<svelte:head>
  <title>Хуудас олдсонгүй | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center px-4">
  <div class="max-w-lg w-full text-center">
    <div class="mb-8">
      <div class="mx-auto w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8">
        <Search size={64} class="text-primary" />
      </div>
      
      <h1 class="text-8xl font-bold text-foreground mb-4">
        404
      </h1>
      
      <h2 class="text-3xl font-semibold text-foreground mb-6">
        Хуудас олдсонгүй
      </h2>
      
      <p class="text-muted-foreground text-xl leading-relaxed mb-8">
        Таны хайж буй хуудас олдсонгүй эсвэл устгагдсан байна. 
        URL хаягийг шалгаад дахин оролдоно уу.
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <Button on:click={goHome} size="lg" class="flex items-center gap-2">
        <Home size={18} />
        Нүүр хуудас руу буцах
      </Button>
      
      <Button variant="outline" size="lg" on:click={goBack} class="flex items-center gap-2">
        <ArrowLeft size={18} />
        Буцах
      </Button>
    </div>

    <div class="mt-12 text-sm text-muted-foreground">
      <p>Хэрэв энэ алдаа байнга гарч байвал, бидэнтэй холбогдоно уу.</p>
    </div>
  </div>
</div>