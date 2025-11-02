<script lang="ts">
  import { DollarSign, Star, Menu } from "@lucide/svelte";
  import { formatRevenue } from "$lib/utils/restaurant-detail";
  import type { AdminRestaurantDetail } from "$lib/types/restaurant";

  export let restaurant: AdminRestaurantDetail;
</script>

<div class="space-y-4">
  <!-- Total Revenue Card -->
  <div class="bg-white rounded-lg border border-gray-200 p-5">
    <div class="flex items-center justify-between mb-2">
      <p class="text-sm font-medium text-gray-600">Нийт орлого</p>
      <DollarSign class="w-6 h-6 text-gray-400" />
    </div>
    <p class="text-3xl font-bold text-gray-900">{formatRevenue(restaurant.insights.orders.total_revenue)}</p>
    <p class="text-xs text-gray-500 mt-1">{restaurant.insights.orders.total_orders} захиалга</p>
  </div>

  <!-- Rating Card -->
  <div class="bg-white rounded-lg border border-gray-200 p-5">
    <div class="flex items-center justify-between mb-2">
      <p class="text-sm font-medium text-gray-600">Дундаж үнэлгээ</p>
      <Star class="w-6 h-6 text-gray-400" />
    </div>
    <p class="text-3xl font-bold text-gray-900">{restaurant.insights.reviews.average_rating.toFixed(1)}</p>
    <p class="text-xs text-gray-500 mt-1">{restaurant.insights.reviews.total_reviews} үнэлгээ</p>
  </div>

  <!-- Menu Items Card -->
  <div class="bg-white rounded-lg border border-gray-200 p-5">
    <div class="flex items-center justify-between mb-2">
      <p class="text-sm font-medium text-gray-600">Меню зүйл</p>
      <Menu class="w-6 h-6 text-gray-400" />
    </div>
    <p class="text-3xl font-bold text-gray-900">{restaurant.insights.menu_items_count}</p>
    <p class="text-xs text-gray-500 mt-1">{restaurant.insights.tables_count} ширээ</p>
  </div>
</div>
