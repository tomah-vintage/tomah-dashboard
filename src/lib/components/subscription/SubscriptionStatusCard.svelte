<script lang="ts">
  import { AlertCircle } from "@lucide/svelte";
  import type { MySubscriptionResponse } from "$lib/types/restaurant";

  export let subscription: MySubscriptionResponse["subscription"];
  export let getStatusIcon: (status: string) => any;
  export let getSubscriptionStatusColor: (status: string) => string;
  export let getSubscriptionStatusLabel: (status: string) => string;
  export let formatDate: (dateString: string) => string;
</script>

<!-- Status Card (src/routes/(rsadmin)/subscription/+page.svelte:146-190) -->
<div class="bg-white rounded-lg shadow-sm p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold">Статус</h3>
    <svelte:component
      this={getStatusIcon(subscription.status)}
      class="w-6 h-6 text-gray-400"
    />
  </div>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <span
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {getSubscriptionStatusColor(
          subscription.status,
        )}"
      >
        {getSubscriptionStatusLabel(subscription.status)}
      </span>
    </div>
    <div class="text-sm text-gray-600">
      <div class="flex justify-between">
        <span>Дуусах хугацаа:</span>
        <span class="font-medium">{formatDate(subscription.end_date)}</span>
      </div>
      <div class="flex justify-between mt-1">
        <span>Үлдсэн хоног:</span>
        <span
          class="font-medium"
          class:text-red-600={subscription.days_until_expiry <= 7}
          class:text-green-600={subscription.days_until_expiry > 7}
        >
          {subscription.days_until_expiry} өдөр
        </span>
      </div>
    </div>
    {#if subscription.is_due_soon}
      <div class="flex items-center gap-1 text-yellow-600 text-sm">
        <AlertCircle class="w-4 h-4" />
        <span>Удахгүй дуусах</span>
      </div>
    {/if}
  </div>
</div>
