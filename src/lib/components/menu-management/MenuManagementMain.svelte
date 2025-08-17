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

<div class="p-6">
	<h2 class="text-2xl font-bold mb-4 text-gray-800">Menu Management</h2>

	{#if showForm}
		<MenuManagementForm on:close={handleFormClose} />
	{:else}
		<div class="flex justify-end mb-4">
			<button class="bg-primary-blue text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors duration-200" on:click={handleAddClick}>Add New Item</button>
		</div>
		<MenuManagementList />
	{/if}
</div>