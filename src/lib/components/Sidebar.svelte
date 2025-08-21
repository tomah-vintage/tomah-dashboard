<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    LogOut,
    Users,
    ShieldCheck,
    Store,
    ChartColumnIncreasing,
    Pizza,
  } from "lucide-svelte";
  import { themeStore } from "$lib/stores/themeStore";
  import { sessionStore } from "$lib/stores/sessionStore";
  import type { Permission } from "$lib/types/auth";
  import SidebarButton from "./ui/sidebar/SidebarButton.svelte";

  const hasPermission = (permissions: Permission[]) => {
    return (
      $sessionStore.user?.permissions?.some((userPermission) =>
        permissions.includes(userPermission)
      ) ?? false
    );
  };

  const toggleDarkMode = () => {
    $themeStore = !$themeStore;
  };

  const handleLogout = async () => {
    await fetch("/logout", {
      method: "POST",
    });
    sessionStore.set({ user: null });
    goto("/login");
  };
</script>

<aside
  class="sticky top-0 flex flex-col justify-between w-64 h-screen p-4 text-white shadow-lg bg-sidebar-background rounded-e-xl"
>
  <div>
    <!-- Header/Logo Section -->
    <div class="flex items-center p-4 mb-8">
      <h2 class="text-xl font-bold text-red-500">Том Ах ресторан</h2>
    </div>

    <!-- Navigation Menu -->
    <nav>
      <ul>
        <!-- Platform Admin Links -->
        <SidebarButton href="/" label="Тайлан" icon={ChartColumnIncreasing} />
        {#if hasPermission( ["create_restaurant", "update_restaurant", "delete_restaurant"] )}
          <SidebarButton
            href="/restaurants"
            label="Рестауран"
            icon={ShieldCheck}
          />
        {/if}
        {#if hasPermission(["create_user"])}
          <SidebarButton
            href="/users"
            label="Хэрэглэгчид"
            icon={Users}
            class="mb-4"
          />
        {/if}

        <!-- Restaurant Admin Links -->
        {#if hasPermission(["create_menuitem"])}
          <SidebarButton href="/menu" label="Меню" icon={Pizza} />
        {/if}

        <SidebarButton
          href="/seating"
          label="Ширээ"
          icon={Store}
          class="mb-4"
        />
      </ul>
    </nav>
  </div>

  <!-- Bottom Section -->
  <div>
    <div class="mb-4">
      <button
        on:click={handleLogout}
        class="flex items-center w-full p-3 text-left text-black transition-colors duration-200 rounded-lg hover:bg-gray-200"
      >
        Гарах
        <LogOut class="w-5 h-5 ml-3" />
      </button>
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