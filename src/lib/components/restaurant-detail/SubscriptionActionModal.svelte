<script lang="ts">
  import { CheckCircle, XCircle } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
  import type { TanStackMutation } from "$lib/types/tanstack";

  export let open: boolean = false;
  export let action: 'activate' | 'deactivate' | null = null;
  export let onConfirm: () => void;
  export let onCancel: () => void;
  export let activateSubscriptionMutation: TanStackMutation<any, any, any>;
  export let deactivateSubscriptionMutation: TanStackMutation<any, any, any>;
</script>

<Dialog bind:open>
  <DialogContent class="max-w-md">
    <DialogHeader>
      <DialogTitle>
        {#if action === 'activate'}
          Захиалгыг идэвхжүүлэх
        {:else if action === 'deactivate'}
          Захиалгыг цуцлах
        {/if}
      </DialogTitle>
    </DialogHeader>

    <div class="px-6 py-4">
      {#if action === 'activate'}
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="flex-1">
            <p class="text-gray-700 mb-2">
              Та энэ ресторан руу захиалгын төлөлтийг идэвхжүүлэхдээ итгэлтэй байна уу?
            </p>
            <p class="text-sm text-gray-500">
              Идэвхжүүлснээр ресторан системийн бүх үйлчилгээг ашиглах боломжтой болно.
            </p>
          </div>
        </div>
      {:else if action === 'deactivate'}
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle class="w-6 h-6 text-red-600" />
          </div>
          <div class="flex-1">
            <p class="text-gray-700 mb-2">
              Та энэ ресторан руу захиалгын төлөлтийг цуцлахдаа итгэлтэй байна уу?
            </p>
            <p class="text-sm text-gray-500">
              Цуцласнаар ресторан системийн үйлчилгээг ашиглах боломжгүй болно.
            </p>
          </div>
        </div>
      {/if}
    </div>

    <div class="px-6 py-4 bg-gray-50 flex gap-3 justify-end rounded-b-lg">
      <Button
        on:click={onCancel}
        variant="secondary"
        disabled={$activateSubscriptionMutation.isPending || $deactivateSubscriptionMutation.isPending}
      >
        Болих
      </Button>
      <Button
        on:click={onConfirm}
        disabled={$activateSubscriptionMutation.isPending || $deactivateSubscriptionMutation.isPending}
        class="{action === 'activate'
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-red-600 hover:bg-red-700'}"
      >
        {#if $activateSubscriptionMutation.isPending || $deactivateSubscriptionMutation.isPending}
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        {/if}
        {action === 'activate' ? 'Идэвхжүүлэх' : 'Цуцлах'}
      </Button>
    </div>
  </DialogContent>
</Dialog>
