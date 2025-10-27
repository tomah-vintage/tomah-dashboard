<script lang="ts">
	import { MoreVertical, Pencil, Trash2 } from '@lucide/svelte';
	import type { MenuItem } from '$lib/types/menu';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { createUpdateMenuItemMutation, createDeleteMenuItemMutation } from '$lib/queries/menu-queries';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';

	let { menuItems, selectedItems = $bindable(new Set()) } = $props<{ 
		menuItems: MenuItem[]; 
		selectedItems?: Set<number>;
	}>();

	let openMenuId = $state<number | null>(null);
	let showDeleteDialog = $state(false);
	let itemToDelete = $state<MenuItem | null>(null);
	
	const updateMenuItemMutation = createUpdateMenuItemMutation();
	const deleteMenuItemMutation = createDeleteMenuItemMutation();

	function toggleMenu(id: number, event: Event) {
		event.stopPropagation();
		openMenuId = openMenuId === id ? null : id;
	}

	function navigateToDetail(id: number) {
		goto(`${base}/menu/${id}`);
	}

	function editMenuItem(id: number, event: Event) {
		event.stopPropagation();
		goto(`${base}/menu/${id}`);
		openMenuId = null;
	}

	function deleteMenuItem(id: number, event: Event) {
		event.stopPropagation();
		const item = menuItems.find(item => item.id === id);
		if (item) {
			itemToDelete = item;
			showDeleteDialog = true;
		}
		openMenuId = null;
	}

	function confirmDelete() {
		if (itemToDelete) {
			$deleteMenuItemMutation.mutate(itemToDelete.id, {
				onSuccess: () => {
					showDeleteDialog = false;
					itemToDelete = null;
				},
				onError: () => {
					// Keep dialog open on error so user can retry
				}
			});
		}
	}

	function cancelDelete() {
		itemToDelete = null;
	}

	function toggleSelectItem(id: number, event: Event) {
		event.stopPropagation();
		if (selectedItems.has(id)) {
			selectedItems.delete(id);
		} else {
			selectedItems.add(id);
		}
		selectedItems = selectedItems;
	}

	// Close menu when clicking outside
	function handleClickOutside(event: Event) {
		const target = event.target as HTMLElement;
		if (!target.closest('.menu-dropdown')) {
			openMenuId = null;
		}
	}
</script>

<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" onclick={handleClickOutside} role="grid" tabindex="0">
	{#each menuItems as item (item.id)}
		<div 
			class="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
			class:ring-2={selectedItems.has(item.id)}
			class:ring-blue-500={selectedItems.has(item.id)}
			onclick={() => navigateToDetail(item.id)}
			role="gridcell"
			tabindex="0"
		>
			<!-- Image Section -->
			<div class="relative">
				{#if item.img_urls && item.img_urls.length > 0}
					<img 
						class="w-full h-32 object-cover" 
						src={item.img_urls[0]} 
						alt={item.name}
						loading="lazy"
					>
				{:else}
					<div class="w-full h-32 bg-gray-200 flex items-center justify-center">
						<span class="text-gray-400 text-sm">Зураг байхгүй</span>
					</div>
				{/if}
				
				<!-- Checkbox overlay -->
				<div class="absolute top-2 left-2">
					<Input 
						type="checkbox" 
						label="" 
						checked={selectedItems.has(item.id)}
						onchange={(e: Event) => toggleSelectItem(item.id, e)}
						class="bg-white shadow-sm"
					/>
				</div>

				<!-- Status badge -->
				<div class="absolute top-2 right-2">
					<span 
						class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
						class:bg-green-100={item.is_available} 
						class:text-green-800={item.is_available}
						class:bg-red-100={!item.is_available}
						class:text-red-800={!item.is_available}
					>
						{item.is_available ? 'Идэвхтэй' : 'Идэвхгүй'}
					</span>
				</div>
			</div>

			<!-- Content Section -->
			<div class="p-4">
				<div class="flex justify-between items-start mb-2">
					<h3 class="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
						{item.name}
					</h3>
					<div class="menu-dropdown ml-2">
						<Button 
							onclick={(e: Event) => toggleMenu(item.id, e)} 
							variant="tertiary" 
							class="p-1 rounded-full hover:bg-gray-200 transition-colors"
							size="sm"
						>
							<MoreVertical class="w-4 h-4" />
						</Button>
						{#if openMenuId === item.id}
							<div class="absolute right-0 z-10 mt-1 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div class="py-1">
									<button 
										type="button" 
										class="text-gray-700 block px-3 py-2 text-sm hover:bg-gray-100 flex items-center w-full text-left transition-colors"
										onclick={(e: Event) => editMenuItem(item.id, e)}
									>
										<Pencil class="w-3 h-3 mr-2" /> Засах
									</button>
									<button 
										type="button" 
										class="text-red-700 block px-3 py-2 text-sm hover:bg-red-50 flex items-center w-full text-left transition-colors"
										onclick={(e: Event) => deleteMenuItem(item.id, e)}
									>
										<Trash2 class="w-3 h-3 mr-2" /> Устгах
									</button>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<div class="flex flex-wrap gap-1 mb-2">
					{#each item.categories.slice(0, 2) as category}
						<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
							{category}
						</span>
					{/each}
					{#if item.categories.length > 2}
						<span class="text-gray-500 text-xs">+{item.categories.length - 2}</span>
					{/if}
				</div>

				<div class="text-lg font-semibold text-gray-900">
					{item.price.toLocaleString()}₮
				</div>
			</div>
		</div>
	{/each}
</div>

<!-- Delete Confirmation Dialog -->
<ConfirmDialog
	bind:open={showDeleteDialog}
	title="Хоол устгах"
	description={itemToDelete ? `"${itemToDelete.name}" хоолыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.` : ""}
	confirmText={$deleteMenuItemMutation.isPending ? "Устгаж байна..." : "Устгах"}
	cancelText="Цуцлах"
	variant="destructive"
	loading={$deleteMenuItemMutation.isPending}
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
/>