<script lang="ts">
  import type { Category } from "$lib/types/category";
  import { Modal } from "$lib/components/ui/modal";
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher } from "svelte";
  import { Loader2 } from "@lucide/svelte";

  export let isLoading = false;

  let category: Category | null = null;
  let showDeleteModal = false;

  const dispatch = createEventDispatcher<{ delete: Category }>();

  export function openModal(cat: Category) {
    category = cat;
    showDeleteModal = true;
  }

  function handleDelete() {
    if (!category) return;
    dispatch("delete", category);
  }

  export function closeModal() {
    showDeleteModal = false;
    category = null;
  }
</script>

{#if category}
  <Modal isOpen={showDeleteModal} onClose={closeModal}>
    <div class="text-center">
      <h2 class="text-xl font-bold mb-4">Ангилал устгах</h2>
      {#if category.menu_item_count && category.menu_item_count > 0}
        <p>
          Энэ ангилал дотор бүтээгдэхүүнүүд байгаа тул устгах боломжгүй.
          Устгахын тулд эхлээд бүх бүтээгдэхүүнийг устгана уу.
        </p>
        <div class="mt-6 flex justify-center">
          <Button on:click={closeModal}>OK</Button>
        </div>
      {:else}
        <p>Та "{category.name}" ангиллыг устгахдаа итгэлтэй байна уу?</p>
        <div class="mt-6 flex justify-end space-x-4">
          <Button variant="secondary" on:click={closeModal} disabled={isLoading}
            >Цуцлах</Button
          >
          <Button on:click={handleDelete} disabled={isLoading}>
            {#if isLoading}
              <Loader2 class="w-4 h-4 animate-spin mr-2" />
              Устгаж байна...
            {:else}
              Устгах
            {/if}
          </Button>
        </div>
      {/if}
    </div>
  </Modal>
{/if}
