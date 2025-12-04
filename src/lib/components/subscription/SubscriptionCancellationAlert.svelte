<script lang="ts">
  import { AlertCircle } from "@lucide/svelte";

  export let endDate: string;
  export let formatDate: (dateString: string) => string;
</script>

<!-- Cancellation Info (src/routes/(rsadmin)/subscription/+page.svelte:379-393) -->
<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  <div class="flex items-center">
    <AlertCircle class="w-5 h-5 text-yellow-600 mr-2" />
    <div>
      <h4 class="font-medium text-yellow-800">Цуцлах хүсэлт</h4>
      <p class="text-sm text-yellow-700">
        Таны захиалгын төлөв {formatDate(endDate)}-нд цуцлагдах болно.
      </p>
    </div>
  </div>
</div>
