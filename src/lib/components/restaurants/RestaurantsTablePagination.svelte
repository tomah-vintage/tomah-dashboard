<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
</script>

<div class="flex items-center justify-between pt-6 text-sm">
    <div>
        <span class="font-medium">1</span> of <span class="font-medium">2</span>
    </div>
    <div class="flex items-center gap-1">
        <button class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled><ChevronLeft class="h-5 w-5" /></button>
        <button class="px-4 py-2 rounded-md bg-gray-100 font-medium">1</button>
        <button class="px-4 py-2 rounded-md hover:bg-gray-100">2</button>
        <button class="px-4 py-2 rounded-md hover:bg-gray-100">3</button>
        <button class="px-4 py-2 rounded-md hover:bg-gray-100">4</button>
        <button class="px-4 py-2 rounded-md hover:bg-gray-100">5</button>
        <button class="p-2 rounded-md hover:bg-gray-100"><ChevronRight class="h-5 w-5" /></button>
    </div>
</div>