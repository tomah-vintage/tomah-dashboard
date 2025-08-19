<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CreateUserForm from "./CreateUserForm.svelte";
  import { X } from "lucide-svelte";

  export let showModal: boolean;
  export let restaurantId: string;

  const dispatch = createEventDispatcher();

  function closeModal() {
    showModal = false;
    dispatch("close");
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
  >
    <div class="relative p-8 border w-96 shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          Create New User
        </h3>
        <button on:click={closeModal} class="text-gray-400 hover:text-gray-500">
          <X class="h-6 w-6" />
        </button>
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
