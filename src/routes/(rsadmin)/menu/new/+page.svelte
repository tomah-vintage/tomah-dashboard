<script lang="ts">
  import MenuManagementForm from "$lib/components/menu-management/MenuManagementForm.svelte";
  export let data;
</script>

<svelte:head>
  <title>New Menu Item | Qpick</title>
</svelte:head>

<MenuManagementForm restaurantId={data.user!.restaurant.id} />
