<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { restaurantSettingsStore } from "$lib/stores/restaurantSettingsStore";

  let name = "";
  let address = "";

  // Subscribe to store
  restaurantSettingsStore.subscribe(state => {
    name = state.formData.name || "";
    address = state.formData.address || "";
  });

  // Update store when inputs change
  function handleNameChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    name = value;
    restaurantSettingsStore.updateField('name', value);
  }

  function handleAddressChange(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value;
    address = value;
    restaurantSettingsStore.updateField('address', value);
  }
</script>

<div id="section-basic" class="scroll-mt-24">
  <div class="flex items-center mb-6">
    <div class="w-2 h-8 bg-blue-600 rounded-sm mr-3"></div>
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Үндсэн мэдээлэл</h2>
      <p class="text-sm text-gray-600 mt-1">
        Рестораны нэр, хаяг болон бусад үндсэн мэдээллийг тохируулах
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Рестораны нэр
      </label>
      <input
        type="text"
        placeholder="Рестораны нэрийг оруулна уу"
        value={name}
        on:input={handleNameChange}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
    </div>

    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Хаяг
      </label>
      <textarea
        placeholder="Рестораны дэлгэрэнгүй хаягийг оруулна уу"
        value={address}
        on:input={handleAddressChange}
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
      />
    </div>
  </div>
</div>
