<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  let { isPending } = $props<{ isPending: boolean }>();
</script>

<div class="md:col-span-3 flex justify-end space-x-2 mt-4">
  <Button href="/menu" variant="secondary">Цуцлах</Button>
  <Button type="submit" disabled={isPending}>
    {#if isPending}
      <span>Loading...</span>
    {:else}
      Хадгалах
    {/if}
  </Button>
</div>