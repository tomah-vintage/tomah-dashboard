<script lang="ts">
  import { Eye, Pencil, MoreVertical } from "@lucide/svelte";
  import type { Restaurant } from "$lib/types/restaurant";
  import { onMount, onDestroy, tick } from "svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
  import { browser } from "$app/environment";

  export let restaurant: Restaurant & { register?: string; rating?: number; logo?: string };

  let openMenu = false;
  let menuButton: HTMLDivElement;
  let menuElement: HTMLDivElement;
  let opensUp = false;

  function toggleMenu() {
    openMenu = !openMenu;
    if (openMenu) {
      tick().then(() => {
        if (!menuElement || !menuButton) return;
        const menuRect = menuElement.getBoundingClientRect();
        const buttonRect = menuButton.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;

        if (spaceBelow < menuRect.height + 10) {
          opensUp = true;
        } else {
          opensUp = false;
        }
      });
    } else {
      opensUp = false;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      openMenu &&
      menuButton &&
      !menuButton.contains(event.target as Node) &&
      menuElement &&
      !menuElement.contains(event.target as Node)
    ) {
      openMenu = false;
    }
  }

  onMount(() => {
    if (browser) {
      window.addEventListener("click", handleClickOutside, true);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("click", handleClickOutside, true);
    }
  });

  function handleRowClick() {
    goto(`${base}/restaurants/${restaurant.id}`);
  }
</script>

<tr
  class="border-t hover:bg-gray-100 cursor-pointer"
  on:click={handleRowClick}
  on:keydown={(e) =>
    e.key === "Enter" && goto(`${base}/restaurants/${restaurant.id}`)}
  role="button"
  tabindex="0"
>
  <td class="p-3 font-medium">{restaurant.name}</td>
  <td class="p-3"
    ><img
      src={restaurant.logo || restaurant.logo_url}
      alt={restaurant.name}
      class="h-10 w-10 rounded-md object-cover"
    /></td
  >
  <td class="p-3 text-sm">{restaurant.email || "N/A"}</td>
  <td class="p-3">{restaurant.phone}</td>
  <td class="p-3 max-w-xs truncate" title={restaurant.address}
    >{restaurant.address}</td
  >
  <td class="p-3">
    <span
      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      class:bg-green-100={restaurant.status === "active"}
      class:text-green-800={restaurant.status === "active"}
      class:bg-red-100={restaurant.status === "inactive"}
      class:text-red-800={restaurant.status === "inactive"}
    >
      {restaurant.status === "active" ? "Идэвхтэй" : "Идэвхгүй"}
    </span>
  </td>
  <td class="p-3 text-sm text-gray-600">
    {new Date(restaurant.created_at).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
  </td>
  <td class="p-3 text-center relative">
    <div
      bind:this={menuButton}
      on:click|stopPropagation
      on:keydown={(e) => e.key === "Enter" && e.stopPropagation()}
      role="button"
      tabindex="0"
    >
      <Button on:click={toggleMenu} variant="tertiary" class="p-1 rounded-full">
        <MoreVertical class="h-5 w-5" />
      </Button>
    </div>
    {#if openMenu}
      <div
        bind:this={menuElement}
        on:click|stopPropagation
        on:keydown={(e) => e.key === "Enter" && e.stopPropagation()}
        role="menu"
        tabindex="0"
        class="absolute right-0 z-20 w-32 rounded-md border bg-white shadow-lg"
        class:top-full={!opensUp}
        class:mt-1={!opensUp}
        class:bottom-full={opensUp}
        class:mb-1={opensUp}
      >
        <a
          href="{base}/restaurants/{restaurant.id}"
          class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
        >
          <Eye class="h-4 w-4" /> Харах
        </a>
        <a
          href="{base}/restaurants/{restaurant.id}/edit"
          class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
        >
          <Pencil class="h-4 w-4" /> Засах
        </a>
      </div>
    {/if}
  </td>
</tr>
