<script lang="ts">
  import { Users, Plus, Trash2, X } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import type {
    AdminRestaurantDetail,
    AddUserToRestaurantData,
  } from "$lib/types/restaurant";
  import type { TanStackMutation } from "$lib/types/tanstack";

  export let restaurant: AdminRestaurantDetail;
  export let showAddUserForm: boolean = false;
  export let addUserData: AddUserToRestaurantData;
  export let onAddUser: () => void;
  export let onRemoveUser: (userId: number) => void;
  export let onResetForm: () => void;
  export let addUserMutation: TanStackMutation<any, any, any>;
  export let removeUserMutation: TanStackMutation<any, any, any>;
</script>

<div class="bg-white rounded-lg border border-gray-200 p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold flex items-center">
      <Users class="w-5 h-5 mr-2" />
      Админ хэрэглэгчид
    </h3>
    <Button
      on:click={() => (showAddUserForm = true)}
      size="sm"
      variant="secondary"
      class="flex items-center gap-2"
    >
      <Plus class="w-4 h-4" />
      Хэрэглэгч нэмэх
    </Button>
  </div>

  <!-- Add User Form -->
  {#if showAddUserForm}
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-medium">Шинэ хэрэглэгч нэмэх</h4>
        <Button on:click={onResetForm} variant="secondary" size="sm">
          <X class="w-4 h-4" />
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input bind:value={addUserData.first_name} placeholder="Нэр" required />
        <Input bind:value={addUserData.last_name} placeholder="Овог" required />
        <Input
          bind:value={addUserData.email}
          type="email"
          placeholder="И-мэйл"
          required
        />
        <Input
          bind:value={addUserData.phone}
          placeholder="Утасны дугаар"
          required
        />
        <Input
          bind:value={addUserData.password}
          type="password"
          placeholder="Нууц үг"
          required
        />
      </div>

      <div class="flex gap-2 mt-4">
        <Button
          on:click={onAddUser}
          disabled={$addUserMutation.isPending}
          class="flex items-center gap-2"
        >
          {#if $addUserMutation.isPending}
            <CircularLoader size="xs" color="white" />
          {:else}
            <Plus class="w-4 h-4" />
          {/if}
          Нэмэх
        </Button>
        <Button on:click={onResetForm} variant="secondary">Цуцлах</Button>
      </div>
    </div>
  {/if}

  <!-- User List -->
  <div class="space-y-3">
    {#each restaurant.admin_users as user}
      <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div
          class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center"
        >
          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
        </div>
        <div class="flex-1">
          <p class="font-medium">{user.first_name} {user.last_name}</p>
          <p class="text-sm text-gray-600">{user.email}</p>
          <p class="text-xs text-gray-500">{user.phone}</p>
          <div class="flex items-center mt-1">
            <div
              class="w-2 h-2 rounded-full mr-2"
              class:bg-green-500={user.is_active}
              class:bg-red-500={!user.is_active}
            ></div>
            <span class="text-xs text-gray-500">
              {user.is_active ? "Идэвхтэй" : "Идэвхгүй"}
            </span>
          </div>
        </div>
        <Button
          on:click={() => onRemoveUser(user.id)}
          variant="secondary"
          size="sm"
          disabled={$removeUserMutation.isPending}
          class="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {#if $removeUserMutation.isPending}
            <CircularLoader size="xs" color="red" />
          {:else}
            <Trash2 class="w-4 h-4" />
          {/if}
        </Button>
      </div>
    {/each}
  </div>
</div>
