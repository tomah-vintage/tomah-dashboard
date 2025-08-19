<script lang="ts">
  import NewRestaurantForm from "./NewRestaurantForm.svelte";

  export let form;
</script>

<div class="card m-6 bg-white rounded-lg">
  <div class="flex items-center gap-2 pt-5 mb-8">
    <div class="h-5 w-2 bg-primary-blue rounded-sm"></div>
    <h1 class="text-xl font-bold">Ресторан нэмэх</h1>
  </div>
  <NewRestaurantForm {form} />
</div>
