<div class="w-full space-y-2">
    {#each Array(8) as _}
    <div class="flex items-center space-x-4 p-4 bg-white rounded-lg shadow animate-pulse">
        <div class="h-6 w-6 bg-gray-200 rounded-md"></div>
        <div class="flex-1 h-6 bg-gray-200 rounded-md"></div>
        <div class="flex-1 h-6 bg-gray-200 rounded-md"></div>
        <div class="flex-1 h-6 bg-gray-200 rounded-md"></div>
        <div class="flex-1 h-6 bg-gray-200 rounded-md"></div>
    </div>
    {/each}
</div>