<script lang="ts">
	import { Star, Eye, Pencil, MoreVertical } from 'lucide-svelte';
	import type { Restaurant } from '$lib/types/restaurant';
	import { onMount, onDestroy, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	export let restaurant: Restaurant & { register?: string; rating?: number };

	let openMenu = false;
	let menuButton: HTMLButtonElement;
	let menuElement: HTMLDivElement;

	function toggleMenu() {
		openMenu = !openMenu;
	}

	async function updateMenuPosition() {
		if (!menuButton || !menuElement) return;
		const btnRect = menuButton.getBoundingClientRect();
		menuElement.style.top = `${btnRect.bottom + window.scrollY + 2}px`;
		menuElement.style.left = `${btnRect.right + window.scrollX - menuElement.offsetWidth}px`;
	}

	$: if (openMenu) {
		tick().then(updateMenuPosition);
	}

	function handleClickOutside(event: MouseEvent) {
		if (openMenu && menuButton && !menuButton.contains(event.target as Node) && menuElement && !menuElement.contains(event.target as Node)) {
			openMenu = false;
		}
	}

	function handleRowClick(event: MouseEvent) {
		// Do not navigate if the click was on an interactive element like a button or an input.
		const target = event.target as HTMLElement;
		if (target.closest('button, input, a')) {
			return;
		}
		goto(`/restaurants/${restaurant.id}`);
	}

	onMount(() => {
		window.addEventListener('click', handleClickOutside, true);
		window.addEventListener('resize', updateMenuPosition);
	});

	onDestroy(() => {
		window.removeEventListener('click', handleClickOutside, true);
		window.removeEventListener('resize', updateMenuPosition);
	});
</script>

<tr class="border-t hover:bg-gray-100 cursor-pointer" on:click={handleRowClick}>
	<td class="p-3 text-center"><Input type="checkbox" label="" on:click|stopPropagation /></td>
	<td class="p-3 font-medium">{restaurant.name}</td>
	<td class="p-3">{restaurant.phone}</td>
	<td class="p-3">{restaurant.address}</td>
	<td class="p-3">{restaurant.register || 'N/A'}</td>
	<td class="p-3">
		<div class="flex items-center gap-1">
			<Star class="h-4 w-4 text-yellow-400 fill-current" />
			<span>{restaurant.rating || 'N/A'}</span>
		</div>
	</td>
	<td class="p-3 text-center">
		<Button bind:this={menuButton} on:click|stopPropagation={toggleMenu} variant="tertiary" class="p-1 rounded-full">
			<MoreVertical class="h-5 w-5" />
		</Button>
	</td>
</tr>

{#if openMenu}
	<div bind:this={menuElement} on:click|stopPropagation class="fixed w-32 bg-white rounded-md shadow-lg z-20 border">
		<a href="/restaurants/{restaurant.id}" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
			<Eye class="h-4 w-4" /> Харах
		</a>
		<a href="/restaurants/{restaurant.id}/edit" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
			<Pencil class="h-4 w-4" /> Засах
		</a>
	</div>
{/if}