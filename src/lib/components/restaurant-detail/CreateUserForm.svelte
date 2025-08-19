<script lang="ts">
  import { apiFetch } from "$lib/utils/api";
  import { createEventDispatcher } from "svelte";

  export let restaurantId: string;

  let username = "";
  let password = "";
  let errorMessage: string | null = null;
  let isLoading = false;

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    isLoading = true;
    errorMessage = null;
    try {
      const response = await apiFetch("/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          restaurant_id: restaurantId,
        }),
      });

      if (response.ok) {
        dispatch("success");
      } else {
        const errorData = await response.json();
        errorMessage = errorData.message || "Failed to create user";
      }
    } catch (error) {
      errorMessage = "Network error or unexpected issue";
      console.error("Error creating user:", error);
    } finally {
      isLoading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label for="username" class="block text-sm font-medium text-gray-700"
      >Username</label
    >
    <input
      type="text"
      id="username"
      bind:value={username}
      required
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
    />
  </div>
  <div>
    <label for="password" class="block text-sm font-medium text-gray-700"
      >Password</label
    >
    <input
      type="password"
      id="password"
      bind:value={password}
      required
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
    />
  </div>

  {#if errorMessage}
    <p class="text-status-error text-sm">{errorMessage}</p>
  {/if}

  <button
    type="submit"
    class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50"
    disabled={isLoading}
  >
    {#if isLoading}
      Creating...
    {:else}
      Create User
    {/if}
  </button>
</form>
