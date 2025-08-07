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
          document.cookie = `session=${data.access}; path=/; max-age=86400;`; // Expires in 1 day
          goto("/");
        },
      }
    );
  };
</script>

<div
  class="flex min-h-screen items-center justify-center bg-[#F8F9FA] font-sans"
>
  <div
    class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg shadow-gray-200"
  >
    <h2 class="mb-6 text-center text-2xl font-bold text-[#2C2C2C]">
      Admin Login
    </h2>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="email" class="mb-2 block text-sm font-medium text-[#2C2C2C]"
          >email:</label
        >
        <input
          type="text"
          id="email"
          name="email"
          bind:value={email}
          required
          class="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          for="password"
          class="mb-2 block text-sm font-medium text-[#2C2C2C]">Password:</label
        >
        <input
          type="password"
          id="password"
          name="password"
          bind:value={password}
          required
          class="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
        />
      </div>
      {#if $loginMutation.isError}
        <p class="text-sm text-[#F44336]">{$loginMutation.error?.message}</p>
      {/if}
      <button
        type="submit"
        class="w-full rounded-lg bg-[#FF6B35] px-4 py-2 text-white hover:bg-[#E05F2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-opacity-50"
        disabled={$loginMutation.isPending}
        >{#if $loginMutation.isPending}Logging in...{:else}Login{/if}</button
      >
    </form>
  </div>
</div>
