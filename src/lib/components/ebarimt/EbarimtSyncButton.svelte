<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { RefreshCw } from "@lucide/svelte";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";

  export let isSyncing: boolean = false;
  export let onSync: () => void;
</script>

<div class="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
  <div class="flex items-start space-x-4">
    <div class="flex-shrink-0">
      <div
        class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"
      >
        <RefreshCw class="w-6 h-6 text-yellow-600" />
      </div>
    </div>

    <div class="flex-1">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Бүртгэлийн төлөвийг шалгах
      </h3>
      <p class="text-sm text-gray-600 mb-4">
        Танай ресторан EBARIMT системд бүртгэлтэй эсэхийг шалгана уу. Хэрэв та
        EBARIMT-д аль хэдийн бүртгүүлсэн бол энэ товч дээр дарж төлөвийг
        шинэчлэнэ үү.
      </p>

      <Button
        on:click={onSync}
        disabled={isSyncing}
        variant="primary"
        class="bg-yellow-600 hover:bg-yellow-700"
      >
        {#if isSyncing}
          <CircularLoader size="xs" color="white" className="mr-2" />
          Шалгаж байна...
        {:else}
          <RefreshCw class="w-4 h-4 mr-2" />
          Төлөвийг шинэчлэх
        {/if}
      </Button>
    </div>
  </div>
</div>
