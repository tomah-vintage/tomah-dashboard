<script lang="ts">
  export let restaurantTin: string;
  export let districtCode: string;
  export let ebarimtEnabled: boolean;
</script>

<div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
  <h2 class="text-lg font-semibold text-gray-900 mb-6">Үндсэн мэдээлэл</h2>

  <div class="space-y-6">
    <!-- Restaurant TIN -->
    <div>
      <label
        for="restaurant_tin"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Байгууллагын регистрийн дугаар
      </label>
      <input
        id="restaurant_tin"
        type="text"
        bind:value={restaurantTin}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Жишээ: 1234567"
      />
      <p class="text-xs text-gray-500 mt-1">
        Танай байгууллагын регистрийн дугаарыг энд оруулна уу.
      </p>
    </div>

    <!-- District Code -->
    <div>
      <label
        for="district_code"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Дүүргийн код
      </label>
      <input
        id="district_code"
        type="text"
        bind:value={districtCode}
        disabled={!ebarimtEnabled}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="Жишээ: 0101"
      />
      <p class="text-xs text-gray-500 mt-1">
        Танай байршиж буй дүүргийн кодыг энд оруулна уу.
      </p>
    </div>

    <!-- District Codes Reference -->
    <div class="bg-gray-50 rounded-lg p-4">
      <h3 class="text-sm font-medium text-gray-900 mb-3">
        Дүүргийн кодууд (Улаанбаатар хот)
      </h3>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="flex items-center">
          <span class="font-medium text-gray-700 w-16">0101</span>
          <span class="text-gray-600">Баянгол дүүрэг</span>
        </div>
        <div class="flex items-center">
          <span class="font-medium text-gray-700 w-16">0102</span>
          <span class="text-gray-600">Баянзүрх дүүрэг</span>
        </div>
        <div class="flex items-center">
          <span class="font-medium text-gray-700 w-16">0103</span>
          <span class="text-gray-600">Сүхбаатар дүүрэг</span>
        </div>
        <div class="flex items-center">
          <span class="font-medium text-gray-700 w-16">0104</span>
          <span class="text-gray-600">Чингэлтэй дүүрэг</span>
        </div>
        <div class="flex items-center">
          <span class="font-medium text-gray-700 w-16">0105</span>
          <span class="text-gray-600">Хан-Уул дүүрэг</span>
        </div>
        <div class="flex items-center">
          <span class="font-medium text-gray-700 w-16">0106</span>
          <span class="text-gray-600">Сонгинохайрхан дүүрэг</span>
        </div>
      </div>
    </div>
  </div>
</div>
