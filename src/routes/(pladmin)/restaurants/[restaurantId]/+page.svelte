<script lang="ts">
  import type { PageData } from "./$types";
  import ImageGallery from "$lib/components/restaurant-detail/ImageGallery.svelte";
  import RestaurantHeader from "$lib/components/restaurant-detail/RestaurantHeader.svelte";
  import ReviewsSection from "$lib/components/restaurant-detail/ReviewsSection.svelte";
  import OpeningHours from "$lib/components/restaurant-detail/OpeningHours.svelte";
  import RestaurantInfo from "$lib/components/restaurant-detail/RestaurantInfo.svelte";
  import { Image } from "@lucide/svelte";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.restaurant.name}</title>
</svelte:head>

{#if data.restaurant}
  <div class="p-4 md:p-6">
    <!-- Restaurant Header -->
    <RestaurantHeader restaurant={data.restaurant} />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Images Gallery -->
        <section>
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-semibold mb-6 flex items-center">
              <Image class="w-6 h-6 mr-2" />
              Зургийн цуглуулга
            </h2>
            <ImageGallery images={data.restaurant.restaurant_img_urls} />
          </div>
        </section>

        <!-- Reviews Section -->
        <ReviewsSection reviews={data.restaurant.reviews} />
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Opening Hours -->
        <OpeningHours openingHours={data.restaurant.open_hours} />

        <!-- Restaurant Info -->
        <RestaurantInfo restaurant={data.restaurant} />
      </div>
    </div>
  </div>
{/if}
