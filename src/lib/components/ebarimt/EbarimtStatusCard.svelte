<script lang="ts">
  export let merchantRegistered: boolean;
  export let restaurantStatus: boolean | undefined;
  export let isCheckingStatus: boolean;
  export let onCheckStatus: () => void;
</script>

{#if merchantRegistered}
  <!-- Merchant Registered -->
  <div class="bg-green-50 border border-green-200 rounded-lg p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <svg
          class="h-5 w-5 text-green-600 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 class="text-sm font-medium text-green-800">PosAPI-д бүртгэгдсэн</h3>
          <p class="text-sm text-green-700 mt-1">
            Танай ресторан PosAPI системд амжилттай бүртгэгдлээ.
          </p>
        </div>
      </div>
      <button
        on:click={onCheckStatus}
        disabled={isCheckingStatus}
        class="ml-4 flex-shrink-0 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {#if isCheckingStatus}
          <svg
            class="animate-spin h-4 w-4 mr-2 inline"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        {/if}
        Статус шалгах
      </button>
    </div>
  </div>

  <!-- Restaurant Status -->
  {#if restaurantStatus}
    <!-- Approved -->
    <div class="bg-green-50 border-2 border-green-300 rounded-lg p-4">
      <div class="flex items-center">
        <svg
          class="h-6 w-6 text-green-600 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 class="text-base font-semibold text-green-800">
            Татварын системд зөвшөөрөгдсөн
          </h3>
          <p class="text-sm text-green-700 mt-1">
            Танай хүсэлт татварын системд зөвшөөрөгдлөө. E-barimt автоматаар үүсгэгдэнэ.
          </p>
        </div>
      </div>
    </div>
  {:else}
    <!-- Pending -->
    <div class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg
            class="h-6 w-6 text-yellow-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 class="text-base font-semibold text-yellow-800">
              Татварын системд хүлээгдэж байна
            </h3>
            <p class="text-sm text-yellow-700 mt-1">
              Хүсэлт илгээгдсэн боловч татварын системээс хараахан зөвшөөрөөгүй байна.
            </p>
          </div>
        </div>
        <button
          on:click={onCheckStatus}
          disabled={isCheckingStatus}
          class="ml-4 flex-shrink-0 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {#if isCheckingStatus}
            <svg
              class="animate-spin h-4 w-4 mr-2 inline"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          {/if}
          Дахин шалгах
        </button>
      </div>
    </div>
  {/if}
{/if}
