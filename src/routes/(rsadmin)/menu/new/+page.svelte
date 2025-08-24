<script lang="ts">
  import MenuManagementForm from "$lib/components/menu-management/MenuManagementForm.svelte";
  export let data;
</script>

<svelte:head>
  <title>Шинэ цэс нэмэх | Qpick</title>
</svelte:head>

<MenuManagementForm restaurantId={data.user!.restaurant.id} />
