<script lang="ts">
	import MenuManagementList from './MenuManagementList.svelte';
	import MenuManagementForm from './MenuManagementForm.svelte';

	let showForm = false;

	function handleAddClick() {
		showForm = true;
	}

	function handleFormClose() {
		showForm = false;
	}
</script>

<div class="p-4">
	<h2 class="text-2xl font-bold mb-4">Menu Management</h2>

	{#if showForm}
		<MenuManagementForm on:close={handleFormClose} />
	{:else}
		<div class="flex justify-end mb-4">
			<button class="btn btn-primary" on:click={handleAddClick}>Add New Item</button>
		</div>
		<MenuManagementList />
	{/if}
</div>