<script lang="ts">
  export let enabled: boolean;
</script>

<div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
  <div class="flex items-center mb-6">
    <div class="w-2 h-8 bg-indigo-600 rounded-sm mr-3"></div>
    <div>
      <h2 class="text-xl font-semibold text-gray-900">
        EBARIMT идэвхжүүлэх
      </h2>
      <p class="text-sm text-gray-600 mt-1">
        Цахим баримт үүсгэх эсэхийг сонгоно уу
      </p>
    </div>
  </div>

  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <label class="flex items-center cursor-pointer">
      <input
        type="checkbox"
        bind:checked={enabled}
        class="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
      />
      <span class="ml-3 text-sm font-medium text-gray-900">
        EBARIMT идэвхжүүлэх
      </span>
    </label>
    <p class="text-xs text-gray-600 mt-2 ml-8">
      Идэвхжүүлсэн тохиолдолд захиалга бэлтгэгдэх үед автоматаар НӨАТ-ын баримт
      үүснэ
    </p>
  </div>
</div>
