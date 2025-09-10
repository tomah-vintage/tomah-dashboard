<script lang="ts">
  import { X } from "@lucide/svelte";

  export let isOpen: boolean;
  export let onClose: () => void;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
    style="background-color: rgba(0, 0, 0, 0.2);"
    on:click={onClose}
  >
    <div
      class="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      on:click|stopPropagation
    >
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        on:click={onClose}
      >
        <X class="w-6 h-6" />
      </button>
      <slot />
    </div>
  </div>
{/if}
