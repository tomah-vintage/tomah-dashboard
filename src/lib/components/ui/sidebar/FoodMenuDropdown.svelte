<script lang="ts">
  import { Pizza, ChevronDown } from "@lucide/svelte";
  import { slide } from "svelte/transition";
  import { page } from "$app/stores";
  import { base } from "$app/paths";

  let isFoodMenuOpen = $state($page.url.pathname.startsWith('/menu'));
  let isMenuActive = $derived($page.url.pathname.startsWith('/menu'));

  $effect(() => {
    if ($page.url.pathname.startsWith('/menu')) {
      isFoodMenuOpen = true;
    }
  });
</script>

<li class="mb-2">
  <button
    on:click={() => (isFoodMenuOpen = !isFoodMenuOpen)}
    class="px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-between space-x-2 transition-colors duration-200 w-full relative gap-3 {isMenuActive
      ? 'bg-gray-100 text-gray-800'
      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}"
  >
    <div class="flex items-center gap-3">
      <Pizza class="w-5 h-5" />
      <span>Хоолны цэс</span>
    </div>
    <ChevronDown
      class="w-5 h-5 transition-transform duration-200 {isFoodMenuOpen
        ? 'rotate-180'
        : ''}"
    />
    {#if isMenuActive}
      <div
        class="absolute right-0 top-0 h-full w-1 bg-primary-blue rounded-full"
      ></div>
    {/if}
  </button>
  {#if isFoodMenuOpen}
    <ul class="pt-2 pl-11 space-y-1" transition:slide>
      <li>
        <a
          href="{base}/menu"
          class="block py-2 px-3 text-sm rounded-md transition-colors duration-200 {$page.url.pathname === '/menu'
            ? 'text-primary-blue font-semibold bg-blue-50'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}"
          >Хоолны жагсаалт</a
        >
      </li>
      <li>
        <a
          href="{base}/menu/categories"
          class="block py-2 px-3 text-sm rounded-md transition-colors duration-200 {$page.url.pathname === '/menu/categories'
            ? 'text-primary-blue font-semibold bg-blue-50'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}"
          >Ангилал</a
        >
      </li>
      <li>
        <a
          href="{base}/menu/highlights"
          class="block py-2 px-3 text-sm rounded-md transition-colors duration-200 {$page.url.pathname === '/menu/highlights'
            ? 'text-primary-blue font-semibold bg-blue-50'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}"
          >Онцлох хоол</a
        >
      </li>
    </ul>
  {/if}
</li>