<script lang="ts">
	import type { VatReceipt, VatReceiptSummary } from "$lib/types/restaurant";
	import VatReceiptsSection from "./VatReceiptsSection.svelte";

	export let receipts: VatReceipt[] = [];
	export let summary: VatReceiptSummary | undefined;
	export let isLoading: boolean = false;
</script>

<div class="space-y-6">
	<VatReceiptsSection {receipts} {summary} {isLoading} />
</div>
