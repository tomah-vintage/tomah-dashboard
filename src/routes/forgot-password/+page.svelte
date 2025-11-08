<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let email = '';
  let isLoading = false;

  function goBack() {
    goto(`${base}/login`);
  }

  // Handle successful form submission
  $: if (form?.success && form?.email) {
    goto(`${base}/reset-password?email=${encodeURIComponent(form.email)}`);
  }

</script>

<svelte:head>
  <title>Нууц үг сэргээх | Tomah</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-content-background font-sans">
  <div class="w-full max-w-md rounded-xl bg-card-background p-8">
    <h2 class="mb-2 text-center text-2xl font-bold text-gray-900">Нууц үг мартсан уу?</h2>
    <p class="mb-8 text-center text-sm text-gray-600">
      Бүртгэлтэй имэйл хаягаа оруулбал нууц үг сэргээх холбоос илгээх болно
    </p>
    
    <form method="POST" use:enhance={() => {
      isLoading = true;
      return async ({ result, update }) => {
        isLoading = false;
        await update();
      };
    }} class="space-y-6">
      <Input
        id="email"
        name="email"
        type="email"
        label=""
        placeholder="Имэйл хаягаа оруулна уу"
        bind:value={email}
        required
        disabled={isLoading}
      />

      {#if form?.message}
        <p class="text-sm {form?.success ? 'text-status-success' : 'text-status-error'}">
          {form.message}
        </p>
      {/if}

      <div class="space-y-4">
        <Button type="submit" class="w-full" disabled={isLoading}>
          {#if isLoading}
            Илгээж байна...
          {:else}
            Нууц үг сэргээх холбоос илгээх
          {/if}
        </Button>

        <Button 
          type="button" 
          variant="tertiary" 
          class="w-full" 
          on:click={goBack}
          disabled={isLoading}
        >
          Нэвтрэх хуудас руу буцах
        </Button>
      </div>
    </form>
  </div>
</div>