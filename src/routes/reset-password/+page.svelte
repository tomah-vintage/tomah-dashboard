<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let email = '';
  let otpCode = '';
  let newPassword = '';
  let confirmPassword = '';
  let isLoading = false;

  onMount(() => {
    email = $page.url.searchParams.get('email') || '';
    if (!email) {
      goto(`${base}/forgot-password`);
    }
  });

  function goBack() {
    goto(`${base}/forgot-password`);
  }

  // Handle form result
  $: if (form?.success) {
    goto(`${base}/login`);
  }
</script>

<svelte:head>
  <title>Нууц үг сэргээх | Tomah</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-content-background font-sans">
  <div class="w-full max-w-md rounded-xl bg-card-background p-8">
    <h2 class="mb-2 text-center text-2xl font-bold text-gray-900">Нууц үг сэргээх</h2>
    <p class="mb-8 text-center text-sm text-gray-600">
      <strong>{email}</strong> хаяг руу илгээсэн 4 оронтой кодыг оруулна уу
    </p>
    
    <form method="POST" use:enhance={() => {
      isLoading = true;
      return async ({ update }) => {
        isLoading = false;
        await update();
      };
    }} class="space-y-6">
      <input type="hidden" name="email" value={email} />
      
      <Input
        id="otp_code"
        name="otp_code"
        type="text"
        label=""
        placeholder="4 оронтой код (жишээ: 1234)"
        bind:value={otpCode}
        maxlength="4"
        required
        disabled={isLoading}
      />

      <Input
        id="new_password"
        name="new_password"
        type="password"
        label=""
        placeholder="Шинэ нууц үг"
        bind:value={newPassword}
        required
        disabled={isLoading}
      />

      <Input
        id="confirm_password"
        name="confirm_password"
        type="password"
        label=""
        placeholder="Шинэ нууц үг дахин"
        bind:value={confirmPassword}
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
            Шинэчилж байна...
          {:else}
            Нууц үг шинэчлэх
          {/if}
        </Button>

        <Button 
          type="button" 
          variant="tertiary" 
          class="w-full" 
          on:click={goBack}
          disabled={isLoading}
        >
          Буцах
        </Button>
      </div>
    </form>

    <div class="mt-6 text-center text-sm text-gray-600">
      <p>Код аваагүй юу?</p>
      <button 
        type="button" 
        class="mt-1 text-primary-blue hover:underline"
        on:click={goBack}
        disabled={isLoading}
      >
        Дахин код авах
      </button>
    </div>
  </div>
</div>