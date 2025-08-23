<script lang="ts">
  import type { Category } from "$lib/types/menu";
  import { X, ChevronDown } from "lucide-svelte"; // Re-add X import

  let {
    id,
    suggestions = [],
    value = $bindable(),
    label = "",
    placeholder = "",
    error = undefined,
    onchange,
  } = $props<{
    id: string;
    suggestions: Category[];
    value: number[];
    label?: string;
    placeholder?: string;
    error?: string;
    onchange?: (value: number[]) => void;
  }>();

  let searchTerm = $state("");
  let showSuggestions = $state(false);
  let inputElement: HTMLInputElement;

  function addCategory(category: Category) {
    if (!value.includes(category.id)) {
      value = [...value, category.id];
      onchange?.(value);
    }
    searchTerm = "";
    showSuggestions = false;
    inputElement?.focus();
  }

  function removeCategory(categoryId: number) {
    // Re-add this function
    value = value.filter((cur: number) => cur !== categoryId);
    onchange?.(value);
  }

  let filteredSuggestions = $derived(
    suggestions.filter(
      (category: Category) =>
        !value.includes(category.id) &&
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  function handleInputFocus() {
    showSuggestions = true;
  }

  function handleInputBlur(event: FocusEvent) {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      if (
        !event.relatedTarget ||
        !(event.relatedTarget as HTMLElement).closest(".suggestions-list")
      ) {
        showSuggestions = false;
      }
    }, 100);
  }
</script>

<div class="relative w-full" {id}>
  {#if label}
    <label for="multi-select-input" class="label mb-1 block">{label}</label>
  {/if}
  <div
    class="flex items-center border rounded-md {error
      ? 'border-red-500'
      : 'border-gray-300'}"
  >
    <div class="flex flex-wrap gap-2 p-2 flex-grow">
      {#each value as categoryId (categoryId)}
        {@const category = suggestions.find(
          (s: Category) => s.id === categoryId
        )}
        {#if category}
          <span
            class="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
          >
            {category.name}
            <button
              type="button"
              class="ml-1 p-0.5 rounded-full hover:bg-blue-200"
              onclick={() => removeCategory(categoryId)}
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        {/if}
      {/each}
      <input
        id="multi-select-input"
        type="text"
        bind:value={searchTerm}
        bind:this={inputElement}
        onfocus={handleInputFocus}
        onblur={handleInputBlur}
        {placeholder}
        class="flex-grow outline-none bg-transparent"
      />
    </div>
    <button
      type="button"
      class="p-2"
      onclick={() => (showSuggestions = !showSuggestions)}
    >
      <ChevronDown class="w-5 h-5 text-gray-500" />
    </button>
  </div>

  {#if error}
    <p class="text-red-500 text-sm mt-1">{error}</p>
  {/if}

  {#if showSuggestions && filteredSuggestions.length > 0}
    <ul
      class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto suggestions-list shadow-md"
    >
      {#each filteredSuggestions as category (category.id)}
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li
          class="p-2 cursor-pointer hover:bg-gray-100"
          onmousedown={(e) => {
            e.preventDefault();
            addCategory(category);
          }}
        >
          {category.name}
        </li>
      {/each}
    </ul>
  {/if}
</div>
