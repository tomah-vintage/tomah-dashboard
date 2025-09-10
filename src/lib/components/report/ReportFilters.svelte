<script lang="ts">
	import { ArrowRightLeft } from '@lucide/svelte';
	import { Input } from '$lib/components/ui/input';

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
        <Input type="date" label="" bind:value={startDate} />
        <ArrowRightLeft class="h-5 w-5 text-gray-500" />
        <Input type="date" label="" bind:value={endDate} />
    </div>
</div>