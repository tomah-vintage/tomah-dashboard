<script lang="ts">
  export let variant: "primary" | "secondary" | "tertiary" | "error" =
    "primary";
  export let href: string | undefined = undefined;
  export let disabled: boolean = false;

  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100",
    tertiary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    error: "bg-red-600 text-white hover:bg-red-700",
  };

  const { class: classFromParent, ...rest } = $$restProps;

  $: finalClasses = `${baseClasses} ${variantClasses[variant]} ${classFromParent || ""}`;
</script>

{#if href}
  <a {href} class={finalClasses} {...rest}>
    <slot />
  </a>
{:else}
  <button type="button" {disabled} class={finalClasses} {...rest} on:click>
    <slot />
  </button>
{/if}
