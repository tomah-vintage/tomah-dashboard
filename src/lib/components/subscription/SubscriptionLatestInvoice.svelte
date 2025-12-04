<script lang="ts">
  import { FileText } from "@lucide/svelte";
  import type { MySubscriptionResponse } from "$lib/types/restaurant";

  export let latestInvoice: MySubscriptionResponse["subscription"]["latest_invoice"];
  export let formatRevenue: (amount: number) => string;
  export let formatDate: (dateString: string) => string;
  export let getInvoiceStatusColor: (status: string) => string;
</script>

<!-- Latest Invoice (src/routes/(rsadmin)/subscription/+page.svelte:280-320) -->
{#if latestInvoice}
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-semibold mb-4 flex items-center">
      <FileText class="w-5 h-5 mr-2" />
      Сүүлийн нэхэмжлэх
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Дугаар</p>
        <p class="font-mono font-medium">
          {latestInvoice.invoice_number}
        </p>
      </div>
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Дүн</p>
        <p class="font-medium">
          {formatRevenue(latestInvoice.amount_due)}
        </p>
      </div>
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Хугацаа</p>
        <p class="font-medium">
          {formatDate(latestInvoice.due_date)}
        </p>
      </div>
      <div class="p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Статус</p>
        <p class="font-medium {getInvoiceStatusColor(latestInvoice.status)}">
          {latestInvoice.status === "paid" ? "Төлөгдсөн" : "Төлөгдөөгүй"}
        </p>
      </div>
    </div>
  </div>
{/if}
