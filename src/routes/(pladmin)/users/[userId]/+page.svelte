<script lang="ts">
  import type { PageData } from "./$types";
  import UserHistory from "$lib/components/user-control/UserHistory.svelte";
  import { base } from "$app/paths";

  export let data: PageData;
</script>

<svelte:head>
  <title>Хэрэглэгчийн түүх: {data.user.name} | Qpick</title>
</svelte:head>

<div class="space-y-6">
  <a href="{base}/users" class="text-primary-blue hover:underline"
    >&larr; Бүх хэрэглэгчид рүү буцах</a
  >
  <h1 class="text-3xl font-bold text-gray-800">
    Хэрэглэгчийн түүх: <span class="text-primary-blue">{data.user.name}</span>
  </h1>

  <UserHistory user={data.user} orderHistory={data.orderHistory} />
</div>
