<script lang="ts">
  import type { PageData } from "./$types";
  import ImageGallery from "$lib/components/restaurant-detail/ImageGallery.svelte";
  import { MapPin, Clock, Info, Image, MessageCircle, Star } from 'lucide-svelte';

  export let data: PageData;
  console.log(data.restaurant);
</script>

<svelte:head>
  <title>{data.restaurant.name}</title>
</svelte:head>

{#if data.restaurant}
  <div class="p-4 md:p-6">
    <!-- Restaurant Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
        <img
          src={data.restaurant.logo}
          alt="{data.restaurant.name} logo"
          class="w-20 h-20 rounded-lg object-cover shadow-md"
        />
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{data.restaurant.name}</h1>
          <div class="space-y-2">
            <div class="flex items-center text-gray-600">
              <MapPin class="w-5 h-5 mr-2" />
              <span>{data.restaurant.address}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <MapPin class="w-5 h-5 mr-2" />
              <span>Координат: {data.restaurant.latitude}, {data.restaurant.longitude}</span>
            </div>
          </div>
        </div>
        <!-- Rating Section -->
        <div class="text-center">
          {#if data.restaurant.average_rating}
            <div class="bg-blue-50 px-4 py-2 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{data.restaurant.average_rating}</div>
              <div class="text-sm text-blue-600">Үнэлгээ</div>
            </div>
          {:else}
            <div class="bg-gray-100 px-4 py-2 rounded-lg">
              <div class="text-lg font-medium text-gray-500">Үнэлгээ байхгүй</div>
            </div>
          {/if}
        </div>
      </div>
    </div>

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
        <section>
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-semibold mb-6 flex items-center">
              <MessageCircle class="w-6 h-6 mr-2" />
              Сэтгэгдэл ({data.restaurant.reviews.length})
            </h2>
            {#if data.restaurant.reviews.length > 0}
              <div class="space-y-4">
                {#each data.restaurant.reviews as review}
                  <div class="border-b pb-4 last:border-b-0">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium">{review.user_name}</span>
                      <span class="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString('mn-MN')}</span>
                    </div>
                    <div class="flex items-center mb-2">
                      {#each Array(5) as _, i}
                        <Star class="w-4 h-4 {i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}" />
                      {/each}
                    </div>
                    <p class="text-gray-700">{review.comment}</p>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8 text-gray-500">
                <MessageCircle class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Сэтгэгдэл байхгүй</p>
              </div>
            {/if}
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Opening Hours -->
        <section>
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-6 flex items-center">
              <Clock class="w-6 h-6 mr-2" />
              Ажиллах цаг
            </h2>
            <div class="space-y-3">
              {#each data.restaurant.open_hours as day}
                <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span class="font-medium text-gray-700">{day.day_of_week_display}</span>
                  <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                    {day.opening_time} - {day.closing_time}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        </section>

        <!-- Restaurant Info -->
        <section>
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-6 flex items-center">
              <Info class="w-6 h-6 mr-2" />
              Ресторанги мэдээлэл
            </h2>
            <div class="space-y-3">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 mb-1">Ресторанги ID</span>
                <span class="font-mono text-sm bg-gray-50 px-2 py-1 rounded">#{data.restaurant.id}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 mb-1">Үүсгэсэн огноо</span>
                <span class="text-sm">{new Date(data.restaurant.created_at).toLocaleDateString('mn-MN')}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 mb-1">Сүүлд шинэчилсэн</span>
                <span class="text-sm">{new Date(data.restaurant.updated_at).toLocaleDateString('mn-MN')}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500 mb-1">Нийт зураг</span>
                <span class="text-sm">{data.restaurant.restaurant_img_urls.length} зураг</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
{/if}
