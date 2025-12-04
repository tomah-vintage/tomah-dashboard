<script lang="ts">
  import { Zap } from "@lucide/svelte";
  import type { MySubscriptionResponse } from "$lib/types/restaurant";

  export let subscription: MySubscriptionResponse["subscription"];
  export let formatRevenue: (amount: number) => string;
  export let formatDate: (dateString: string) => string;
</script>

<!-- Plan Card (src/routes/(rsadmin)/subscription/+page.svelte:192-226) -->
<div class="bg-white rounded-lg shadow-sm p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold">Төлөвлөгөө</h3>
    <Zap class="w-6 h-6 text-yellow-500" />
  </div>
  <div class="space-y-3">
    <div>
      <h4 class="font-medium text-gray-900">
        {subscription.plan.name}
      </h4>
      <p class="text-sm text-gray-600">
        {subscription.plan.description}
      </p>
    </div>
    <div class="text-2xl font-bold text-blue-600">
      {formatRevenue(subscription.plan.price)}
      <span class="text-sm font-normal text-gray-500">
        /{subscription.plan.interval === "monthly"
          ? "сар"
          : subscription.plan.interval}
      </span>
    </div>
    <div class="text-sm text-gray-600">
      <div class="flex justify-between">
        <span>Эхэлсэн:</span>
        <span>{formatDate(subscription.start_date)}</span>
      </div>
      <div class="flex justify-between mt-1">
        <span>Шинэчлэх:</span>
        <span>{formatDate(subscription.renewal_date)}</span>
      </div>
    </div>
  </div>
</div>
