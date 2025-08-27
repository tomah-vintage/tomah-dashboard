<script lang="ts">
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { apiFetch } from "$lib/utils/api";
  import { PUBLIC_BACKEND_URL } from "$env/static/public";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { X } from "lucide-svelte";
  import type { Category } from "$lib/types/category";
  import { z } from "zod";

  export let showModal: boolean;
  export let restaurantId: number;

  let categoryName: string = "";
  let categoryNameError: string = "";

  $: hasError = categoryNameError.length > 0;

  const categorySchema = z.object({
    name: z
      .string()
      .min(1, "Ангиллын нэр хоосон байж болохгүй.")
      .max(50, "Ангиллын нэр 50 тэмдэгтээс хэтрэх боломжгүй."),
  });

  const queryClient = useQueryClient();

  const addCategoryMutation = createMutation<
    Category,
    Error,
    { name: string; restaurant: number }
  >({
    mutationFn: (newCategory) =>
      apiFetch<Category>(`${PUBLIC_BACKEND_URL}/api/item-category/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showModal = false;
      resetForm();
    },
    onError: () => {
      categoryNameError = "Ангилал нэмэхэд алдаа гарлаа. Дахин оролдоно уу.";
    },
  });

  function resetForm() {
    categoryName = "";
    categoryNameError = "";
    console.log("CategoryFormModal: Form reset");
  }

  function handleSubmit() {
    categoryNameError = "";
    categorySchema.parse({ name: categoryName.trim() });
    try {
      $addCategoryMutation.mutate({
        name: categoryName.trim(),
        restaurant: restaurantId,
      });
    } catch (_error) {
      categoryNameError = "Ангилал үүсгэхэд алдаа гарлаа.";
    }
  }

  function closeModal() {
    showModal = false;
    resetForm();
  }

  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    categoryName = target.value;
    if (categoryNameError.length > 0) categoryNameError = "";
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
        <h2 id="modal-title" class="text-xl font-bold">Ангилал нэмэх</h2>
        <button
          on:click={closeModal}
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
          <Input
            label="Ангилал нэр"
            bind:value={categoryName}
            placeholder="Ангилал нэр"
            type="text"
            id="category-name"
            error={categoryNameError || undefined}
            on:input={handleInputChange}
            required
          />

          {#if hasError}
            <p class="mt-1 text-sm text-red-600" role="alert">
              {categoryNameError}
            </p>
          {/if}
        </div>

        <Button
          type="submit"
          class="w-full"
          disabled={$addCategoryMutation.isPending || !categoryName.trim()}
        >
          {#if $addCategoryMutation.isPending}
            Илгээж байна...
          {:else}
            Илгээх
          {/if}
        </Button>
      </form>
    </div>
  </div>
{/if}
