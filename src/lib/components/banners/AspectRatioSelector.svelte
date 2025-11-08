<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let selectedAspectRatio: string = "16:9";
  export let disabled = false;

  let isDragging = false;
  let containerRef: HTMLDivElement;
  let previewRef: HTMLDivElement;

  const aspectRatios = [
    { label: "16:9 - Хэвтээ", value: "16:9", width: 16, height: 9 },
    { label: "4:3 - Стандарт", value: "4:3", width: 4, height: 3 },
    { label: "1:1 - Дөрвөлжин", value: "1:1", width: 1, height: 1 },
    { label: "3:2 - Фото", value: "3:2", width: 3, height: 2 },
    { label: "21:9 - Өргөн", value: "21:9", width: 21, height: 9 },
    { label: "9:16 - Босоо", value: "9:16", width: 9, height: 16 },
  ];

  $: currentRatio = aspectRatios.find(r => r.value === selectedAspectRatio) || aspectRatios[0];
  
  function handleRatioChange(ratio: string) {
    selectedAspectRatio = ratio;
    dispatch('change', { aspectRatio: ratio });
  }

  function handleMouseDown(e: MouseEvent) {
    if (disabled) return;
    isDragging = true;
    updateRatio(e);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    updateRatio(e);
  }

  function handleMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function updateRatio(e: MouseEvent) {
    if (!containerRef || !previewRef) return;

    const rect = containerRef.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    // Calculate aspect ratio based on position
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    // Map position to reasonable aspect ratio ranges
    const widthRatio = Math.max(1, Math.round((x / containerWidth) * 20 + 1)); // 1-21
    const heightRatio = Math.max(1, Math.round(((containerHeight - y) / containerHeight) * 15 + 1)); // 1-16

    const newRatio = `${widthRatio}:${heightRatio}`;
    selectedAspectRatio = newRatio;
    dispatch('change', { aspectRatio: newRatio });
  }

  function getAspectRatioStyle(ratio: { width: number, height: number }) {
    return `aspect-ratio: ${ratio.width}/${ratio.height}`;
  }
</script>

<div class="space-y-4">
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">Баннерын харьцаа</label>
    <div class="grid grid-cols-2 gap-2">
      {#each aspectRatios as ratio}
        <button
          type="button"
          class="p-3 border rounded-lg text-sm transition-all {selectedAspectRatio === ratio.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'}"
          class:opacity-50={disabled}
          disabled={disabled}
          on:click={() => handleRatioChange(ratio.value)}
        >
          <div class="w-full bg-gray-200 rounded mb-2" style={getAspectRatioStyle(ratio)}></div>
          <div class="text-xs">{ratio.label}</div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Interactive Preview -->
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">Харилцан үйлчлэлт харьцаа</label>
    <div 
      bind:this={containerRef}
      class="relative w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
      on:mousedown={handleMouseDown}
      role="button"
      tabindex="0"
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
        }
      }}
    >
      <div 
        bind:this={previewRef}
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded"
        style="aspect-ratio: {currentRatio.width}/{currentRatio.height}; width: min(80%, 100px); max-width: 80%; max-height: 80%;"
      ></div>
      
      <div class="absolute top-2 left-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
        {selectedAspectRatio}
      </div>
      
      {#if !disabled}
        <div class="absolute bottom-2 right-2 text-xs text-gray-500">
          Чирж өөрчлөх
        </div>
      {/if}
    </div>
    <p class="text-xs text-gray-500">
      Баннерын харьцааг өөрчлөхийн тулд дээрх талбарт чирж удирдах боломжтой.
    </p>
  </div>
</div>