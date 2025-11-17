<script lang="ts">
  import CircularLoader from "./CircularLoader.svelte";

  export let size: "sm" | "md" | "lg" = "md";
  export let color:
    | "primary"
    | "white"
    | "blue"
    | "indigo"
    | "green"
    | "red"
    | "gray" = "blue";
</script>

<div class="flex items-center justify-center">
  <CircularLoader {size} {color} />
</div>
