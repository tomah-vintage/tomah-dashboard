<script lang="ts">
  import { createEventDispatcher, setContext } from "svelte";
  import { writable } from "svelte/store";
  
  const dispatch = createEventDispatcher();

  export let value = "";
  export let onValueChange: ((value: string) => void) | undefined = undefined;

  let isOpen = false;
  let selectRef: HTMLDivElement;
  
  const valueStore = writable(value);
  const isOpenStore = writable(false);
  
  // Update stores when props change
  $: valueStore.set(value);
  $: isOpenStore.set(isOpen);
  
  function handleValueChange(newValue: string) {
    value = newValue;
    valueStore.set(newValue);
    onValueChange?.(newValue);
    dispatch('valueChange', newValue);
    isOpen = false;
    isOpenStore.set(false);
  }

  function toggleOpen() {
    isOpen = !isOpen;
    isOpenStore.set(isOpen);
  }

  function handleClickOutside(event: MouseEvent) {
    if (selectRef && !selectRef.contains(event.target as Node)) {
      isOpen = false;
      isOpenStore.set(false);
    }
  }

  // Provide context for child components
  setContext('select', {
    value: valueStore,
    isOpen: isOpenStore,
    toggleOpen,
    handleValueChange
  });
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative" bind:this={selectRef}>
  <slot />
</div>