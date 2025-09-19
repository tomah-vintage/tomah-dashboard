<script lang="ts">
  import { Info } from "@lucide/svelte";
  import { formatMongolianDate } from "$lib/utils/date-utils";

  export let restaurant: {
    id: string;
    created_at: string;
    updated_at: string;
    restaurant_img_urls: string[];
  };
</script>

<section>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6 flex items-center">
      <Info class="w-6 h-6 mr-2" />
      Ресторанги мэдээлэл
    </h2>
    <div class="space-y-3">
      <div class="flex flex-col">
        <span class="text-sm text-gray-500 mb-1">Ресторанги ID</span>
        <span class="font-mono text-sm bg-gray-50 px-2 py-1 rounded">
          #{restaurant.id}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500 mb-1">Үүсгэсэн огноо</span>
        <span class="text-sm">
          {formatMongolianDate(restaurant.created_at)}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500 mb-1">Сүүлд шинэчилсэн</span>
        <span class="text-sm">
          {formatMongolianDate(restaurant.updated_at)}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500 mb-1">Нийт зураг</span>
        <span class="text-sm">
          {restaurant.restaurant_img_urls.length} зураг
        </span>
      </div>
    </div>
  </div>
</section>