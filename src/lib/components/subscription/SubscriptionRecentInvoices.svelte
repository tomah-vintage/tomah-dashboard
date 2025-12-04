<script lang="ts">
  import type { MySubscriptionResponse } from "$lib/types/restaurant";

  export let recentInvoices: MySubscriptionResponse["subscription"]["recent_invoices"];
  export let formatRevenue: (amount: number) => string;
  export let formatDate: (dateString: string) => string;
</script>

<!-- Recent Invoices (src/routes/(rsadmin)/subscription/+page.svelte:322-377) -->
{#if recentInvoices && recentInvoices.length > 0}
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-semibold mb-4">Сүүлийн нэхэмжлэхүүд</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="border-b">
          <tr class="text-left">
            <th class="pb-3 text-sm font-medium text-gray-600">Дугаар</th>
            <th class="pb-3 text-sm font-medium text-gray-600">Дүн</th>
            <th class="pb-3 text-sm font-medium text-gray-600">Хугацаа</th>
            <th class="pb-3 text-sm font-medium text-gray-600">Статус</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each recentInvoices as invoice}
            <tr>
              <td class="py-3 font-mono text-sm">{invoice.invoice_number}</td>
              <td class="py-3 text-sm">{formatRevenue(invoice.amount_due)}</td>
              <td class="py-3 text-sm">{formatDate(invoice.due_date)}</td>
              <td class="py-3">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  class:bg-green-100={invoice.status === "paid"}
                  class:text-green-800={invoice.status === "paid"}
                  class:bg-red-100={invoice.status !== "paid"}
                  class:text-red-800={invoice.status !== "paid"}
                >
                  {invoice.status === "paid" ? "Төлөгдсөн" : "Төлөгдөөгүй"}
                </span>
                {#if invoice.is_overdue}
                  <span class="ml-2 text-xs text-red-600">Хэтэрсэн</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}
