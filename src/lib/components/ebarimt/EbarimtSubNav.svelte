<script lang="ts">
  import { Settings, Receipt } from "@lucide/svelte";

  export let activeTab: "config" | "receipts" = "config";
  export let showReceipts: boolean = false;
  export let onTabChange: (tab: "config" | "receipts") => void;
</script>

<div class="sticky top-20">
  <nav class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <h3 class="text-sm font-semibold text-gray-900 mb-3 px-3">
      E-barimt хэсгүүд
    </h3>
    <ul class="space-y-1">
      <li>
        <button
          type="button"
          on:click={() => onTabChange("config")}
          class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors {activeTab ===
          'config'
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-700 hover:bg-gray-50'}"
        >
          <Settings
            class="w-5 h-5 mr-3 {activeTab === 'config'
              ? 'text-indigo-600'
              : 'text-gray-400'}"
          />
          Тохиргоо
        </button>
      </li>

      {#if showReceipts}
        <li>
          <button
            type="button"
            on:click={() => onTabChange("receipts")}
            class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors {activeTab ===
            'receipts'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-50'}"
          >
            <Receipt
              class="w-5 h-5 mr-3 {activeTab === 'receipts'
                ? 'text-indigo-600'
                : 'text-gray-400'}"
            />
            Баримтын жагсаалт
          </button>
        </li>
      {/if}
    </ul>
  </nav>
</div>
