<script lang="ts">
  import type { PageData } from "./$types";
  import type { Restaurant } from "$lib/types/restaurant";
  import ImageGallery from "$lib/components/restaurant-detail/ImageGallery.svelte";
  import { ArrowLeft } from "lucide-svelte";
  import CreateUserModal from "$lib/components/restaurant-detail/CreateUserModal.svelte";

  export let data: PageData;
  const restaurant = data.restaurant as Restaurant;

  let showCreateUserModal = false;

  function handleUserCreated() {
    console.log("User created successfully!");
    // Optionally, refresh data or show a success message
  }
</script>

<svelte:head>
  <title>{restaurant.name} | Qpick</title>
</svelte:head>

<div class="p-6">
  <div class="mb-8 flex justify-between items-center">
    <a
      href="/restaurants"
      class="inline-flex items-center text-sm font-medium text-primary-blue hover:underline transition-colors"
    >
      <ArrowLeft class="h-5 w-5 mr-2" />
      Back to Restaurants
    </a>
    <button
      on:click={() => (showCreateUserModal = true)}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
    >
      Create User for Restaurant
    </button>
  </div>

  <div class="mb-8 flex items-center">
    <img
      src={restaurant.logo}
      alt="{restaurant.name} Logo"
      class="w-24 h-24 rounded-full mr-6 object-cover"
    />
    <div>
      <h1 class="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
      <p class="text-gray-500 mt-1">
        Created on: {new Date(restaurant.created_at).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2">
      <!-- Image Gallery -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Gallery</h2>
        <ImageGallery images={restaurant.restaurant_img_urls} />
      </section>

      <!-- Order Insights Section -->
      <section>
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          Order Insights
        </h2>
        <div
          class="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300"
        >
          <p class="text-gray-500">Order insights are not yet available.</p>
        </div>
      </section>
    </div>

    <!-- Right sidebar with location -->
    <div class="lg:col-span-1">
      <section>
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Location</h2>
        <div class="bg-card-background p-6 rounded-lg shadow-md">
          <p class="text-lg text-gray-800">{restaurant.address}</p>
          <div
            class="bg-gray-200 mt-4 h-48 rounded-md flex items-center justify-center"
          >
            <p class="text-gray-500">Map placeholder</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

<CreateUserModal
  bind:showModal={showCreateUserModal}
  restaurantId={restaurant.id}
  on:userCreated={handleUserCreated}
/>
