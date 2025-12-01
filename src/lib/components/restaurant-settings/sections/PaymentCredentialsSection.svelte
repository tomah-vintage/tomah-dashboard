<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { restaurantSettingsStore } from "$lib/stores/restaurantSettingsStore";

  let currentApiKey = "";
  let newBonumApiKey = "";
  let newBonumSecretKey = "";

  // Subscribe to store
  restaurantSettingsStore.subscribe(state => {
    currentApiKey = state.currentApiKey;
    newBonumApiKey = state.newBonumApiKey;
    newBonumSecretKey = state.newBonumSecretKey;
  });

  function handleApiKeyChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    restaurantSettingsStore.updateCredentials(value, newBonumSecretKey);
  }

  function handleSecretKeyChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    restaurantSettingsStore.updateCredentials(newBonumApiKey, value);
  }
</script>

<div id="section-payment" class="scroll-mt-24">
  <div class="flex items-center mb-6">
    <div class="w-2 h-8 bg-purple-600 rounded-sm mr-3"></div>
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Төлбөрийн тохиргоо</h2>
      <p class="text-sm text-gray-600 mt-1">
        Bonum төлбөрийн системийн нэвтрэх мэдээллийг тохируулах
      </p>
    </div>
  </div>

  <div class="space-y-6">
    <!-- Current API Key Display -->
    {#if currentApiKey}
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Одоо ашиглаж буй Terminal ID
        </label>
        <div
          class="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded border border-gray-300"
        >
          {currentApiKey}
        </div>
      </div>
    {/if}

    <!-- Warning Message -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex">
        <svg
          class="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
        <div>
          <h3 class="text-sm font-medium text-yellow-800">Анхааруулга</h3>
          <p class="text-sm text-yellow-700 mt-1">
            App Secret-г хадгалсны дараа дахин харах боломжгүй тул мэдээллийг
            аюулгүй газар хадгална уу.
          </p>
        </div>
      </div>
    </div>

    <!-- New Credentials Input -->
    <div class="grid grid-cols-1 gap-6">
      <div>
        <Input
          label="Terminal ID (API Key)"
          placeholder="Bonum-с олгосон Terminal ID-г энд оруулна уу"
          value={newBonumApiKey}
          on:input={handleApiKeyChange}
          type="text"
        />
        <p class="text-xs text-gray-500 mt-1">
          Энэ нь Bonum системээс олгосон Terminal ID байна
        </p>
      </div>

      <div>
        <Input
          label="App Secret"
          placeholder="Bonum-с олгосон App Secret-г энд оруулна уу"
          value={newBonumSecretKey}
          on:input={handleSecretKeyChange}
          type="password"
        />
        <p class="text-xs text-gray-500 mt-1">
          Энэ мэдээллийг хадгалсны дараа дахин харах боломжгүй
        </p>
      </div>
    </div>

    <!-- Information Box -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex">
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
          <h3 class="text-sm font-medium text-blue-800">Мэдээлэл</h3>
          <ul class="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
            <li>
              Terminal ID болон App Secret-г хамтад нь заавал оруулах шаардлагатай
            </li>
            <li>
              Мэдээллийг шинэчлэх үед хоёр талбарыг дахин бөглөх шаардлагатай
            </li>
            <li>
              Bonum системтэй холбоотой асуудал гарвал Bonum-н оператортой
              холбогдоно уу
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
