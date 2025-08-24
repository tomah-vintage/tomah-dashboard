<script lang="ts">
  import { page } from "$app/stores";
  import type { ComponentType } from "svelte";

  let {
    href,
    label,
    icon,
    class: className,
  } = $props<{
    href: string;
    label: string;
    icon: ComponentType;
    class?: string;
  }>();

  let currentPathname = $derived($page.url.pathname);
  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-800 hover:bg-gray-200 justify-start w-full relative";

  let isActive = $derived(
    href === "/" ? currentPathname === href : currentPathname.startsWith(href)
  );
</script>

<li class={className ?? "mb-2"}>
  <a
    {href}
    class="{baseClasses} {isActive
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
