<script lang="ts">
  import type { PageData } from './$types';
  import UserHistory from '$lib/components/user-control/UserHistory.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>History for {data.user.name}</title>
</svelte:head>

<div class="space-y-6">
  <a href="/users" class="text-orange-600 dark:text-orange-500 hover:underline">&larr; Back to All Users</a>
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">User History for <span class="text-orange-500">{data.user.name}</span></h1>
  
  <UserHistory user={data.user} orderHistory={data.orderHistory} />
</div>
