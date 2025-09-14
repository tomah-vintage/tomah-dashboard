<script lang="ts">
  import { Pizza, ChevronDown } from "@lucide/svelte";
  import { slide } from "svelte/transition";
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { Button } from "$lib/components/ui/button";

  let isFoodMenuOpen = $page.url.pathname.startsWith('/menu');

  $: if ($page.url.pathname.startsWith('/menu')) {
    isFoodMenuOpen = true;
  }
</script>

<li class="mb-2">
  <Button
    on:click={() => (isFoodMenuOpen = !isFoodMenuOpen)}
    variant="tertiary"
    class="justify-start w-full"
  >
    <div class="flex items-center">
      <Pizza class="w-5 h-5 mr-3" />
      <span>Хоолны цэс</span>
    </div>
    <ChevronDown
      class="w-5 h-5 transition-transform duration-200 {isFoodMenuOpen
        ? 'rotate-180'
        : ''}"
    />
  </Button>
  {#if isFoodMenuOpen}
    <ul class="pt-2 pl-8 space-y-2" transition:slide>
      <li>
        <a
          href="{base}/menu"
          class="text-sm hover:text-gray-300"
          class:text-blue-400={$page.url.pathname === '/menu'}
          class:text-gray-500={$page.url.pathname !== '/menu'}
          >Хоолны жагсаалт</a
        >
      </li>
      <li>
        <a
          href="{base}/menu/categories"
          class="text-sm hover:text-gray-300"
          class:text-blue-400={$page.url.pathname === '/menu/categories'}
          class:text-gray-500={$page.url.pathname !== '/menu/categories'}
          >Ангилал</a
        >
      </li>
      <li>
        <a
          href="{base}/menu/highlights"
          class="text-sm hover:text-gray-300"
          class:text-blue-400={$page.url.pathname === '/menu/highlights'}
          class:text-gray-500={$page.url.pathname !== '/menu/highlights'}
          >Онцлох хоол</a
        >
      </li>
    </ul>
  {/if}
</li>