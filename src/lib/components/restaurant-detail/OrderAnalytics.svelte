<script lang="ts">
  import { Clock, ShoppingCart, TrendingUp, DollarSign } from "@lucide/svelte";
  import { formatRevenue } from "$lib/utils/restaurant-detail";
  import type { AdminRestaurantDetail } from "$lib/types/restaurant";

  export let restaurant: AdminRestaurantDetail;
</script>

<div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
  <h2 class="text-xl font-semibold mb-4 text-gray-900">Захиалгын дэлгэрэнгүй</h2>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <Clock class="w-6 h-6 text-gray-600 mx-auto mb-2" />
      <p class="text-2xl font-bold text-gray-900">{restaurant.insights.orders.pending_orders}</p>
      <p class="text-sm text-gray-600">Хүлээгдэж буй</p>
    </div>
    <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <ShoppingCart class="w-6 h-6 text-gray-600 mx-auto mb-2" />
      <p class="text-2xl font-bold text-gray-900">{restaurant.insights.orders.completed_orders}</p>
      <p class="text-sm text-gray-600">Дууссан</p>
    </div>
    <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <TrendingUp class="w-6 h-6 text-gray-600 mx-auto mb-2" />
      <p class="text-2xl font-bold text-gray-900">{restaurant.insights.orders.cancelled_orders}</p>
      <p class="text-sm text-gray-600">Цуцлагдсан</p>
    </div>
    <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <DollarSign class="w-6 h-6 text-gray-600 mx-auto mb-2" />
      <p class="text-xl font-bold text-gray-900">{formatRevenue(restaurant.insights.orders.average_order_value)}</p>
      <p class="text-sm text-gray-600">Дундаж дүн</p>
    </div>
  </div>
</div>
