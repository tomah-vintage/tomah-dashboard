<script lang="ts">
  import { createLoginMutation } from "$lib/queries/auth-queries";
  import { goto } from "$app/navigation";
  import { Eye, EyeOff } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { sessionStore } from "$lib/stores/sessionStore";
  import { PUBLIC_BACKEND_URL } from "$env/static/public";
  import type { User } from "$lib/types/auth";

  const loginMutation = createLoginMutation();

  let email = "";
  let password = "";
  let showPassword = false;

  const handleSubmit = () => {
    $loginMutation.mutate(
      { email, password },
      {
        onSuccess: async (data) => {
          document.cookie = `session=${data.access}; path=/; max-age=86400; SameSite=Strict`; // Expires in 1 day
          document.cookie = `refreshToken=${data.refresh}; path=/; max-age=2592000; SameSite=Strict`; // Expires in 30 days

          // Fetch user data and update session store immediately
          try {
            const userResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/me/`, {
              headers: {
                Authorization: `Bearer ${data.access}`,
              },
            });

            if (userResponse.ok) {
              const user: User = await userResponse.json();
              sessionStore.set({
                user: {
                  ...user,
                  name: `${user.first_name} ${user.last_name}`,
                  restaurantId: user.restaurant?.id,
                },
              });
            }
          } catch (error) {
            console.error(
              "Нэвтэрсний дараа хэрэглэгчийн мэдээллийг авахад алдаа гарлаа:",
              error,
            );
          }

          const redirectTo = $page.url.searchParams.get("redirectTo");
          goto(redirectTo || `${base}/`);
        },
      },
    );
  };
</script>

<svelte:head>
  <title>Нэвтрэх | Qpick</title>
</svelte:head>

<div
  class="flex min-h-screen items-center justify-center bg-content-background font-sans"
>
  <div class="relative w-full max-w-md rounded-xl bg-card-background p-8">
    <h2 class="mb-8 text-center text-2xl font-bold text-gray-900">Нэвтрэх</h2>
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <Input
        id="email"
        name="email"
        label=""
        placeholder="Имэйл, утасны дугаараа бичнэ үү"
        bind:value={email}
        required
      />
      <Input
        id="password"
        name="password"
        label=""
        type={showPassword ? "text" : "password"}
        placeholder="Нууц үгээ оруулна уу"
        bind:value={password}
        required
      >
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
      {#if $loginMutation.isError}
        <p class="text-sm text-status-error">{$loginMutation.error?.message}</p>
      {/if}

      <Button type="submit" class="w-full" disabled={$loginMutation.isPending}>
        {#if $loginMutation.isPending}
          Нэвтэрч байна...
        {:else}
          Үргэлжлүүлэх
        {/if}
      </Button>
    </form>

    <div class="mt-6 text-center">
      <button
        type="button"
        on:click={() => goto(`/forgot-password`)}
        class="text-sm font-medium text-primary-blue hover:underline bg-transparent border-none cursor-pointer"
        >Нууц үгээ мартсан уу?</button
      >
    </div>
  </div>
</div>
