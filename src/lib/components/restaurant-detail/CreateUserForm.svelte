<script lang="ts">
  import { apiFetch } from "$lib/utils/api";
  import { PUBLIC_BACKEND_URL } from "$env/static/public";
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  export let restaurantId: string;

  let email = "";
  let first_name = "";
  let last_name = "";
  let phone = "";
  let password = "";
  let errorMessage: string | null = null;
  let isLoading = false;

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    isLoading = true;
    errorMessage = null;
    try {
      await apiFetch(`${PUBLIC_BACKEND_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          first_name,
          last_name,
          phone,
          password,
          role: 3, // restaurant role ID
          restaurant: parseInt(restaurantId), // must match admin's restaurant
        }),
      });

      dispatch("success");
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Хэрэглэгч үүсгэхэд алдаа гарлаа";
      console.error("Error creating user:", error);
    } finally {
      isLoading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Input id="first_name" label="Нэр" type="text" bind:value={first_name} required />
    <Input id="last_name" label="Овог" type="text" bind:value={last_name} required />
  </div>
  
  <Input id="email" label="И-мэйл" type="email" bind:value={email} required />
  <Input id="phone" label="Утасны дугаар" type="tel" bind:value={phone} placeholder="+976 XXXX XXXX" />
  <Input id="password" label="Нууц үг" type="password" bind:value={password} required />

  {#if errorMessage}
    <p class="text-sm text-status-error">{errorMessage}</p>
  {/if}

  <Button type="submit" disabled={isLoading} class="w-full">
    {#if isLoading}
      Үүсгэж байна...
    {:else}
      Ажилтан үүсгэх
    {/if}
  </Button>
</form>