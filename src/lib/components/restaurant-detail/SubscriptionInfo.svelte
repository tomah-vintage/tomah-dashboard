<script lang="ts">
  import { CreditCard, Clock, AlertCircle, CheckCircle, XCircle } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { formatRevenue, formatDate, getSubscriptionStatusColor, getSubscriptionStatusLabel } from "$lib/utils/restaurant-detail";
  import type { AdminRestaurantDetail } from "$lib/types/restaurant";
  import type { TanStackMutation } from "$lib/types/tanstack";

  export let restaurant: AdminRestaurantDetail;
  export let onActivate: () => void;
  export let onDeactivate: () => void;
  export let activateSubscriptionMutation: TanStackMutation<any, any, any>;
  export let deactivateSubscriptionMutation: TanStackMutation<any, any, any>;
</script>

<div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-bold flex items-center text-gray-900">
      <CreditCard class="w-7 h-7 mr-3 text-gray-700" />
      Захиалгын төлөвийн мэдээлэл
    </h2>
    {#if restaurant.subscription}
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold {getSubscriptionStatusColor(restaurant.subscription.status)}">
          {getSubscriptionStatusLabel(restaurant.subscription.status)}
        </span>
        <div class="flex gap-2">
          {#if restaurant.subscription.status !== 'active'}
            <Button
              on:click={onActivate}
              disabled={$activateSubscriptionMutation.isPending}
              size="sm"
              variant="secondary"
              class="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300"
            >
              {#if $activateSubscriptionMutation.isPending}
                <div class="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              {:else}
                <CheckCircle class="w-4 h-4" />
              {/if}
              Идэвхжүүлэх
            </Button>
          {/if}
          {#if restaurant.subscription.status === 'active'}
            <Button
              on:click={onDeactivate}
              disabled={$deactivateSubscriptionMutation.isPending}
              size="sm"
              variant="secondary"
              class="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
            >
              {#if $deactivateSubscriptionMutation.isPending}
                <div class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              {:else}
                <XCircle class="w-4 h-4" />
              {/if}
              Идэвхгүй болгох
            </Button>
          {/if}
        </div>
      </div>
    {:else}
      <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
        Захиалгын төлөв байхгүй
      </span>
    {/if}
  </div>

  {#if restaurant.subscription}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Plan Details -->
      <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Төлөвлөгөөний мэдээлэл</h3>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-gray-600">Төлөвлөгөө</p>
            <p class="text-lg font-bold text-gray-900">{restaurant.subscription.plan.name}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600">Үнэ</p>
            <p class="text-2xl font-bold text-gray-900">{formatRevenue(restaurant.subscription.plan.price.toString())}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600">Давтамж</p>
            <p class="text-sm font-medium text-gray-900">{restaurant.subscription.plan.interval === 'monthly' ? 'Сар бүр' : restaurant.subscription.plan.interval}</p>
          </div>
        </div>
      </div>

      <!-- Expiry & Status -->
      <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Хугацааны мэдээлэл</h3>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-gray-600">Эхлэх огноо</p>
            <p class="text-sm font-medium text-gray-900">{formatDate(restaurant.subscription.start_date)}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600">Дуусах огноо</p>
            <p class="text-sm font-medium text-gray-900">{formatDate(restaurant.subscription.end_date)}</p>
          </div>
          <div class="flex items-center gap-2 mt-2 p-2 bg-white rounded border border-gray-200">
            {#if restaurant.subscription.is_due_soon}
              <AlertCircle class="w-5 h-5 text-yellow-600" />
              <span class="text-sm font-semibold text-yellow-700">Удахгүй дуусах</span>
            {:else if restaurant.subscription.is_expired}
              <AlertCircle class="w-5 h-5 text-red-600" />
              <span class="text-sm font-semibold text-red-700">Дууссан</span>
            {:else}
              <Clock class="w-5 h-5 text-gray-600" />
              <span class="text-sm font-semibold text-gray-700">{restaurant.subscription.days_until_expiry} өдөр үлдсэн</span>
            {/if}
          </div>
        </div>
      </div>

      <!-- Payment Summary -->
      <div class="md:col-span-2 bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">Төлбөрийн хураангуй</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white rounded border border-gray-200 p-4 text-center">
            <p class="text-xs text-gray-600 mb-1">Нийт төлөгдсөн</p>
            <p class="text-xl font-bold text-gray-900">{formatRevenue(restaurant.subscription.payment_summary.total_paid.toString())}</p>
          </div>
          <div class="bg-white rounded border border-gray-200 p-4 text-center">
            <p class="text-xs text-gray-600 mb-1">Үлдэгдэл дүн</p>
            <p class="text-xl font-bold" class:text-red-600={restaurant.subscription.payment_summary.outstanding_amount > 0} class:text-gray-900={restaurant.subscription.payment_summary.outstanding_amount === 0}>
              {formatRevenue(restaurant.subscription.payment_summary.outstanding_amount.toString())}
            </p>
          </div>
          <div class="bg-white rounded border border-gray-200 p-4 text-center">
            <p class="text-xs text-gray-600 mb-1">Хугацаа хэтэрсэн</p>
            <p class="text-xl font-bold" class:text-red-600={restaurant.subscription.payment_summary.overdue_invoices_count > 0} class:text-gray-900={restaurant.subscription.payment_summary.overdue_invoices_count === 0}>
              {restaurant.subscription.payment_summary.overdue_invoices_count}
            </p>
          </div>
        </div>
      </div>

      <!-- Latest Invoice -->
      <div class="md:col-span-2">
        {#if restaurant.subscription.latest_invoice}
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Сүүлийн нэхэмжлэх</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-600">Дугаар</p>
                <p class="text-sm font-mono font-medium text-gray-900">{restaurant.subscription.latest_invoice.invoice_number}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Дүн</p>
                <p class="text-sm font-bold text-gray-900">{formatRevenue(restaurant.subscription.latest_invoice.amount_due.toString())}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Төлбөр</p>
                <p class="text-sm font-bold text-gray-900">{formatRevenue(restaurant.subscription.latest_invoice.amount_paid.toString())}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">Статус</p>
                <p class="text-sm font-semibold" class:text-green-600={restaurant.subscription.latest_invoice.status === 'paid'} class:text-red-600={restaurant.subscription.latest_invoice.status !== 'paid'}>
                  {restaurant.subscription.latest_invoice.status === 'paid' ? 'Төлөгдсөн' : 'Төлөгдөөгүй'}
                </p>
              </div>
            </div>
          </div>
        {:else}
          <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 text-center">
            <p class="text-sm text-gray-500">Нэхэмжлэх байхгүй</p>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle class="w-16 h-16 text-gray-300 mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Захиалгын төлөвийн мэдээлэл байхгүй</h3>
      <p class="text-sm text-gray-500 max-w-md">
        Энэ рестораны захиалгын төлөвийн мэдээлэл одоогоор байхгүй байна. Системд захиалга нэмэх шаардлагатай.
      </p>
    </div>
  {/if}
</div>
