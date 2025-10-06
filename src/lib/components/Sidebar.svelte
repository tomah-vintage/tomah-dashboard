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
  import { Button } from "./ui/button";

  const handleLogout = async () => {
    await fetch("/logout", {
      method: "POST",
    });
    sessionStore.set({ user: null });
    goto(`${base}/login`);
  };
</script>

<aside
  class="sticky top-0 flex flex-col justify-between w-64 h-screen p-4 text-white shadow-lg bg-sidebar-background rounded-e-xl"
>
  <div>
    <!-- Header/Logo Section -->
    <div class="flex items-center p-4 mb-8">
      {#if $sessionStore.user?.restaurant?.logo}
        <img 
          src={$sessionStore.user.restaurant.logo} 
          alt="{$sessionStore.user.restaurant.name} logo"
          class="w-8 h-8 rounded-full mr-3 object-cover"
        />
      {/if}
      <h2 class="text-xl font-bold text-red-500">
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
  <div>
    <div class="mb-4">
      <Button
        on:click={handleLogout}
        variant="tertiary"
        class="justify-start w-full"
      >
        Гарах
        <LogOut class="w-5 h-5 ml-3" />
      </Button>
    </div>
    <!-- <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
      <div class="flex items-center">
        <Moon class="w-5 h-5 mr-3 text-white" />
        <span class="text-white">Dark mode</span>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          class="sr-only peer"
          on:change={toggleDarkMode}
          checked={$themeStore}
        />
        <div
          class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-blue rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"
        ></div>
      </label>
    </div> -->
  </div>
</aside>
