<script lang="ts">
  import { createGetRestaurantsQuery, createAddRestaurantMutation, createUpdateRestaurantMutation, createDeleteRestaurantMutation } from '$lib/queries/restaurant-queries';
  import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';

  import RestaurantManagementList from './RestaurantManagementList.svelte';
  import RestaurantManagementForm from './RestaurantManagementForm.svelte';

  let showForm = false;
  let currentRestaurant: Restaurant | null = null;

  const getRestaurants = createGetRestaurantsQuery();
  const addRestaurant = createAddRestaurantMutation();
  const updateRestaurant = createUpdateRestaurantMutation();
  const deleteRestaurant = createDeleteRestaurantMutation();

  $: ({ data: items, isLoading: loading, error } = $getRestaurants);

  function openAddForm() {
    currentRestaurant = null;
    showForm = true;
  }

  function openEditForm(restaurant: Restaurant) {
    currentRestaurant = restaurant;
    showForm = true;
  }

  async function handleFormSubmit(event: CustomEvent<RestaurantFormData>) {
    const formData = event.detail;
    if (currentRestaurant) {
      await $updateRestaurant.mutateAsync({ id: currentRestaurant.id, data: formData });
    } else {
      await $addRestaurant.mutateAsync(formData);
    }
    showForm = false;
  }

  async function handleDelete(restaurantId: string) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      await $deleteRestaurant.mutateAsync(restaurantId);
    }
  }
</script>

<div class="restaurant-management-main p-8">
	<header class="mb-8">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-4xl font-bold text-[#2C2C2C] mb-2">Restaurant Management</h1>
				<p class="text-base text-gray-600">Add, edit, and manage all restaurants in the system.</p>
			</div>
			<div class="flex space-x-4">
				<a href="/restaurants/menu" class="btn bg-white text-[#2C2C2C] border border-[#2C2C2C] rounded-lg px-6 py-3 hover:bg-gray-100 transition-colors duration-200">Menu</a>
				<button class="btn bg-[#FF6B35] text-white rounded-lg px-6 py-3 hover:bg-[#E05F2E] transition-colors duration-200" on:click={openAddForm}>Add New Restaurant</button>
			</div>
		</div>
	</header>

	<main>
		{#if error}
			<div class="alert bg-[#F44336] text-white p-4 rounded-lg">{error}</div>
		{:else}
			<RestaurantManagementList {items} {loading} on:edit={e => openEditForm(e.detail)} on:delete={e => handleDelete(e.detail)} />
		{/if}

		{#if showForm}
			<div class="modal open">
				<div class="modal-box bg-white p-8 rounded-xl shadow-lg">
					<h3 class="text-2xl font-bold text-[#2C2C2C] mb-6">{currentRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
					<RestaurantManagementForm restaurant={currentRestaurant} on:submit={handleFormSubmit} on:close={() => showForm = false} />
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-box {
		min-width: 400px;
		max-width: 90%;
	}
</style>