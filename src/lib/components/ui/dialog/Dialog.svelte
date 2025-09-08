<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let open = false;
  export let onOpenChange: ((open: boolean) => void) | undefined = undefined;

  function handleClose() {
    open = false;
    onOpenChange?.(false);
    dispatch('openChange', false);
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm"
      on:click={handleBackdropClick}
      on:keydown={handleKeydown}
      role="button"
      tabindex="0"
    ></div>
    
    <!-- Dialog content -->
    <div class="relative z-10">
      <slot />
    </div>
  </div>
{/if}