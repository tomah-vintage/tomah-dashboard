<script lang="ts">
  import { apiFetch } from "$lib/utils/api";
  import { PUBLIC_BACKEND_URL } from "$env/static/public";
  import { createEventDispatcher } from "svelte";

  export let restaurantId: string;

  let email = "";
  let password = "";
  let errorMessage: string | null = null;
  let isLoading = false;

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    isLoading = true;
    errorMessage = null;
    try {
      const response = await apiFetch(`${PUBLIC_BACKEND_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          restaurant_id: restaurantId,
          role: 2,
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
    <label for="email" class="block text-sm font-medium text-gray-700"
      >email</label
    >
    <input
      type="text"
      id="email"
      bind:value={email}
      required
      class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
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
      class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
    />
  </div>

  {#if errorMessage}
    <p class="text-sm text-status-error">{errorMessage}</p>
  {/if}

  <button
    type="submit"
    class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50"
    disabled={isLoading}
  >
    {#if isLoading}
      Creating...
    {:else}
      Create User
    {/if}
  </button>
</form>
