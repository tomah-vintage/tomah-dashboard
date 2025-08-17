<script lang="ts">
	const menuItems = [
		{
			id: 1,
			name: 'Cheeseburger',
			category: 'Burgers',
			price: 9.99,
		},
		{
			id: 2,
			name: 'French Fries',
			category: 'Sides',
			price: 3.99,
		},
		{
			id: 3,
			name: 'Milkshake',
			category: 'Drinks',
			price: 4.99,
		},
	];
</script>

<div class="grid gap-4">
	{#each menuItems as item}
		<div class="bg-card-background rounded-lg shadow-md p-6">
				<h3 class="text-xl font-bold text-gray-800">{item.name}</h3>
				<p>{item.category}</p>
				<p>${item.price.toFixed(2)}</p>
				<div class="flex justify-end space-x-2 mt-4">
					<button class="bg-primary-blue text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors duration-200">Edit</button>
					<button class="bg-status-error text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors duration-200">Delete</button>
				</div>
		</div>
	{/each}
</div>