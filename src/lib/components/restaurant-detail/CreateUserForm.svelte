<script lang="ts">
  import { apiFetch } from "$lib/utils/api";
  import { PUBLIC_BACKEND_URL } from "$env/static/public";
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

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
  <Input id="email" label="email" type="text" bind:value={email} required />
  <Input id="password" label="Password" type="password" bind:value={password} required />

  {#if errorMessage}
    <p class="text-sm text-status-error">{errorMessage}</p>
  {/if}

  <Button type="submit" disabled={isLoading} class="w-full">
    {#if isLoading}
      Creating...
    {:else}
      Create User
    {/if}
  </Button>
</form>