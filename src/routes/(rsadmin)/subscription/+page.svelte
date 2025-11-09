<script lang="ts">
  import { createGetMySubscriptionQuery } from "$lib/queries/restaurant-queries";
  import {
    CreditCard,
    Calendar,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    FileText,
    Zap,
  } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";

  $: subscriptionQuery = createGetMySubscriptionQuery();
  $: ({
    data: subscriptionData,
    isLoading,
    isError,
    error,
  } = $subscriptionQuery);
  $: subscription = subscriptionData?.subscription;

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
  <!-- Header Section -->
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

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-4xl mx-auto space-y-6">
      {#if isLoading}
        <div class="flex items-center justify-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
          ></div>
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
        <!-- Subscription Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Status Card -->
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
                  <span class="font-medium"
                    >{formatDate(subscription.end_date)}</span
                  >
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

          <!-- Plan Card -->
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

          <!-- Payment Summary -->
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
                    >{formatRevenue(
                      subscription.payment_summary.total_paid,
                    )}</span
                  >
                </div>
                <div class="flex justify-between mt-1">
                  <span>Үлдэгдэл дүн:</span>
                  <span
                    class="font-medium"
                    class:text-red-600={subscription.payment_summary
                      .outstanding_amount > 0}
                    class:text-gray-600={subscription.payment_summary
                      .outstanding_amount === 0}
                  >
                    {formatRevenue(
                      subscription.payment_summary.outstanding_amount,
                    )}
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
        </div>

        <!-- Latest Invoice -->
        {#if subscription.latest_invoice}
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <FileText class="w-5 h-5 mr-2" />
              Сүүлийн нэхэмжлэх
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Дугаар</p>
                <p class="font-mono font-medium">
                  {subscription.latest_invoice.invoice_number}
                </p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Дүн</p>
                <p class="font-medium">
                  {formatRevenue(subscription.latest_invoice.amount_due)}
                </p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Хугацаа</p>
                <p class="font-medium">
                  {formatDate(subscription.latest_invoice.due_date)}
                </p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">Статус</p>
                <p
                  class="font-medium {getInvoiceStatusColor(
                    subscription.latest_invoice.status,
                  )}"
                >
                  {subscription.latest_invoice.status === "paid"
                    ? "Төлөгдсөн"
                    : "Төлөгдөөгүй"}
                </p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Recent Invoices -->
        {#if subscription.recent_invoices && subscription.recent_invoices.length > 0}
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Сүүлийн нэхэмжлэхүүд</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="border-b">
                  <tr class="text-left">
                    <th class="pb-3 text-sm font-medium text-gray-600"
                      >Дугаар</th
                    >
                    <th class="pb-3 text-sm font-medium text-gray-600">Дүн</th>
                    <th class="pb-3 text-sm font-medium text-gray-600"
                      >Хугацаа</th
                    >
                    <th class="pb-3 text-sm font-medium text-gray-600"
                      >Статус</th
                    >
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {#each subscription.recent_invoices as invoice}
                    <tr>
                      <td class="py-3 font-mono text-sm"
                        >{invoice.invoice_number}</td
                      >
                      <td class="py-3 text-sm"
                        >{formatRevenue(invoice.amount_due)}</td
                      >
                      <td class="py-3 text-sm"
                        >{formatDate(invoice.due_date)}</td
                      >
                      <td class="py-3">
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          class:bg-green-100={invoice.status === "paid"}
                          class:text-green-800={invoice.status === "paid"}
                          class:bg-red-100={invoice.status !== "paid"}
                          class:text-red-800={invoice.status !== "paid"}
                        >
                          {invoice.status === "paid"
                            ? "Төлөгдсөн"
                            : "Төлөгдөөгүй"}
                        </span>
                        {#if invoice.is_overdue}
                          <span class="ml-2 text-xs text-red-600">Хэтэрсэн</span
                          >
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}

        <!-- Cancellation Info -->
        {#if subscription.cancel_at_period_end}
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-center">
              <AlertCircle class="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h4 class="font-medium text-yellow-800">Цуцлах хүсэлт</h4>
                <p class="text-sm text-yellow-700">
                  Таны захиалгын төлөв {formatDate(subscription.end_date)}-нд
                  цуцлагдах болно.
                </p>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
