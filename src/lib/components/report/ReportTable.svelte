<script lang="ts">
    import type { ReportItem } from "$lib/types/report";
    import { Input } from "$lib/components/ui/input";

	export let reportData: ReportItem[] = [];
    export let selectAll = false;

	// --- Computed Totals --- //
	$: totalSalesCount = reportData.reduce((sum, item) => sum + item.salesCount, 0);
	$: totalSalesAmount = reportData.reduce((sum, item) => sum + item.salesTotal, 0);
	$: totalDiscount = reportData.reduce((sum, item) => sum + item.discount, 0);
	$: totalNetIncome = reportData.reduce((sum, item) => sum + item.netIncome, 0);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US').format(value);
	};
</script>

<div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-600 font-medium">
            <tr>
                <th class="p-3 w-12 text-center"><Input type="checkbox" label="" bind:value={selectAll} /></th>
                <th class="p-3">Огноо</th>
                <th class="p-3">Бүтээгдэхүүн</th>
                <th class="p-3">Код</th>
                <th class="p-3 text-right">Борлуулалтын тоо</th>
                <th class="p-3 text-right">Нэгж үнэ</th>
                <th class="p-3 text-right">Борлуулалтын дүн</th>
                <th class="p-3 text-right">Хөнгөлөлт</th>
                <th class="p-3 text-right">Нийт орлого</th>
            </tr>
        </thead>
        <tbody>
            {#each reportData as item (item.code + item.product)}
                <tr class="hover:bg-gray-100">
                    <td class="p-3 text-center"><Input type="checkbox" label="" /></td>
                    <td class="p-3">{item.date}</td>
                    <td class="p-3 font-medium">{item.product}</td>
                    <td class="p-3">{item.code}</td>
                    <td class="p-3 text-right">{item.salesCount}</td>
                    <td class="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td class="p-3 text-right">{formatCurrency(item.salesTotal)}</td>
                    <td class="p-3 text-right">{formatCurrency(item.discount)}</td>
                    <td class="p-3 text-right font-medium">{formatCurrency(item.netIncome)}</td>
                </tr>
            {/each}
        </tbody>
        <tfoot>
            <tr class="font-bold text-gray-900">
                <td class="p-3" colspan="4">Нийт</td>
                <td class="p-3 text-right">{totalSalesCount}</td>
                <td class="p-3"></td>
                <td class="p-3 text-right">{formatCurrency(totalSalesAmount)}</td>
                <td class="p-3 text-right">{formatCurrency(totalDiscount)}</td>
                <td class="p-3 text-right">{formatCurrency(totalNetIncome)}</td>
            </tr>
        </tfoot>
    </table>
</div>