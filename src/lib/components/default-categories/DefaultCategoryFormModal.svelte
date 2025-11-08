<script lang="ts">
  import { createAddDefaultCategoryMutation, createUpdateDefaultCategoryMutation } from "$lib/queries/menu-queries";
  import type { DefaultCategory, DefaultCategoryForm } from "$lib/types/category";
  import { Button } from "$lib/components/ui/button";
  import ImageUploader from "$lib/components/new-restaurant/ImageUploader.svelte";
  import DefaultCategoryFormFields from "./DefaultCategoryFormFields.svelte";
  import { uploadImages } from "$lib/utils/menu-management";
  import { createEmptyDefaultCategoryForm, categoryToFormData } from "$lib/utils/default-category";
  import { generateEnglishName } from "$lib/utils/transliteration";
  import { X } from "@lucide/svelte";
  import { createEventDispatcher } from "svelte";
  import toast from 'svelte-french-toast';

  export let showModal = false;
  export let category: DefaultCategory | null = null;

  const dispatch = createEventDispatcher();
  const addDefaultCategoryMutation = createAddDefaultCategoryMutation();
  const updateDefaultCategoryMutation = createUpdateDefaultCategoryMutation();

  let form: DefaultCategoryForm = createEmptyDefaultCategoryForm();

  let selectedFiles: File[] = [];
  let isUploading = false;

  $: isEditing = !!category;
  $: modalTitle = isEditing ? 'Үндсэн ангилал засах' : 'Шинэ үндсэн ангилал нэмэх';
  $: submitButtonText = isEditing ? 'Ангилал засах' : 'Ангилал нэмэх';


  $: if (category && showModal) {
    form = categoryToFormData(category);
    selectedFiles = [];
  }

  function resetForm() {
    form = createEmptyDefaultCategoryForm();
    selectedFiles = [];
  }

  function closeModal() {
    showModal = false;
    resetForm();
    dispatch('close');
  }

  function handleImageSelect(event: CustomEvent) {
    selectedFiles = event.detail.files;
  }

  async function handleSubmit() {
    if (!form.mongolian_name?.trim()) return;

    try {
      isUploading = true;

      // Upload image if new file is selected
      let imageUrl = form.image_url;
      if (selectedFiles.length > 0) {
        const uploadedUrls = await uploadImages(selectedFiles);
        imageUrl = uploadedUrls[0];
      }

      const submitData = {
        name: form.name.trim() || generateEnglishName(form.mongolian_name?.trim() || ''),
        mongolian_name: form.mongolian_name?.trim() || '',
        description: form.description?.trim() || undefined,
        image_url: imageUrl || undefined
      };

      if (isEditing && category) {
        $updateDefaultCategoryMutation.mutate({
          id: category.id,
          ...submitData
        });
      } else {
        $addDefaultCategoryMutation.mutate(submitData);
      }
    } catch (error) {
      toast.error('Зураг байршуулахад алдаа гарлаа.');
      console.error('Байршуулахад алдаа гарлаа:', error);
    } finally {
      isUploading = false;
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
    <div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 id="modal-title" class="text-xl font-bold">{modalTitle}</h2>
        <button
          on:click={closeModal}
          class="text-gray-500 hover:text-gray-700"
          aria-label="Хаах"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <DefaultCategoryFormFields bind:form {isEditing} />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ангиллын зураг</label>
          <ImageUploader 
            on:select={handleImageSelect} 
            multiple={false}
            existingImages={form.image_url ? [form.image_url] : []}
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
            disabled={!form.mongolian_name?.trim() || $addDefaultCategoryMutation.isPending || $updateDefaultCategoryMutation.isPending || isUploading}
          >
            {#if $addDefaultCategoryMutation.isPending || $updateDefaultCategoryMutation.isPending || isUploading}
              {#if isUploading}
                Зураг байршуулж байна...
              {:else}
                Хадгалж байна...
              {/if}
            {:else}
              {submitButtonText}
            {/if}
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if}