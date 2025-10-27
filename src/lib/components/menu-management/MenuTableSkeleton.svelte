<div class="overflow-x-auto">
	<table class="w-full text-sm text-left text-gray-500">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50">
			<tr>
				<th scope="col" class="p-4">
					<div class="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
				</th>
				<th scope="col" class="px-6 py-3">
					<div class="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
				</th>
				<th scope="col" class="px-6 py-3">
					<div class="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
				</th>
				<th scope="col" class="px-6 py-3">
					<div class="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
				</th>
				<th scope="col" class="px-6 py-3">
					<div class="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
				</th>
				<th scope="col" class="px-6 py-3">
					<div class="w-14 h-4 bg-gray-200 rounded animate-pulse"></div>
				</th>
				<th scope="col" class="px-6 py-3">
					<div class="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
				</th>
			</tr>
		</thead>
		<tbody>
			{#each Array(5) as _}
				<tr class="bg-white border-b">
					<td class="w-4 p-4">
						<div class="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
					</td>
					<th scope="row" class="px-6 py-4">
						<div class="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
					</th>
					<td class="px-6 py-4">
						<div class="w-10 h-10 bg-gray-200 rounded-md animate-pulse"></div>
					</td>
					<td class="px-6 py-4">
						<div class="flex gap-2">
							<div class="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
							<div class="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
						</div>
					</td>
					<td class="px-6 py-4">
						<div class="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
					</td>
					<td class="px-6 py-4">
						<div class="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
					</td>
					<td class="px-6 py-4">
						<div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>