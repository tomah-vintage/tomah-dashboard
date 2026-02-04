<script lang="ts">
  import { page, navigating } from "$app/stores";
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
    "px-4 py-2 rounded-lg font-semibold text-sm flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed justify-start w-full relative gap-3";

  let isActive = $derived(
    href === "/" ? currentPathname === href : currentPathname.startsWith(href),
  );

  let isNavigatingTo = $derived(
    $navigating?.to?.url.pathname === href ||
      (href !== "/" && $navigating?.to?.url.pathname.startsWith(href)),
  );
</script>

<li class={className ?? "mb-2"}>
  <a
    {href}
    class="{baseClasses} {isActive
      ? 'bg-gray-100 text-blue-500'
      : isNavigatingTo
        ? 'bg-gray-50 text-blue-500 opacity-70'
        : 'text-black hover:bg-gray-50 hover:text-gray-600'}"
  >
    {#if isNavigatingTo}
      <svg
        class="w-5 h-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    {:else}
      {@render icon({ class: "w-5 h-5" })}
    {/if}
    {label}
    {#if isActive}
      <div
        class="absolute right-0 top-0 h-full w-1 bg-primary-blue rounded-full"
      ></div>
    {/if}
  </a>
</li>
