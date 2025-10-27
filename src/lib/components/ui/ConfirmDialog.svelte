<script lang="ts">
  import { AlertTriangle, X } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";

  let { 
    open = $bindable(false),
    title = "Баталгаажуулах",
    description = "Та итгэлтэй байна уу?",
    confirmText = "Тийм",
    cancelText = "Үгүй",
    variant = "destructive",
    loading = false,
    onConfirm,
    onCancel
  } = $props<{
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "primary" | "secondary";
    loading?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
  }>();

  function handleCancel() {
    if (loading) return; // Prevent cancel during loading
    open = false;
    onCancel?.();
  }

  function handleConfirm() {
    if (loading) return; // Prevent multiple clicks during loading
    onConfirm();
  }

  function handleBackdropClick(event: MouseEvent) {
    if (loading) return; // Prevent closing during loading
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === 'Escape' && handleCancel()}
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <!-- Dialog -->
    <div 
      class="bg-white rounded-lg shadow-xl max-w-md w-full" 
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0">
            <AlertTriangle class="w-6 h-6 text-amber-500" />
          </div>
          <h2 id="dialog-title" class="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onclick={handleCancel}
          class="text-gray-400 hover:text-gray-600 transition-colors"
          class:opacity-50={loading}
          class:cursor-not-allowed={loading}
          disabled={loading}
          aria-label="Хаах"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p id="dialog-description" class="text-gray-600">
          {description}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
        <Button 
          variant="tertiary" 
          onclick={handleCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button 
          variant={variant === "destructive" ? "error" : variant} 
          onclick={handleConfirm}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  </div>
{/if}