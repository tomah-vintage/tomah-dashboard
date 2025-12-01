<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { restaurantSettingsStore } from "$lib/stores/restaurantSettingsStore";

  export let onSave: () => void;
  export let isSaving: boolean = false;

  let hasChanges = false;

  // Subscribe to hasChanges derived store
  restaurantSettingsStore.hasChanges.subscribe(value => {
    hasChanges = value;
  });
</script>

{#if hasChanges}
  <div class="fixed bottom-6 right-6 z-[9999]">
    <div class="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
      <p class="text-sm text-gray-700 mb-3 font-medium">Өөрчлөлт хадгалаагүй</p>
      <Button
        on:click={onSave}
        disabled={isSaving}
        variant="primary"
        size="lg"
        class="w-full"
      >
        {isSaving ? "Хадгалж байна..." : "Хадгалах"}
      </Button>
    </div>
  </div>
{/if}
