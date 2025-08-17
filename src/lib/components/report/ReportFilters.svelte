<script lang="ts">
	import { ArrowRightLeft } from 'lucide-svelte';

	export let activeFilter: string;
	export let startDate: string;
	export let endDate: string;
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center border border-gray-200 rounded-lg p-1">
        <button class="px-4 py-1 rounded-md text-sm {activeFilter === 'all' ? 'bg-primary-blue text-white' : 'hover:bg-gray-100'}" on:click={() => activeFilter = 'all'}>Бүгд</button>
        <button class="px-4 py-1 rounded-md text-sm {activeFilter === '7d' ? 'bg-primary-blue text-white' : 'hover:bg-gray-100'}" on:click={() => activeFilter = '7d'}>7 хоног</button>
        <button class="px-4 py-1 rounded-md text-sm {activeFilter === '1m' ? 'bg-primary-blue text-white' : 'hover:bg-gray-100'}" on:click={() => activeFilter = '1m'}>1 сар</button>
        <button class="px-4 py-1 rounded-md text-sm {activeFilter === '3m' ? 'bg-primary-blue text-white' : 'hover:bg-gray-100'}" on:click={() => activeFilter = '3m'}>3 сар</button>
    </div>
    <div class="flex items-center gap-2">
        <input type="date" class="px-3 py-2 w-40 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent" bind:value={startDate}>
        <ArrowRightLeft class="h-5 w-5 text-gray-500" />
        <input type="date" class="px-3 py-2 w-40 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent" bind:value={endDate}>
    </div>
</div>