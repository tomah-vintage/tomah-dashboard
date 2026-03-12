<script lang="ts">
  import { Download, Copy, Check, Send } from "@lucide/svelte";
  import type { VatReceiptSummary, VatReceipt } from "$lib/types/restaurant";
  import { toast } from "svelte-french-toast";
  import { createSendEbarimtDataMutation } from "$lib/queries/restaurant-queries";

  export let summary: VatReceiptSummary | undefined = undefined;
  export let receipts: VatReceipt[] = [];

  const sendMutation = createSendEbarimtDataMutation();

  let copied = false;

  function buildSummaryText(): string {
    const date = new Date().toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const lines = [
      `📊 E-barimt хяналтын тайлан — ${date}`,
      "",
      `Нийт баримт:        ${summary?.total ?? 0}`,
      `✅ Үүссэн:           ${summary?.created ?? 0}`,
      `❌ Алдаатай:         ${summary?.failed ?? 0}`,
      `⏳ Хүлээгдэж байна: ${summary?.pending ?? 0}`,
      `🚫 Цуцлагдсан:      ${summary?.cancelled ?? 0}`,
    ];

    if (receipts.filter((r) => r.status === "failed").length > 0) {
      lines.push("", "— Алдаатай баримтууд —");
      receipts
        .filter((r) => r.status === "failed")
        .slice(0, 10)
        .forEach((r) => {
          lines.push(
            `  • ${r.restaurant_name} | ${r.order_code || `#${r.order_id}`} | ${parseFloat(r.order_total).toLocaleString()}₮ | ${r.error_message ?? "Алдаа"}`,
          );
        });
    }

    return lines.join("\n");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      copied = true;
      toast.success("Тайлан хуулагдлаа");
      setTimeout(() => (copied = false), 2000);
    } catch {
      toast.error("Хуулахад алдаа гарлаа");
    }
  }

  async function handleSendData() {
    try {
      await $sendMutation.mutateAsync({});
      toast.success("Өгөгдөл амжилттай илгээгдлээ");
    } catch {
      toast.error("Өгөгдөл илгээхэд алдаа гарлаа");
    }
  }

  function handleExportCSV() {
    if (receipts.length === 0) {
      toast.error("Экспортлох өгөгдөл байхгүй");
      return;
    }

    const headers = [
      "Ресторан",
      "Захиалга",
      "Баримт ID",
      "Төлөв",
      "Төрөл",
      "Дүн",
      "Алдааны мэдэгдэл",
      "Огноо",
    ];

    const rows = receipts.map((r) => [
      `"${r.restaurant_name}"`,
      `"${r.order_code || `#${r.order_id}`}"`,
      `"${r.receipt_id || ""}"`,
      `"${r.status}"`,
      `"${r.receipt_type}"`,
      `"${r.order_total}"`,
      `"${r.error_message?.replace(/"/g, "'") || ""}"`,
      `"${new Date(r.created_at).toLocaleString("mn-MN")}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ebarimt-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV татагдлаа");
  }
</script>

<div class="flex items-center gap-2">
  <button
    on:click={handleSendData}
    disabled={$sendMutation.isPending}
    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Send class="w-4 h-4" />
    {$sendMutation.isPending ? "Илгээж байна..." : "Өгөгдөл илгээх"}
  </button>

  <button
    on:click={handleCopy}
    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
  >
    {#if copied}
      <Check class="w-4 h-4 text-green-600" />
      <span class="text-green-600">Хуулагдлаа</span>
    {:else}
      <Copy class="w-4 h-4" />
      Тайлан хуулах
    {/if}
  </button>

  <button
    on:click={handleExportCSV}
    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
  >
    <Download class="w-4 h-4" />
    CSV татах
  </button>
</div>
