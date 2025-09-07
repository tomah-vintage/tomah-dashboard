<script lang="ts">
  export let type:
    | "text"
    | "textarea"
    | "checkbox"
    | "date"
    | "password"
    | "email"
    | "number"
    | "price" = "text";
  export let label: string | undefined = undefined;
  export let value: string | boolean | number | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let error: string | undefined = undefined;
  export let id: string | undefined = undefined;

  const { class: classFromParent, ...rest } = $$restProps;

  const baseClasses =
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200";

  $: errorClasses = error 
    ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50" 
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400";

  $: finalClasses = `${baseClasses} ${errorClasses} ${classFromParent || ""}`;

  function handleNumberInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const sanitizedValue = target.value.replace(/[^0-9]/g, "");
    value = parseFloat(sanitizedValue);
  }

  let displayValue: string = "";

  function formatPrice(numStr: string | number | undefined): string {
    if (numStr === undefined || numStr === null || numStr === "") {
      return "";
    }
    const num =
      typeof numStr === "string"
        ? parseInt(numStr.replace(/[^0-9]/g, ""), 10)
        : numStr;
    if (isNaN(num)) {
      return "";
    }
    return num.toLocaleString("en-US") + "₮";
  }

  function handlePriceInput(e: Event) {
    const target = e.target as HTMLInputElement;
    let currentInput = target.value;

    let rawNumericString = currentInput
      .replace(/₮/g, "")
      .replace(/,/g, "")
      .replace(/[^0-9]/g, "");

    const previousFormattedValue = formatPrice(String(value!));
    if (
      previousFormattedValue.endsWith("₮") &&
      currentInput === previousFormattedValue.slice(0, -1)
    ) {
      rawNumericString = rawNumericString.slice(0, -1);
    }
    value =
      rawNumericString === "" ? undefined : parseInt(rawNumericString, 10);
    displayValue = formatPrice(value);
    if (target.value !== displayValue) {
      target.value = displayValue;
    }
  }

  $: {
    if (type === "price") {
      displayValue = formatPrice(String(value!));
    }
  }
</script>

{#if type === "checkbox"}
  <div class="flex items-center">
    <input
      type="checkbox"
      {id}
      bind:checked={value as boolean}
      class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-blue focus:ring-primary-blue"
      {...rest}
    />
    <label for={id} class="ml-2 block text-sm text-gray-900">{label}</label>
  </div>
{:else}
  <div>
    <label for={id} class="mb-1 block text-sm font-medium {error ? 'text-red-700' : 'text-gray-700'}"
      >{label}{#if error}<span class="text-red-500 ml-1">*</span>{/if}</label
    >
    <div class="relative">
      {#if type === "textarea"}
        <textarea {id} bind:value {placeholder} class={finalClasses} {...rest}
        ></textarea>
      {:else if type === "email"}
        <input
          type="email"
          {id}
          bind:value
          {placeholder}
          class={finalClasses}
          {...rest}
        />
      {:else if type === "password"}
        <input
          type="password"
          {id}
          bind:value
          {placeholder}
          class={finalClasses}
          {...rest}
        />
      {:else if type === "date"}
        <input
          type="date"
          {id}
          bind:value
          {placeholder}
          class={finalClasses}
          {...rest}
        />
      {:else if type === "number"}
        <input
          type="text"
          {id}
          {value}
          on:input={handleNumberInput}
          {placeholder}
          class={finalClasses}
          {...rest}
        />
      {:else if type === "price"}
        <input
          type="text"
          {id}
          value={displayValue}
          on:input={handlePriceInput}
          {placeholder}
          class={finalClasses}
          {...rest}
        />
      {:else}
        <input
          type="text"
          {id}
          bind:value
          {placeholder}
          class={finalClasses}
          {...rest}
        />
      {/if}
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="action" />
      </div>
    </div>
    {#if error}
      <div class="mt-1 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
        <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-red-600 font-medium">{error}</p>
      </div>
    {/if}
  </div>
{/if}
