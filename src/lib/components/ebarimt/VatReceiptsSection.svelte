<script lang="ts">
	import { CheckCircle, XCircle, Clock, Ban, RefreshCw } from "@lucide/svelte";
	import type { VatReceipt, VatReceiptSummary } from "$lib/types/restaurant";

	export let receipts: VatReceipt[] = [];
	export let summary: VatReceiptSummary | undefined = undefined;
	export let isLoading: boolean = false;

	// Format date for display
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString("mn-MN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		});
	}

	// Format currency
	function formatCurrency(amount: string): string {
		return parseFloat(amount).toLocaleString() + "₮";
	}

	// Get status badge color and icon
	function getStatusInfo(status: string) {
		switch (status) {
			case "created":
				return { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Үүссэн" };
			case "failed":
				return { color: "bg-red-100 text-red-800", icon: XCircle, label: "Алдаатай" };
			case "pending":
				return { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Хүлээгдэж байна" };
			case "cancelled":
				return { color: "bg-gray-100 text-gray-800", icon: Ban, label: "Цуцлагдсан" };
			default:
				return { color: "bg-gray-100 text-gray-800", icon: Clock, label: status };
		}
	}
</script>

<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
	<!-- Header -->
	<div class="border-b border-gray-200 px-6 py-4">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-xl font-semibold text-gray-900">E-barimt мэдээлэл</h2>
				<p class="text-sm text-gray-600 mt-1">Таны үүсгэсэн баримтуудын жагсаалт</p>
			</div>
			{#if summary}
				<div class="flex items-center space-x-4 text-sm">
					<div class="text-center">
						<div class="text-2xl font-bold text-gray-900">{summary.total}</div>
						<div class="text-gray-500">Нийт</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">{summary.created}</div>
						<div class="text-gray-500">Үүссэн</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-red-600">{summary.failed}</div>
						<div class="text-gray-500">Алдаатай</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-yellow-600">{summary.pending}</div>
						<div class="text-gray-500">Хүлээгдэж байна</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Loading State -->
	{#if isLoading}
		<div class="flex justify-center items-center py-12">
			<RefreshCw class="w-8 h-8 text-indigo-600 animate-spin" />
		</div>
	{:else if receipts.length === 0}
		<!-- Empty State -->
		<div class="text-center py-12 px-6">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
				<CheckCircle class="w-8 h-8 text-gray-400" />
			</div>
			<h3 class="text-lg font-medium text-gray-900 mb-2">Баримт олдсонгүй</h3>
			<p class="text-sm text-gray-500">
				Танд одоогоор үүссэн e-barimt байхгүй байна.
			</p>
		</div>
	{:else}
		<!-- Receipts Table -->
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 border-b border-gray-200">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Захиалгын код
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Баримтын ID
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Төлөв
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Төрөл
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Дүн
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Огноо
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each receipts as receipt (receipt.id)}
						{@const statusInfo = getStatusInfo(receipt.status)}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{receipt.order_code}</div>
								<div class="text-xs text-gray-500">Order #{receipt.order_id}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">
									{receipt.receipt_id || "-"}
								</div>
								{#if receipt.bill_id}
									<div class="text-xs text-gray-500">Bill: {receipt.bill_id}</div>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {statusInfo.color}">
									<svelte:component this={statusInfo.icon} class="w-3 h-3 mr-1" />
									{statusInfo.label}
								</span>
								{#if receipt.status === "failed" && receipt.error_message}
									<div class="text-xs text-red-600 mt-1 max-w-xs truncate" title={receipt.error_message}>
										{receipt.error_message}
									</div>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="text-sm text-gray-900">{receipt.receipt_type}</span>
								{#if receipt.customer_tin}
									<div class="text-xs text-gray-500">РД: {receipt.customer_tin}</div>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{formatCurrency(receipt.order_total)}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{formatDate(receipt.created_at)}</div>
								{#if receipt.receipt_date}
									<div class="text-xs text-gray-500">Баримт: {formatDate(receipt.receipt_date)}</div>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
