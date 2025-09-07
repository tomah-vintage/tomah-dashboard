<script lang="ts">
	import { Star, Eye, Pencil, MoreVertical } from 'lucide-svelte';
	import type { Restaurant } from '$lib/types/restaurant';
	import { onMount, onDestroy, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	export let restaurant: Restaurant & { register?: string; rating?: number };
	export let selected: boolean = false;
	
	const dispatch = createEventDispatcher();

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
			window.addEventListener('click', handleClickOutside, true);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('click', handleClickOutside, true);
		}
	});

	function handleRowClick() {
		goto(`/restaurants/${restaurant.id}`);
	}
</script>

<tr
	class="border-t hover:bg-gray-100 cursor-pointer"
	on:click={handleRowClick}
	on:keydown={(e) => e.key === 'Enter' && goto(`/restaurants/${restaurant.id}`)}
	role="button"
	tabindex="0"
>
	<td class="p-3 text-center"
		><div
			on:click|stopPropagation
			on:keydown={(e) => e.key === 'Enter' && e.stopPropagation()}
			role="button"
			tabindex="0"
		>
			<Input 
				type="checkbox" 
				label="" 
				bind:value={selected}
				on:change={() => dispatch('select')}
			/>
		</div></td
	>
	<td class="p-3 font-medium">{restaurant.name}</td>
	<td class="p-3"
		><img src={restaurant.logo} alt={restaurant.name} class="h-10 w-10 rounded-md object-cover" /></td
	>
	<td class="p-3">{restaurant.phone}</td>
	<td class="p-3">{restaurant.address}</td>
	<td class="p-3">{restaurant.register || 'N/A'}</td>
	<td class="p-3">
		<div class="flex items-center gap-1">
			<Star class="h-4 w-4 text-yellow-400 fill-current" />
			<span>{restaurant.rating || 'N/A'}</span>
		</div>
	</td>
	<td class="p-3 text-center relative">
		<div
			bind:this={menuButton}
			on:click|stopPropagation
			on:keydown={(e) => e.key === 'Enter' && e.stopPropagation()}
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
				on:keydown={(e) => e.key === 'Enter' && e.stopPropagation()}
				role="menu"
				tabindex="0"
				class="absolute right-0 z-20 w-32 rounded-md border bg-white shadow-lg"
				class:top-full={!opensUp}
				class:mt-1={!opensUp}
				class:bottom-full={opensUp}
				class:mb-1={opensUp}
			>
				<a
					href="/restaurants/{restaurant.id}"
					class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
				>
					<Eye class="h-4 w-4" /> Харах
				</a>
				<a
					href="/restaurants/{restaurant.id}/edit"
					class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
				>
					<Pencil class="h-4 w-4" /> Засах
				</a>
			</div>
		{/if}
	</td>
</tr>
