<script lang="ts">
  import { CheckCircle, XCircle, Clock, Ban, FileText } from "@lucide/svelte";
  import type { VatReceiptSummary } from "$lib/types/restaurant";

  export let summary: VatReceiptSummary | undefined = undefined;
  export let isLoading: boolean = false;
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
  {#if isLoading}
    {#each Array(5) as _}
      <div class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    {/each}
  {:else}
    <div class="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div class="p-2 bg-blue-50 rounded-lg">
        <FileText class="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">Нийт</p>
        <p class="text-2xl font-bold text-gray-900">{summary?.total ?? "—"}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div class="p-2 bg-green-50 rounded-lg">
        <CheckCircle class="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">Үүссэн</p>
        <p class="text-2xl font-bold text-green-600">{summary?.created ?? "—"}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-red-100 p-5 flex items-center gap-4">
      <div class="p-2 bg-red-50 rounded-lg">
        <XCircle class="w-5 h-5 text-red-600" />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">Алдаатай</p>
        <p class="text-2xl font-bold text-red-600">{summary?.failed ?? "—"}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-amber-100 p-5 flex items-center gap-4">
      <div class="p-2 bg-amber-50 rounded-lg">
        <Clock class="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">Хүлээгдэж байна</p>
        <p class="text-2xl font-bold text-amber-600">{summary?.pending ?? "—"}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div class="p-2 bg-gray-100 rounded-lg">
        <Ban class="w-5 h-5 text-gray-500" />
      </div>
      <div>
        <p class="text-xs text-gray-500 font-medium">Цуцлагдсан</p>
        <p class="text-2xl font-bold text-gray-500">{summary?.cancelled ?? "—"}</p>
      </div>
    </div>
  {/if}
</div>
