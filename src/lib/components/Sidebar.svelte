<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    Search,
    ChevronRight,
    Home,
    BarChart2,
    Bell,
    TrendingUp,
    Settings,
    Wallet,
    LogOut,
    Moon,
    Users,
    ShieldCheck,
    Store,
  } from "lucide-svelte";
  import { themeStore } from "$lib/stores/themeStore";
  import { sessionStore } from "$lib/stores/sessionStore";
  import type { Permission } from "$lib/types/auth";

  const hasPermission = (permission: Permission) => {
    return $sessionStore.user?.permissions?.includes(permission) ?? false;
  };

  const toggleDarkMode = () => {
    $themeStore = !$themeStore;
  };

  const handleLogout = async () => {
    await fetch("/logout", {
      method: "POST",
    });
    // Invalidate the session store on logout
    sessionStore.set({ user: null });
    goto("/login");
  };
</script>

<aside
  class="w-64 bg-sidebar-background text-white h-screen p-4 rounded-e-xl shadow-lg flex flex-col justify-between"
>
  <div>
    <!-- Header/Logo Section -->
    <div class="flex items-center p-4 mb-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-red-500 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <h2 class="text-xl font-bold text-red-500">Том Ах ресторан</h2>
    </div>

    <!-- User Profile Section -->
    {#if $sessionStore.user}
      <div class="flex items-center justify-between p-4 mb-4">
        <div class="flex items-center">
          <div
            class="w-10 h-10 bg-primary-blue text-white rounded-full flex items-center justify-center font-bold mr-3"
          >
            {$sessionStore.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="text-base font-semibold text-white">
              {$sessionStore.user.name}
            </div>
            <div class="text-sm text-white">
              {$sessionStore.user.roles.join(", ")}
            </div>
          </div>
        </div>
        <ChevronRight class="text-gray-400 w-5 h-5 cursor-pointer" />
      </div>
    {/if}

    <!-- Search Input -->
    <div class="relative mb-6">
      <input
        type="text"
        placeholder="Search..."
        class="w-full py-3 pl-10 pr-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-primary-blue"
      />
      <Search
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
      />
    </div>

    <!-- Navigation Menu -->
    <nav>
      <ul>
        <!-- Platform Admin Links -->
        <div class="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">
          Platform
        </div>
        {#if hasPermission("view-dashboard")}
          <li class="mb-2">
            <a
              href="/"
              class="flex items-center p-3 rounded-lg transition-colors duration-200 relative text-primary-blue
                {$page.url.pathname === '/'
                ? 'text-primary-blue'
                : 'text-gray-500 hover:bg-gray-700'}"
            >
              <Home class="w-5 h-5 mr-3" />
              Dashboard
              {#if $page.url.pathname === '/'}
                <div class="absolute right-0 top-0 h-full w-1 bg-primary-blue rounded-full"></div>
              {/if}
            </a>
          </li>
        {/if}
        {#if hasPermission("manage-restaurants")}
          <li class="mb-2">
            <a
              href="/restaurants"
              class="flex items-center p-3 rounded-lg transition-colors duration-200 relative text-primary-blue {$page.url.pathname.includes(
                '/restaurants'
              )
                ? 'text-primary'
                : 'text-gray-500 hover:bg-gray-700'}"
            >
              <ShieldCheck class="w-5 h-5 mr-3" />
              Restaurants
              {#if $page.url.pathname.includes('/restaurants')}
                <div class="absolute right-0 top-0 h-full w-1 bg-primary-blue rounded-full"></div>
              {/if}
            </a>
          </li>
        {/if}
        {#if hasPermission("manage-users")}
          <li class="mb-4">
            <a
              href="/users"
              class="flex items-center p-3 rounded-lg transition-colors duration-200 relative text-primary-blue {$page.url.pathname.includes(
                '/users'
              )
                ? 'text-primary-blue'
                : 'text-gray-500 hover:bg-gray-700'}"
            >
              <Users class="w-5 h-5 mr-3" />
              User Control
              {#if $page.url.pathname.includes('/users')}
                <div class="absolute right-0 top-0 h-full w-1 bg-primary-blue rounded-full"></div>
              {/if}
            </a>
          </li>
        {/if}

        <!-- Restaurant Admin Links -->
        <div
          class="px-3 text-xs font-semibold text-gray-400 uppercase mb-2 mt-4"
        >
          Restaurant
        </div>
        {#if hasPermission("edit-menus")}
          <li class="mb-2">
            <a
              href="/menu"
              class="flex items-center p-3 rounded-lg transition-colors duration-200 relative text-primary-blue {$page.url.pathname.startsWith(
                '/menu'
              )
                ? 'text-primary-blue'
                : 'text-gray-500 hover:bg-gray-700'}"
            >
              <BarChart2 class="w-5 h-5 mr-3" />
              Menu
              {#if $page.url.pathname.startsWith('/menu')}
                <div class="absolute right-0 top-0 h-full w-1 bg-primary-blue rounded-full"></div>
              {/if}
            </a>
          </li>
        {/if}
        {#if hasPermission("view-seating-charts")}
          <li class="mb-4">
            <a
              href="/seating"
              class="flex items-center p-3 rounded-lg transition-colors duration-200 relative text-primary-blue
						{$page.url.pathname.includes('/seating')
                ? 'text-primary-blue'
                : 'text-gray-500 hover:bg-gray-700'}"
            >
              <Store class="w-5 h-5 mr-3" />
              Seating
              {#if $page.url.pathname.includes('/seating')}
                <div class="absolute right-0 top-0 h-full w-1 bg-primary-blue rounded-full"></div>
              {/if}
            </a>
          </li>
        {/if}
      </ul>
    </nav>
  </div>

  <!-- Bottom Section -->
  <div>
    <div class="mb-4">
      <button
        on:click={handleLogout}
        class="flex items-center p-3 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200 w-full text-left"
      >
        <LogOut class="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
    <div class="flex items-center justify-between p-3 rounded-lg bg-gray-700">
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
    </div>
  </div>
</aside>

<style>
  /* No custom styles needed, Tailwind handles it */
</style>
