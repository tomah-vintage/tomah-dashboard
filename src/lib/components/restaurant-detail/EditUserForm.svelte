<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { createUpdateRestaurantStaffMutation, type RestaurantStaffUser } from "$lib/queries/restaurant-queries";
  import toast from "svelte-french-toast";

  export let user: RestaurantStaffUser;

  let email = user.email;
  let first_name = user.first_name;
  let last_name = user.last_name;
  let phone = user.phone;
  let errorMessage: string | null = null;

  const dispatch = createEventDispatcher();
  const updateStaffMutation = createUpdateRestaurantStaffMutation();

  async function handleSubmit() {
    errorMessage = null;
    try {
      await $updateStaffMutation.mutateAsync({
        id: user.id,
        data: {
          email,
          first_name,
          last_name,
          phone,
          role: user.role, // Keep existing role
        }
      });

      toast.success("Ажилтангийн мэдээлэл амжилттай шинэчлэгдлээ");
      dispatch("success");
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ажилтангийн мэдээлэл шинэчлэхэд алдаа гарлаа";
      toast.error(errorMessage);
      console.error("Error updating user:", error);
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

  {#if errorMessage}
    <p class="text-sm text-status-error">{errorMessage}</p>
  {/if}

  <Button type="submit" disabled={$updateStaffMutation.isPending} class="w-full">
    {#if $updateStaffMutation.isPending}
      Шинэчилж байна...
    {:else}
      Мэдээлэл шинэчлэх
    {/if}
  </Button>
</form>