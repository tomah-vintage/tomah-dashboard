<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Save, Loader2 } from "lucide-svelte";
  
  let { isPending } = $props<{ isPending: boolean }>();
</script>

<div class="bg-white rounded-lg shadow p-6">
  <div class="flex justify-between items-center">
    <div class="text-sm text-gray-600">
      {#if isPending}
        <div class="flex items-center space-x-2">
          <Loader2 class="w-4 h-4 animate-spin" />
          <span>Хадгалж байна...</span>
        </div>
      {:else}
        <span>Бүх мэдээлэл бөглөж дууссаны дараа хадгална уу.</span>
      {/if}
    </div>
    
    <div class="flex space-x-3">
      <Button href="/menu" variant="secondary" disabled={isPending}>
        Цуцлах
      </Button>
      <Button type="submit" disabled={isPending} class="min-w-[120px]">
        {#if isPending}
          <div class="flex items-center space-x-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            <span>Хадгалж байна...</span>
          </div>
        {:else}
          <div class="flex items-center space-x-2">
            <Save class="w-4 h-4" />
            <span>Хадгалах</span>
          </div>
        {/if}
      </Button>
    </div>
  </div>
</div>