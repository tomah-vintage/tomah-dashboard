<script lang="ts">
  import { createAddRestaurantHighlightMutation, createUpdateRestaurantHighlightMutation } from "$lib/queries/menu-queries";
  import type { RestaurantHighlight, RestaurantHighlightForm } from "$lib/types/restaurant-highlight";
  import { Button } from "$lib/components/ui/button";
  import RestaurantHighlightFormFields from "./RestaurantHighlightFormFields.svelte";
  import { createEmptyHighlightForm, highlightToForm } from "$lib/utils/restaurant-highlight";
  import { X } from "@lucide/svelte";
  import { createEventDispatcher } from "svelte";

  export let showModal = false;
  export let highlight: RestaurantHighlight | null = null;
  export let defaultType: 'BADGE' | 'FEATURED' = 'BADGE';

  const dispatch = createEventDispatcher();
  const addRestaurantHighlightMutation = createAddRestaurantHighlightMutation();
  const updateRestaurantHighlightMutation = createUpdateRestaurantHighlightMutation();

  let form: RestaurantHighlightForm = createEmptyHighlightForm();

  $: isEditing = !!highlight;
  $: modalTitle = isEditing ? 'Онцлох ресторан засах' : 'Онцлох ресторан нэмэх';
  $: submitButtonText = isEditing ? 'Онцлох засах' : 'Онцлох нэмэх';

  $: if (highlight && showModal) {
    form = highlightToForm(highlight);
  } else if (showModal && !highlight) {
    // Initialize form with default type for new items
    resetForm();
  }

  function resetForm() {
    form = createEmptyHighlightForm();
    form.highlight_type = defaultType;
  }

  function closeModal() {
    showModal = false;
    resetForm();
    dispatch('close');
  }

  async function handleSubmit() {
    if (!form.name?.trim() || !form.display_name?.trim()) return;

    const submitData = {
      name: form.name.trim(),
      display_name: form.display_name.trim(),
      highlight_type: form.highlight_type,
      color: form.color,
      icon: form.icon?.trim() || undefined,
      is_active: form.is_active,
      order_index: form.order_index
    };

    if (isEditing && highlight) {
      $updateRestaurantHighlightMutation.mutate({
        id: highlight.id,
        ...submitData
      });
    } else {
      $addRestaurantHighlightMutation.mutate(submitData);
    }
  }

  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  $: if ($addRestaurantHighlightMutation.isSuccess || $updateRestaurantHighlightMutation.isSuccess) {
    closeModal();
  }
</script>

{#if showModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background-color: rgba(55, 65, 81, 0.5);"
    on:click={handleOutsideClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 id="modal-title" class="text-xl font-bold">{modalTitle}</h2>
        <button
          on:click={closeModal}
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <RestaurantHighlightFormFields bind:form {isEditing} />

        <div class="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            on:click={closeModal}
          >
            Болих
          </Button>
          <Button
            type="submit"
            disabled={!form.name?.trim() || !form.display_name?.trim() || $addRestaurantHighlightMutation.isPending || $updateRestaurantHighlightMutation.isPending}
          >
            {#if $addRestaurantHighlightMutation.isPending || $updateRestaurantHighlightMutation.isPending}
              {isEditing ? 'Засч байна...' : 'Нэмж байна...'}
            {:else}
              {submitButtonText}
            {/if}
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}