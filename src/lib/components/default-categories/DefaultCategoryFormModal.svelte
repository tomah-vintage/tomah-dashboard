<script lang="ts">
  import { createAddDefaultCategoryMutation, createUpdateDefaultCategoryMutation } from "$lib/queries/menu-queries";
  import type { DefaultCategory, DefaultCategoryForm } from "$lib/types/category";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { X } from "@lucide/svelte";
  import { createEventDispatcher } from "svelte";

  export let showModal = false;
  export let category: DefaultCategory | null = null;

  const dispatch = createEventDispatcher();
  const addDefaultCategoryMutation = createAddDefaultCategoryMutation();
  const updateDefaultCategoryMutation = createUpdateDefaultCategoryMutation();

  let form: DefaultCategoryForm = {
    name: '',
    description: ''
  };

  $: isEditing = !!category;
  $: modalTitle = isEditing ? 'Үндсэн ангилал засах' : 'Үндсэн ангилал нэмэх';
  $: submitButtonText = isEditing ? 'Ангилал засах' : 'Ангилал нэмэх';

  $: if (category && showModal) {
    form = {
      name: category.name,
      description: category.description || ''
    };
  }

  function resetForm() {
    form = {
      name: '',
      description: ''
    };
  }

  function closeModal() {
    showModal = false;
    resetForm();
    dispatch('close');
  }

  function handleSubmit() {
    if (!form.name.trim()) return;

    if (isEditing && category) {
      $updateDefaultCategoryMutation.mutate({
        id: category.id,
        name: form.name.trim(),
        description: form.description?.trim() || undefined
      });
    } else {
      $addDefaultCategoryMutation.mutate({
        name: form.name.trim(),
        description: form.description?.trim() || undefined
      });
    }
  }

  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  $: if ($addDefaultCategoryMutation.isSuccess || $updateDefaultCategoryMutation.isSuccess) {
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
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
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

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="category-name" class="block text-sm font-medium text-gray-700 mb-1">Ангиллын нэр *</label>
          <Input
            id="category-name"
            type="text"
            placeholder="Ангиллын нэр оруулах"
            bind:value={form.name}
            required
          />
        </div>

        <div>
          <label for="category-description" class="block text-sm font-medium text-gray-700 mb-1">Тайлбар</label>
          <Textarea
            id="category-description"
            placeholder="Ангиллын тайлбар оруулах (заавал биш)"
            bind:value={form.description}
            rows={3}
          />
        </div>

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
            disabled={!form.name.trim() || $addDefaultCategoryMutation.isPending || $updateDefaultCategoryMutation.isPending}
          >
            {#if $addDefaultCategoryMutation.isPending || $updateDefaultCategoryMutation.isPending}
              Хадгалж байна...
            {:else}
              {submitButtonText}
            {/if}
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}