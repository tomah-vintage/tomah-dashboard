<script lang="ts">
  import { createGetMySubscriptionQuery } from "$lib/queries/restaurant-queries";
  import {
    CreditCard,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Zap,
  } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import SubscriptionStatusCard from "$lib/components/subscription/SubscriptionStatusCard.svelte";
  import SubscriptionPlanCard from "$lib/components/subscription/SubscriptionPlanCard.svelte";
  import SubscriptionPaymentCard from "$lib/components/subscription/SubscriptionPaymentCard.svelte";
  import SubscriptionLatestInvoice from "$lib/components/subscription/SubscriptionLatestInvoice.svelte";
  import SubscriptionRecentInvoices from "$lib/components/subscription/SubscriptionRecentInvoices.svelte";
  import SubscriptionCancellationAlert from "$lib/components/subscription/SubscriptionCancellationAlert.svelte";

  $: subscriptionQuery = createGetMySubscriptionQuery();
  $: ({
    data: subscriptionData,
    isLoading,
    isError,
    error,
  } = $subscriptionQuery);
  $: subscription = subscriptionData?.subscription;

  // Utility functions (src/routes/(rsadmin)/subscription/+page.svelte:27-91)
  function formatRevenue(amount: number): string {
    return new Intl.NumberFormat("mn-MN").format(amount) + "₮";
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getSubscriptionStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
      case "canceled":
        return "bg-red-100 text-red-800";
      case "trial":
        return "bg-blue-100 text-blue-800";
      case "past_due":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getSubscriptionStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case "active":
        return "Идэвхтэй";
      case "expired":
        return "Дууссан";
      case "canceled":
        return "Цуцлагдсан";
      case "trial":
        return "Туршилт";
      case "past_due":
        return "Хэтэрсэн";
      default:
        return status;
    }
  }

  function getStatusIcon(status: string) {
    switch (status.toLowerCase()) {
      case "active":
        return CheckCircle;
      case "expired":
      case "canceled":
        return XCircle;
      case "trial":
        return Zap;
      case "past_due":
        return AlertCircle;
      default:
        return Clock;
    }
  }

  function getInvoiceStatusColor(status: string): string {
    return status === "paid" ? "text-green-600" : "text-red-600";
  }
</script>

<svelte:head>
  <title>Захиалгын төлөв | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section (src/routes/(rsadmin)/subscription/+page.svelte:98-113) -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <div class="flex items-center gap-3">
          <CreditCard class="w-8 h-8 text-blue-600" />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Захиалгын төлөв</h1>
            <p class="mt-1 text-sm text-gray-500">
              Таны рестораны захиалгын төлөвийн мэдээлэл
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content (src/routes/(rsadmin)/subscription/+page.svelte:115-396) -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-4xl mx-auto space-y-6">
      {#if isLoading}
        <div class="flex items-center justify-center py-12">
          <CircularLoader size="md" color="blue" />
          <span class="ml-3 text-gray-600">Ачааллаж байна...</span>
        </div>
      {:else if isError}
        <div class="bg-white rounded-lg shadow-sm p-6 text-center">
          <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600 text-lg font-medium">Алдаа гарлаа</p>
          <p class="text-gray-600">{error?.message || "Тодорхойгүй алдаа"}</p>
        </div>
      {:else if !subscription}
        <div class="bg-white rounded-lg shadow-sm p-6 text-center">
          <CreditCard class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Захиалгын төлөв олдсонгүй
          </h3>
          <p class="text-gray-600 mb-4">
            {subscriptionData?.message ||
              "Танд идэвхтэй захиалгын төлөв байхгүй байна."}
          </p>
          <Button class="bg-blue-600 hover:bg-blue-700">
            Захиалгын төлөв эхлүүлэх
          </Button>
        </div>
      {:else}
        <!-- Subscription Overview (src/routes/(rsadmin)/subscription/+page.svelte:144-278) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SubscriptionStatusCard
            {subscription}
            {getStatusIcon}
            {getSubscriptionStatusColor}
            {getSubscriptionStatusLabel}
            {formatDate}
          />

          <SubscriptionPlanCard
            {subscription}
            {formatRevenue}
            {formatDate}
          />

          <SubscriptionPaymentCard {subscription} {formatRevenue} />
        </div>

        <!-- Latest Invoice (src/routes/(rsadmin)/subscription/+page.svelte:280-320) -->
        <SubscriptionLatestInvoice
          latestInvoice={subscription.latest_invoice}
          {formatRevenue}
          {formatDate}
          {getInvoiceStatusColor}
        />

        <!-- Recent Invoices (src/routes/(rsadmin)/subscription/+page.svelte:322-377) -->
        <SubscriptionRecentInvoices
          recentInvoices={subscription.recent_invoices}
          {formatRevenue}
          {formatDate}
        />

        <!-- Cancellation Info (src/routes/(rsadmin)/subscription/+page.svelte:379-393) -->
        {#if subscription.cancel_at_period_end}
          <SubscriptionCancellationAlert
            endDate={subscription.end_date}
            {formatDate}
          />
        {/if}
      {/if}
    </div>
  </div>
</div>
