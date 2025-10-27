<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import EditUserForm from "./EditUserForm.svelte";
  import { X } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import type { RestaurantStaffUser } from "$lib/queries/restaurant-queries";

  export let showModal: boolean;
  export let user: RestaurantStaffUser | null;

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
    dispatch("userUpdated");
  }
</script>

{#if showModal && user}
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
          Ажилтангийн мэдээлэл засах
        </h3>
        <Button on:click={closeModal} variant="tertiary" class="p-1 rounded-full">
          <X class="h-6 w-6" />
        </Button>
      </div>
      <div class="mt-2">
        <EditUserForm {user} on:success={handleSuccess} />
      </div>
    </div>
  </div>
{/if}

<style>
  /* Add any specific modal styles here if needed */
</style>