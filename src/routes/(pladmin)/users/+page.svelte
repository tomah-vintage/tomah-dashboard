<script lang="ts">
  import UserList from '$lib/components/user-control/UserList.svelte';
  import { createGetUsersQuery } from '$lib/queries/user-queries';
  import { Button } from '$lib/components/ui/button';
  import { Plus, Search, SlidersHorizontal } from 'lucide-svelte';

  const getUsersQuery = createGetUsersQuery();
</script>

<svelte:head>
  <title>User Management | Qpick</title>
</svelte:head>

<div class="space-y-8"> <!-- Increased space-y for overall page -->
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">User management</h1>
    <p class="text-gray-500 dark:text-gray-400 mt-1">Manage your team members and their account permissions here.</p>
  </div>

  <div class="bg-white shadow-md rounded-lg p-6 space-y-6"> <!-- Card structure for content -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
        {#if $getUsersQuery.data}
          All users <span class="text-gray-500">{$getUsersQuery.data.length}</span>
        {/if}
      </h2>
      <div class="flex space-x-2">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search" class="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-primary-blue focus:border-primary-blue" />
        </div>
        <Button variant="secondary">
          <SlidersHorizontal class="w-5 h-5 mr-2" />
          Filters
        </Button>
        <Button>
          <Plus class="w-5 h-5 mr-2" />
          Add user
        </Button>
      </div>
    </div>
    
    {#if $getUsersQuery.isLoading}
      <p class="text-center text-gray-500">Ачаалж байна...</p>
    {:else if $getUsersQuery.isError}
      <p class="text-center text-red-500">Алдаа гарлаа: {$getUsersQuery.error.message}</p>
    {:else if $getUsersQuery.data}
      <UserList users={$getUsersQuery.data} />
    {/if}
  </div>
</div>
