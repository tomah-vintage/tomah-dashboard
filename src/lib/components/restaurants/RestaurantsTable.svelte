<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantsTableRow from './RestaurantsTableRow.svelte';

	export let restaurants: (Restaurant & { register?: string; rating?: number })[] = [];
	let selectAll = false;
</script>

<div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left">
        <thead class="text-gray-600 font-medium">
            <tr>
                <th class="p-3 w-12 text-center"><input type="checkbox" class="rounded" bind:checked={selectAll}></th>
                <th class="p-3">Нэр</th>
                <th class="p-3">Утас</th>
                <th class="p-3">Хаяг</th>
                <th class="p-3">Регистр</th>
                <th class="p-3">Үнэлгээ</th>
                <th class="p-3 text-center">Үйлдэл</th>
            </tr>
        </thead>
        <tbody>
            {#each restaurants as restaurant (restaurant.id)}
                <RestaurantsTableRow {restaurant} />
            {/each}
        </tbody>
    </table>
</div>