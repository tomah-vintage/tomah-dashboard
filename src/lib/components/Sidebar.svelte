<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    LogOut,
    Users,
    ShieldCheck,
    Store,
    ChartColumnIncreasing,
    LayoutDashboard,
    Settings,
    Image,
    MessageSquare,
    ShoppingCart,
    Tags,
    Star,
    CreditCard,
  } from "@lucide/svelte";

  import { sessionStore } from "$lib/stores/sessionStore";
  import SidebarButton from "./ui/sidebar/SidebarButton.svelte";
  import FoodMenuDropdown from "./ui/sidebar/FoodMenuDropdown.svelte";

  const handleLogout = async () => {
    await fetch("/logout", {
      method: "POST",
    });
    sessionStore.set({ user: null });
    goto(`${base}/login`);
  };
</script>

<aside
  class="sticky top-0 flex flex-col justify-between w-64 h-screen p-4 shadow-lg bg-sidebar-background rounded-e-xl"
>
  <div>
    <!-- Header/Logo Section -->
    <div class="flex items-center px-4 py-6 mb-6">
      {#if $sessionStore.user?.restaurant?.logo}
        <img
          src={$sessionStore.user.restaurant.logo}
          alt="{$sessionStore.user.restaurant.name} logo"
          class="w-10 h-10 rounded-lg mr-3 object-cover shadow-sm"
        />
      {/if}
      <h2 class="text-lg font-bold text-gray-800">
        {$sessionStore.user?.restaurant?.name || 'Ресторан'}
      </h2>
    </div>

    <!-- Navigation Menu -->
    <nav>
      <ul>
        <SidebarButton href="/" label="Тойм дэлгэц" icon={LayoutDashboard} />
        <!-- Platform Admin Links -->
        <SidebarButton
          href="/report"
          label="Тайлан"
          icon={ChartColumnIncreasing}
        />
        {#if $sessionStore.user?.role_name === "admin"}
          <SidebarButton
            href="/restaurants"
            label="Ресторан"
            icon={ShieldCheck}
          />
        {/if}
        {#if $sessionStore.user?.role_name === "admin"}
          <SidebarButton
            href="/users"
            label="Хэрэглэгчид"
            icon={Users}
          />
        {/if}
        {#if $sessionStore.user?.role_name === "admin"}
          <SidebarButton
            href="/default-categories"
            label="Үндсэн ангилал"
            icon={Tags}
          />
        {/if}
        {#if $sessionStore.user?.role_name === "admin"}
          <SidebarButton
            href="/restaurant-highlights"
            label="Онцлох ресторан"
            icon={Star}
          />
        {/if}
        {#if $sessionStore.user?.role_name === "admin"}
          <SidebarButton
            href="/banner-highlights"
            label="Баннер сурталчилгаа"
            icon={Image}
          />
        {/if}
        {#if $sessionStore.user?.role_name === "admin"}
          <SidebarButton
            href="/reviews"
            label="Үнэлгээ"
            icon={MessageSquare}
            class="mb-4"
          />
        {/if}

        <!-- Restaurant Admin Links -->
        {#if $sessionStore.user?.role_name === "restaurant"}
          <FoodMenuDropdown />
        {/if}

        {#if $sessionStore.user?.role_name === "restaurant"}
          <SidebarButton href="/orders" label="Захиалга" icon={ShoppingCart} />
          <SidebarButton href="/seating" label="Ширээ" icon={Store} />
          <SidebarButton href="/banners" label="Баннер" icon={Image} />
          <SidebarButton href="/staff" label="Ажилтан" icon={Users} />
          <SidebarButton href="/reviews" label="Үнэлгээ" icon={MessageSquare} />
          <SidebarButton href="/subscription" label="Төлбөр" icon={CreditCard} />
          <SidebarButton
            href="/settings"
            label="Тохиргоо"
            icon={Settings}
            class="mb-4"
          />
        {/if}
      </ul>
    </nav>
  </div>

  <!-- Bottom Section -->
  <div class="border-t border-gray-200 pt-4">
    <button
      on:click={handleLogout}
      class="px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-start gap-3 transition-colors duration-200 w-full text-red-500 hover:bg-red-50 hover:text-red-600"
    >
      <LogOut class="w-5 h-5" />
      <span>Гарах</span>
    </button>
  </div>
</aside>
