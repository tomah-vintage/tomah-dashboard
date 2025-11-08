<script lang="ts">
  import { RefreshCw } from "@lucide/svelte";
  
  export let message: string = "Захиалга ачаалж байна...";
</script>

<div class="flex justify-center items-center py-12">
  <RefreshCw class="w-6 h-6 animate-spin mr-2" />
  <span>{message}</span>
</div>