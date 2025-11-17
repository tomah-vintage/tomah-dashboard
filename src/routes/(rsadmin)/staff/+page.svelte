<script lang="ts">
  import type { PageData } from "./$types";
  import { createQuery } from "@tanstack/svelte-query";
  import { UserPlus, Edit, Trash2 } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import {
    createGetRestaurantStaffQuery,
    createDeleteRestaurantStaffMutation,
    createAddRestaurantStaffMutation,
    type RestaurantStaffUser,
  } from "$lib/queries/restaurant-queries";
  import CreateUserModal from "$lib/components/restaurant-detail/CreateUserModal.svelte";
  import EditUserModal from "$lib/components/restaurant-detail/EditUserModal.svelte";
  import toast from "svelte-french-toast";

  export let data: PageData;

  let showCreateModal = false;
  let showEditModal = false;
  let selectedUserForEdit: RestaurantStaffUser | null = null;

  const staffQuery = createGetRestaurantStaffQuery();
  const deleteStaffMutation = createDeleteRestaurantStaffMutation();

  $: users = $staffQuery.data?.results || [];

  function handleCreateUser() {
    showCreateModal = true;
  }

  function handleUserCreated() {
    showCreateModal = false;
    // Refresh the staff list
    $staffQuery.refetch();
    toast.success("Шинэ ажилтан амжилттай нэмэгдлээ");
  }

  function handleEditUser(user: RestaurantStaffUser) {
    selectedUserForEdit = user;
    showEditModal = true;
  }

  function handleUserUpdated() {
    showEditModal = false;
    selectedUserForEdit = null;
    // Refresh the staff list
    $staffQuery.refetch();
  }

  function handleCloseEditModal() {
    showEditModal = false;
    selectedUserForEdit = null;
  }

  async function handleDeleteUser(user: RestaurantStaffUser) {
    // Prevent self-deletion
    if (user.email === data.user.email) {
      toast.error("Та өөрийгөө устгах боломжгүй");
      return;
    }

    const userName =
      user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.email;
    if (confirm(`Та "${userName}" гэх ажилтныг устгахдаа итгэлтэй байна уу?`)) {
      try {
        await $deleteStaffMutation.mutateAsync(user.id);
        toast.success(`${userName} ажилтныг амжилттай устгалаа`);
      } catch (error) {
        console.error("Хэрэглэгч устгахад алдаа гарлаа:", error);
        toast.error("Ажилтныг устгахад алдаа гарлаа");
      }
    }
  }

  // Helper function to check if user is the current user
  function isCurrentUser(user: RestaurantStaffUser): boolean {
    return user.email === data.user.email;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("mn-MN");
  }

  function getRoleName(user: RestaurantStaffUser) {
    switch (user.role) {
      case 1:
        return "Супер админ";
      case 2:
        return "Платформ админ";
      case 3:
        return "Ресторан админ";
      default:
        return "Хэрэглэгч";
    }
  }

  function getBadgeVariant(user: RestaurantStaffUser) {
    switch (user.role) {
      case 1:
        return "error";
      case 2:
        return "secondary";
      case 3:
        return "primary";
      default:
        return "secondary";
    }
  }
</script>

<svelte:head>
  <title>Ажилтны удирдлага - Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Ажилтангийн удирдлага
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Рестораны ажилтангуудыг удирдах
            </p>
          </div>
          <Button
            on:click={handleCreateUser}
            class="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <UserPlus size={16} />
            <span>Шинэ ажилтан нэмэх</span>
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if $staffQuery.isLoading}
      <div class="flex items-center justify-center py-12">
        <CircularLoader size="md" color="primary" />
      </div>
    {:else if $staffQuery.error}
      <div class="text-center py-12">
        <p class="text-red-600">Алдаа гарлаа: {$staffQuery.error.message}</p>
      </div>
    {:else if users.length === 0}
      <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div class="text-center py-8 sm:py-12">
          <UserPlus size={48} class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Ажилтан байхгүй
          </h3>
          <p class="text-gray-600 mb-6 text-sm sm:text-base">
            Танай ресторанд бүртгэгдсэн ажилтан байхгүй байна.
          </p>
          <Button on:click={handleCreateUser} class="w-full sm:w-auto"
            >Анхны ажилтан нэмэх</Button
          >
        </div>
      </div>
    {:else}
      <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {#each users as user (user.id)}
          <div
            class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6"
          >
            <div class="mb-4">
              <div class="flex flex-col gap-3">
                <div class="flex items-start justify-between gap-2">
                  <h3
                    class="text-lg font-semibold text-gray-900 truncate flex-1 min-w-0"
                  >
                    {#if user.first_name && user.last_name}
                      {user.first_name} {user.last_name}
                    {:else}
                      <span class="text-sm sm:text-lg break-all"
                        >{user.email}</span
                      >
                    {/if}
                    {#if isCurrentUser(user)}
                      <span class="text-xs text-blue-600 font-medium ml-1"
                        >(Та)</span
                      >
                    {/if}
                  </h3>
                  <Badge variant={getBadgeVariant(user)} class="shrink-0">
                    {getRoleName(user)}
                  </Badge>
                </div>
                {#if isCurrentUser(user)}
                  <div class="flex">
                    <Badge variant="primary" class="text-xs">
                      Одоогийн хэрэглэгч
                    </Badge>
                  </div>
                {/if}
              </div>
            </div>
            <div class="space-y-2 mb-4">
              <div class="text-sm text-gray-600 break-all">
                <strong>И-мэйл:</strong>
                {user.email}
              </div>
              {#if user.first_name || user.last_name}
                <div class="text-sm text-gray-600">
                  <strong>Нэр:</strong>
                  {user.first_name || ""}
                  {user.last_name || ""}
                </div>
              {/if}
              {#if user.phone}
                <div class="text-sm text-gray-600">
                  <strong>Утас:</strong>
                  {user.phone}
                </div>
              {:else}
                <div class="text-sm text-gray-400">
                  <strong>Утас:</strong>
                  Бөглөөгүй
                </div>
              {/if}
              <div class="text-sm text-gray-600">
                <strong>Ресторан ID:</strong>
                {user.restaurant}
              </div>
              <div class="text-sm text-gray-600">
                <strong>Бүртгүүлсэн:</strong>
                <span class="block sm:inline"
                  >{formatDate(user.created_at)}</span
                >
              </div>
              {#if user.last_login}
                <div class="text-sm text-gray-600">
                  <strong>Сүүлд нэвтэрсэн:</strong>
                  <span class="block sm:inline"
                    >{formatDate(user.last_login)}</span
                  >
                </div>
              {/if}
            </div>

            <div
              class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <Button
                variant="secondary"
                size="sm"
                on:click={() => handleEditUser(user)}
                class="flex-1 flex items-center justify-center gap-1"
              >
                <Edit size={14} />
                <span class="hidden sm:inline text-xs">Засах</span>
              </Button>
              <Button
                variant="error"
                size="sm"
                on:click={() => handleDeleteUser(user)}
                disabled={$deleteStaffMutation.isPending || isCurrentUser(user)}
                class="flex-1 flex items-center justify-center gap-1 {isCurrentUser(
                  user,
                )
                  ? 'opacity-50 cursor-not-allowed'
                  : ''}"
                title={isCurrentUser(user)
                  ? "Та өөрийгөө устгах боломжгүй"
                  : ""}
              >
                <Trash2 size={14} />
                <span class="hidden sm:inline text-xs">
                  {#if isCurrentUser(user)}
                    Хориотой
                  {:else if $deleteStaffMutation.isPending}
                    Устгаж байна...
                  {:else}
                    Устгах
                  {/if}
                </span>
                <span class="sm:hidden text-xs">
                  {#if isCurrentUser(user)}
                    Хориотой
                  {:else if $deleteStaffMutation.isPending}
                    ...
                  {:else}
                    Устгах
                  {/if}
                </span>
              </Button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#if showCreateModal}
  <CreateUserModal
    restaurantId={data.restaurantId}
    bind:showModal={showCreateModal}
    on:userCreated={handleUserCreated}
  />
{/if}

{#if showEditModal}
  <EditUserModal
    bind:showModal={showEditModal}
    user={selectedUserForEdit}
    on:userUpdated={handleUserUpdated}
    on:close={handleCloseEditModal}
  />
{/if}
