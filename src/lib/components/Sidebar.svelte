<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from "$app/navigation";
	import { Search, ChevronRight, Home, BarChart2, Bell, TrendingUp, Settings, Wallet, LogOut, Moon, Users, ShieldCheck, Store } from 'lucide-svelte';
	import { themeStore } from '$lib/stores/themeStore';
	import { sessionStore } from '$lib/stores/sessionStore';
	import type { Permission } from '$lib/types/auth';

	const hasPermission = (permission: Permission) => {
		return $sessionStore.user?.permissions?.includes(permission) ?? false;
	}

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

<aside class="w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-screen p-4 rounded-e-xl shadow-lg flex flex-col justify-between">
	<div>
		<!-- User Profile Section -->
		{#if $sessionStore.user}
		<div class="flex items-center justify-between p-4 mb-4">
			<div class="flex items-center">
				<div class="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
					{$sessionStore.user.name.charAt(0).toUpperCase()}
				</div>
				<div>
					<div class="text-base font-semibold text-[#2C2C2C] dark:text-white">{$sessionStore.user.name}</div>
					<div class="text-sm text-[#2C2C2C] dark:text-white">{$sessionStore.user.roles.join(', ')}</div>
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
				class="w-full py-3 pl-10 pr-4 rounded-lg bg-[#F8F9FA] dark:bg-gray-800 text-[#2C2C2C] dark:text-white placeholder-[#2C2C2C] dark:placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
			/>
			<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
		</div>

		<!-- Navigation Menu -->
		<nav>
			<ul>
				<!-- Platform Admin Links -->
				<div class="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">Platform</div>
				{#if hasPermission('view-dashboard')}
				<li class="mb-2">
					<a href="/" class="flex items-center p-3 rounded-lg transition-colors duration-200
						{$page.url.pathname === '/' ? 'bg-[#FF6B35] text-white' : 'text-[#2C2C2C] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}">
						<Home class="w-5 h-5 mr-3" />
						Dashboard
					</a>
				</li>
				{/if}
				{#if hasPermission('manage-restaurants')}
				<li class="mb-2">
					<a href="/restaurants" class="flex items-center p-3 rounded-lg transition-colors duration-200
						{$page.url.pathname.includes('/restaurants') ? 'bg-[#FF6B35] text-white' : 'text-[#2C2C2C] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}">
						<ShieldCheck class="w-5 h-5 mr-3" />
						Restaurants
					</a>
				</li>
				{/if}
				{#if hasPermission('manage-users')}
				<li class="mb-4">
					<a href="/users" class="flex items-center p-3 rounded-lg transition-colors duration-200
						{$page.url.pathname.includes('/users') ? 'bg-[#FF6B35] text-white' : 'text-[#2C2C2C] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}">
						<Users class="w-5 h-5 mr-3" />
						User Control
					</a>
				</li>
				{/if}

				<!-- Restaurant Admin Links -->
				<div class="px-3 text-xs font-semibold text-gray-400 uppercase mb-2 mt-4">Restaurant</div>
				{#if hasPermission('edit-menus')}
				<li class="mb-2">
					<a href="/menu" class="flex items-center p-3 rounded-lg transition-colors duration-200
						{$page.url.pathname.startsWith('/menu') ? 'bg-[#FF6B35] text-white' : 'text-[#2C2C2C] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}">
						<BarChart2 class="w-5 h-5 mr-3" />
						Menu
					</a>
				</li>
				{/if}
				{#if hasPermission('view-seating-charts')}
				<li class="mb-4">
					<a href="/seating" class="flex items-center p-3 rounded-lg transition-colors duration-200
						{$page.url.pathname.includes('/seating') ? 'bg-[#FF6B35] text-white' : 'text-[#2C2C2C] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}">
						<Store class="w-5 h-5 mr-3" />
						Seating
					</a>
				</li>
				{/if}
			</ul>
		</nav>
	</div>

	<!-- Bottom Section -->
	<div>
		<div class="mb-4">
			<button on:click={handleLogout} class="flex items-center p-3 rounded-lg text-[#2C2C2C] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 w-full text-left">
				<LogOut class="w-5 h-5 mr-3" />
				Logout
			</button>
		</div>
		<div class="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA] dark:bg-gray-700">
			<div class="flex items-center">
				<Moon class="w-5 h-5 mr-3 text-[#2C2C2C] dark:text-white" />
				<span class="text-[#2C2C2C] dark:text-white">Dark mode</span>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input type="checkbox" value="" class="sr-only peer" on:change={toggleDarkMode} checked={$themeStore}>
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
			</label>
		</div>
	</div>
</aside>

<style>
	/* No custom styles needed, Tailwind handles it */
</style>