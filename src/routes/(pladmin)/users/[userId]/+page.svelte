<script lang="ts">
  import type { PageData } from './$types';
  import UserHistory from '$lib/components/user-control/UserHistory.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>User History for {data.user.name} | Qpick</title>
</svelte:head>

<div class="space-y-6">
  <a href="/users" class="text-primary-blue hover:underline">&larr; Back to All Users</a>
  <h1 class="text-3xl font-bold text-gray-800">User History for <span class="text-primary-blue">{data.user.name}</span></h1>
  
  <UserHistory user={data.user} orderHistory={data.orderHistory} />
</div>
