<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CreateUserForm from "./CreateUserForm.svelte";
  import { X } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";

  export let showModal: boolean;
  export let restaurantId: string;

  const dispatch = createEventDispatcher();

  function closeModal() {
    showModal = false;
    dispatch("close");
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleSuccess() {
    closeModal();
    dispatch("userCreated");
  }
</script>

{#if showModal}
  <div
    class="fixed inset-0 overflow-y-auto h-full w-full z-50 flex justify-center items-center"
    style="background-color: rgba(0, 0, 0, 0.5);"
    on:click|self={closeModal}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="relative p-6 sm:p-8 border w-full max-w-md sm:max-w-lg shadow-lg rounded-md bg-white mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          Шинэ ажилтан нэмэх
        </h3>
        <Button on:click={closeModal} variant="tertiary" class="p-1 rounded-full">
          <X class="h-6 w-6" />
        </Button>
      </div>
      <div class="mt-2">
        <CreateUserForm {restaurantId} on:success={handleSuccess} />
      </div>
    </div>
  </div>
{/if}

<style>
  /* Add any specific modal styles here if needed */
</style>
