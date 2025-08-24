<script lang="ts">
	import type { ReportItem } from '$lib/types/report';
	import { ReportHeader, ReportFilters, ReportTable, ReportPagination } from '$lib/components/report';

	// --- Mock Data --- //
	const reportData: ReportItem[] = [
		{ date: '07/08/2025', product: 'Үхрийн махтай пицца', code: '#223344', salesCount: 30, unitPrice: 28000, salesTotal: 840000, discount: 50000, netIncome: 790000 },
		{ date: '07/08/2025', product: 'Англи өглөөний цай', code: '#223344', salesCount: 25, unitPrice: 32000, salesTotal: 800000, discount: 0, netIncome: 800000 },
		{ date: '07/08/2025', product: 'Хонины махан рамен', code: '#223344', salesCount: 20, unitPrice: 20000, salesTotal: 400000, discount: 50000, netIncome: 350000 },
		{ date: '07/08/2025', product: 'Бяслагны цуглуулга', code: '#223344', salesCount: 36, unitPrice: 32000, salesTotal: 1152000, discount: 0, netIncome: 1152000 },
		{ date: '07/08/2025', product: 'Тахианы махтай шинэ ногоо...', code: '#223344', salesCount: 15, unitPrice: 14000, salesTotal: 210000, discount: 20000, netIncome: 190000 },
		{ date: '07/08/2025', product: 'Зутан шөл мөөгтэй', code: '#223344', salesCount: 20, unitPrice: 15000, salesTotal: 300000, discount: 0, netIncome: 300000 },
		{ date: '07/08/2025', product: 'Амталсан будаа', code: '#223344', salesCount: 20, unitPrice: 18000, salesTotal: 360000, discount: 50000, netIncome: 310000 },
	];

	// --- State --- //
	let searchQuery = '';
	let activeFilter = 'all';
	let startDate = '2025-07-05';
	let endDate = '2025-07-08';
	let selectAll = false;

</script>

<svelte:head>
	<title>Тайлан | Qpick</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-content-background min-h-screen font-sans text-gray-800">
	<div class="bg-card-background rounded-lg shadow-md p-4 sm:p-6 space-y-6">
		<ReportHeader bind:searchQuery={searchQuery} />
		<ReportFilters bind:activeFilter={activeFilter} bind:startDate={startDate} bind:endDate={endDate} />
		<ReportTable {reportData} bind:selectAll={selectAll} />
	</div>

	<ReportPagination />
</div>