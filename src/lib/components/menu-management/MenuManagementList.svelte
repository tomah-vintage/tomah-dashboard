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
		<div class="card shadow-lg">
			<div class="card-body">
				<h3 class="card-title">{item.name}</h3>
				<p>{item.category}</p>
				<p>${item.price.toFixed(2)}</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary">Edit</button>
					<button class="btn btn-error">Delete</button>
				</div>
			</div>
		</div>
	{/each}
</div>