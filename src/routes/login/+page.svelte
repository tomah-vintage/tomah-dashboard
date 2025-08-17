<script lang="ts">
  import { createLoginMutation } from "$lib/queries/auth-queries";
  import { goto } from "$app/navigation";

  const loginMutation = createLoginMutation();

  let email = "";
  let password = "";

  const handleSubmit = () => {
    $loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          document.cookie = `session=${data.access}; path=/; max-age=86400; SameSite=Strict`; // Expires in 1 day
          document.cookie = `refreshToken=${data.refresh}; path=/; max-age=2592000; SameSite=Strict`; // Expires in 30 days
          goto("/");
        },
      }
    );
  };
</script>

<div
  class="flex min-h-screen items-center justify-center bg-content-background font-sans"
>
  <div
    class="w-full max-w-md rounded-lg bg-card-background p-8 shadow-lg"
  >
    <h2 class="mb-6 text-center text-2xl font-bold text-gray-800">
      Admin Login
    </h2>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="email" class="mb-2 block text-sm font-medium text-gray-700"
          >email:</label
        >
        <input
          type="text"
          id="email"
          name="email"
          bind:value={email}
          required
          class="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          for="password"
          class="mb-2 block text-sm font-medium text-gray-700">Password:</label
        >
        <input
          type="password"
          id="password"
          name="password"
          bind:value={password}
          required
          class="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
        />
      </div>
      {#if $loginMutation.isError}
        <p class="text-sm text-status-error">{$loginMutation.error?.message}</p>
      {/if}
      <button
        type="submit"
        class="w-full rounded-lg bg-primary-blue px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
        disabled={$loginMutation.isPending}
        >{#if $loginMutation.isPending}Logging in...{:else}Login{/if}</button
      >
    </form>
  </div>
</div>
