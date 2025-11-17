<script lang="ts">
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";

  export let message: string = "Захиалга ачаалж байна...";
</script>

<div class="flex justify-center items-center py-12">
  <CircularLoader size="sm" color="primary" className="mr-2" />
  <span>{message}</span>
</div>
