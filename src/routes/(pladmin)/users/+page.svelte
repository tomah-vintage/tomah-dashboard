<script lang="ts">
  import type { PageData } from './$types';
  import UserList from '$lib/components/user-control/UserList.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>User Management | Qpick</title>
</svelte:head>

<div class="space-y-6">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
  
  <UserList users={data.users} />
</div>
