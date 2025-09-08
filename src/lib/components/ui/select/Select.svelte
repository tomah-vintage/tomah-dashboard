<script lang="ts">
  import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();

  export let value = "";
  export let onValueChange: ((value: string) => void) | undefined = undefined;

  let isOpen = false;
  let selectRef: HTMLDivElement;
  
  function handleValueChange(newValue: string) {
    value = newValue;
    onValueChange?.(newValue);
    dispatch('valueChange', newValue);
    isOpen = false;
  }

  function toggleOpen() {
    isOpen = !isOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    if (selectRef && !selectRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative" bind:this={selectRef}>
  <slot {isOpen} {toggleOpen} {value} {handleValueChange} />
</div>