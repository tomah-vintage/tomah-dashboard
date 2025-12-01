<script lang="ts">
  import { restaurantSettingsStore } from "$lib/stores/restaurantSettingsStore";

  let containerFeeDisplay = "0";

  // Subscribe to store
  restaurantSettingsStore.subscribe(state => {
    containerFeeDisplay = state.containerFeeDisplay;
  });

  // Handle container fee input
  function handleContainerFeeInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = input.value.replace(/[^\d]/g, ""); // Remove non-digits
    restaurantSettingsStore.updateContainerFee(value);
  }

  // Prevent non-numeric key presses
  function handleContainerFeeKeydown(e: KeyboardEvent) {
    const char = e.key;
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if (
      char === "Backspace" ||
      char === "Delete" ||
      char === "Tab" ||
      char === "Escape" ||
      char === "Enter" ||
      char === "ArrowLeft" ||
      char === "ArrowRight" ||
      char === "ArrowUp" ||
      char === "ArrowDown" ||
      char === "Home" ||
      char === "End"
    ) {
      return;
    }
    // Prevent if not a digit
    if (!/^\d$/.test(char)) {
      e.preventDefault();
    }
  }
</script>

<div id="section-container" class="scroll-mt-24">
  <div class="flex items-center mb-6">
    <div class="w-2 h-8 bg-indigo-600 rounded-sm mr-3"></div>
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Савлагааны төлбөр</h2>
      <p class="text-sm text-gray-600 mt-1">
        Авч явах захиалгад нэмэх савлагааны төлбөрийг тохируулах
      </p>
    </div>
  </div>

  <div class="max-w-md">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Савлагааны төлбөр
    </label>
    <div class="relative">
      <input
        type="text"
        inputmode="numeric"
        placeholder="0"
        value={containerFeeDisplay}
        on:input={handleContainerFeeInput}
        on:keydown={handleContainerFeeKeydown}
        class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <span class="text-gray-500 font-medium">₮</span>
      </div>
    </div>
    <p class="text-xs text-gray-500 mt-2">
      Авч явах захиалгад нэмэх төлбөр (₮). 0 утга оруулбал төлбөргүй байна.
    </p>

    <!-- Info box -->
    <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <svg
          class="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h4 class="text-sm font-medium text-blue-800">Мэдээлэл</h4>
          <p class="text-sm text-blue-700 mt-1">
            Энэ төлбөр нь авч явах захиалгын нийт дүнд автоматаар нэмэгдэх бөгөөд
            захиалгын жагсаалт болон тайлангуудад тусад нь харагдана.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
