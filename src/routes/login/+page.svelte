<script lang="ts">
  import { createLoginMutation } from "$lib/queries/auth-queries";
  import { goto } from "$app/navigation";
  import { Eye, EyeOff } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { page } from "$app/stores";

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
          const redirectTo = $page.url.searchParams.get('redirectTo');
          goto(redirectTo || "/");
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
      <Input id="email" name="email" label="" placeholder="Имэйл, утасны дугаараа бичнэ үү" bind:value={email} required />
      <Input id="password" name="password" label="" type={showPassword ? 'text' : 'password'} placeholder="Нууц үгээ оруулна уу" bind:value={password} required>
        <Button
          slot="action"
          type="button"
          on:click={() => (showPassword = !showPassword)}
          variant="tertiary"
        >
          {#if showPassword}
            <EyeOff class="h-5 w-5" />
          {:else}
            <Eye class="h-5 w-5" />
          {/if}
        </Button>
      </Input>
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

      <Button
        type="submit"
        class="w-full"
        disabled={$loginMutation.isPending}
      >
        {#if $loginMutation.isPending}
          Нэвтэрч байна...
        {:else}
          Үргэлжлүүлэх
        {/if}
      </Button>
    </form>
    <div class="mt-8 text-center text-sm text-gray-600">
      <span>Бүртгэлтэй байгаа юу? </span>
      <a href="/register" class="font-medium text-primary-blue hover:underline"
        >Яг одоо бүртгүүлэх?</a
      >
    </div>
  </div>
</div>