<script lang="ts">
  import { page } from "$app/stores";
  import { createGetRestaurantByIdQuery } from "$lib/queries/restaurant-queries";
  import ImageGallery from "$lib/components/restaurant-detail/ImageGallery.svelte";

  const restaurantId = $page.params.restaurantId;
  const restaurantQuery = createGetRestaurantByIdQuery(restaurantId);
</script>

<div class="p-6">
  <div class="mb-8">
    <a
      href="/restaurants"
      class="inline-flex items-center text-sm font-medium text-primary-blue hover:underline transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
      Back to Restaurants
    </a>
  </div>

  {#if $restaurantQuery.isLoading}
    <div class="flex items-center justify-center h-64">
      <p class="text-gray-500 text-xl">Loading restaurant details...</p>
    </div>
  {:else if $restaurantQuery.isError}
    <div class="flex items-center justify-center h-64">
      <p class="text-status-error text-xl">{$restaurantQuery.error.message}</p>
    </div>
  {:else if $restaurantQuery.data}
    {@const restaurant = $restaurantQuery.data}
    <div class="mb-8">
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
  {/if}
</div>
