<script lang="ts">
  import { DollarSign } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import type { MySubscriptionResponse } from "$lib/types/restaurant";

  export let subscription: MySubscriptionResponse["subscription"];
  export let formatRevenue: (amount: number) => string;
</script>

<!-- Payment Summary Card (src/routes/(rsadmin)/subscription/+page.svelte:228-277) -->
<div class="bg-white rounded-lg shadow-sm p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold">Төлбөрийн хураангуй</h3>
    <DollarSign class="w-6 h-6 text-green-500" />
  </div>
  <div class="space-y-3">
    <div class="text-sm text-gray-600">
      <div class="flex justify-between">
        <span>Нийт төлөгдсөн:</span>
        <span class="font-medium text-green-600"
          >{formatRevenue(subscription.payment_summary.total_paid)}</span
        >
      </div>
      <div class="flex justify-between mt-1">
        <span>Үлдэгдэл дүн:</span>
        <span
          class="font-medium"
          class:text-red-600={subscription.payment_summary.outstanding_amount >
            0}
          class:text-gray-600={subscription.payment_summary
            .outstanding_amount === 0}
        >
          {formatRevenue(subscription.payment_summary.outstanding_amount)}
        </span>
      </div>
      <div class="flex justify-between mt-1">
        <span>Хугацаа хэтэрсэн:</span>
        <span
          class="font-medium"
          class:text-red-600={subscription.payment_summary
            .overdue_invoices_count > 0}
          class:text-gray-600={subscription.payment_summary
            .overdue_invoices_count === 0}
        >
          {subscription.payment_summary.overdue_invoices_count}
        </span>
      </div>
    </div>
    {#if subscription.payment_summary.outstanding_amount > 0}
      <Button size="sm" class="w-full bg-red-600 hover:bg-red-700">
        Төлбөр төлөх
      </Button>
    {/if}
  </div>
</div>
