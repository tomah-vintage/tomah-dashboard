<script lang="ts">
  export let restaurantTin: string;
  export let districtCode: string;
  export let servesAlcohol: boolean = false;
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
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Жишээ: 0101"
      />
      <p class="text-xs text-gray-500 mt-1">
        Танай байршиж буй дүүргийн кодыг энд оруулна уу.
      </p>
    </div>

    <!-- City Tax -->
    <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
      <div>
        <p class="text-sm font-medium text-gray-900">Нийслэлийн татвар (2%)</p>
        <p class="text-xs text-gray-500 mt-0.5">Архи, согтууруулах ундаа зардаг бол идэвхжүүлнэ үү</p>
      </div>
      <label class="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" bind:checked={servesAlcohol} class="peer sr-only" />
        <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full"></div>
      </label>
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
