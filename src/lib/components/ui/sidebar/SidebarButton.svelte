<script lang="ts">
  import { page } from "$app/stores";
  import type { ComponentType } from "svelte";

  export let href: string;
  export let label: string;
  export let icon: ComponentType;

  $: isActive = href === "/"
    ? $page.url.pathname === href
    : $page.url.pathname.startsWith(href);
</script>

<li class={$$props.class ?? 'mb-2'}>
  <a
    {href}
    class="flex items-center p-3 rounded-lg transition-colors duration-200 relative {isActive
      ? 'text-primary-blue'
      : 'text-gray-500 hover:bg-gray-200'}"
  >
    <svelte:component this={icon} class="w-5 h-5 mr-3" />
    {label}
    {#if isActive}
      <div
        class="absolute right-0 top-0 h-full w-1 bg-primary-blue rounded-full"
      ></div>
    {/if}
  </a>
</li>
