<script lang="ts">
	import { MoreVertical, Pencil, Trash2, ChevronUp } from 'lucide-svelte';
	import type { MenuItem } from '$lib/types/menu';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';

	let { menuItems } = $props<{ menuItems: MenuItem[] }>();

	let openMenuId = $state<number | null>(null);

	function toggleMenu(id: number) {
		openMenuId = openMenuId === id ? null : id;
	}

	function navigateToDetail(id: number) {
		goto(`/menu/${id}`);
	}
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm text-left text-gray-500">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50">
			<tr>
				<th scope="col" class="p-4">
					<div class="flex items-center">
						<Input id="checkbox-all" type="checkbox" label="" />
					</div>
				</th>
				<th scope="col" class="px-6 py-3">
					<div class="flex items-center">
						Нэр
						<button type="button"><ChevronUp class="w-3 h-3 ml-1.5" /></button>
					</div>
				</th>
				<th scope="col" class="px-6 py-3">Зураг</th>
				<th scope="col" class="px-6 py-3">Ангилал</th>
				<th scope="col" class="px-6 py-3">
                    <div class="flex items-center">
						Үнэ
						<button type="button"><ChevronUp class="w-3 h-3 ml-1.5" /></button>
					</div>
                </th>
				<th scope="col" class="px-6 py-3">Статус</th>
				<th scope="col" class="px-6 py-3">Үйлдэл</th>
			</tr>
		</thead>
		<tbody>
			{#each menuItems as item (item.id)}
				<tr class="bg-white border-b hover:bg-gray-50 cursor-pointer" onclick={() => navigateToDetail(item.id)}>
					<td class="w-4 p-4">
						<div class="flex items-center">
							<Input id="checkbox-table-{item.id}" type="checkbox" label="" />
						</div>
					</td>
					<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
						{item.name}
					</th>
					<td class="px-6 py-4">
                        {#if item.img_urls && item.img_urls.length > 0}
						    <img class="w-10 h-10 rounded-md" src={item.img_urls[0]} alt={item.name}>
                        {/if}
					</td>
					<td class="px-6 py-4">{item.categories.join(', ')}</td>
					<td class="px-6 py-4">{item.price}</td>
					<td class="px-6 py-4">
						<span class:text-status-success={item.is_available} class:text-status-error={!item.is_available}>
							{item.is_available ? 'Идэвхтэй' : 'Идэвхгүй'}
						</span>
					</td>
					<td class="px-6 py-4 relative">
						<Button on:click={() => toggleMenu(item.id)} variant="tertiary" class="p-2 rounded-full">
							<MoreVertical class="w-5 h-5" />
						</Button>
						{#if openMenuId === item.id}
							<div class="absolute right-8 z-10 mt-2 w-44 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div class="py-1">
									<button type="button" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center w-full text-left">
										<Pencil class="w-4 h-4 mr-2" /> Засах
									</button>
									<button type="button" class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center w-full text-left">
										<Trash2 class="w-4 h-4 mr-2" /> Устгах
									</button>
								</div>
							</div>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>