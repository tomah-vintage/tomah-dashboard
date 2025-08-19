<script lang="ts">
  import { createLoginMutation } from "$lib/queries/auth-queries";
  import { goto } from "$app/navigation";
  import { Eye, EyeOff } from "lucide-svelte";

  const loginMutation = createLoginMutation();

  let email = "";
  let password = "";
  let showPassword = false;

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

<svelte:head>
  <title>Login | Qpick</title>
</svelte:head>

<div
  class="flex min-h-screen items-center justify-center bg-content-background font-sans"
>
  <div class="relative w-full max-w-md rounded-xl bg-card-background p-8">
    <h2 class="mb-8 text-center text-2xl font-bold text-gray-900">Нэвтрэх</h2>
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div class="relative">
        <input
          type="text"
          id="email"
          name="email"
          bind:value={email}
          required
          placeholder="Имэйл, утасны дугаараа бичнэ үү"
          class="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm placeholder-gray-400 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
        />
      </div>
      <div class="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          bind:value={password}
          required
          placeholder="Нууц үгээ оруулна уу"
          class="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm placeholder-gray-400 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
        />
        <button
          type="button"
          on:click={() => (showPassword = !showPassword)}
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {#if showPassword}
            <EyeOff class="h-5 w-5" />
          {:else}
            <Eye class="h-5 w-5" />
          {/if}
        </button>
      </div>
      <div class="text-right">
        <a
          href="/forgot-password"
          class="text-sm font-medium text-primary-blue hover:underline"
          >Нууц үгээ мартсан уу?</a
        >
      </div>

      {#if $loginMutation.isError}
        <p class="text-sm text-status-error">{$loginMutation.error?.message}</p>
      {/if}

      <button
        type="submit"
        class="w-full rounded-lg bg-primary-blue px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50 disabled:opacity-50"
        disabled={$loginMutation.isPending}
      >
        {#if $loginMutation.isPending}
          Нэвтэрч байна...
        {:else}
          Үргэлжлүүлэх
        {/if}
      </button>
    </form>
    <div class="mt-8 text-center text-sm text-gray-600">
      <span>Бүртгэлтэй байгаа юу? </span>
      <a href="/register" class="font-medium text-primary-blue hover:underline"
        >Яг одоо бүртгүүлэх?</a
      >
    </div>
  </div>
</div>
