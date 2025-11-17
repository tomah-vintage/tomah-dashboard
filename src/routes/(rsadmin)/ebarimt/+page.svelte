<script lang="ts">
  import { sessionStore } from "$lib/stores/sessionStore";
  import {
    createGetEbarimtConfigQuery,
    createUpdateEbarimtConfigMutation,
    createCheckEbarimtStatusMutation,
    createSyncMerchantMutation,
    createGetVatReceiptsQuery,
    createGetVatReceiptsSummaryQuery,
  } from "$lib/queries/restaurant-queries";
  import type { EbarimtConfigUpdate } from "$lib/types/restaurant";
  import { toast } from "svelte-french-toast";
  import {
    validateEbarimtForm,
    hasFormDataChanged,
    handleStatusCheckSuccess,
    handleMerchantSyncSuccess,
    handleConfigSaveSuccess,
    shouldShowReceiptsTab,
    initializeFormData,
  } from "$lib/composables/useEbarimt";

  // Components
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import EbarimtSubNav from "$lib/components/ebarimt/EbarimtSubNav.svelte";
  import EbarimtConfigurationTab from "$lib/components/ebarimt/EbarimtConfigurationTab.svelte";
  import EbarimtReceiptsTab from "$lib/components/ebarimt/EbarimtReceiptsTab.svelte";

  // Get restaurant ID from session store
  $: restaurantId =
    $sessionStore.user?.restaurant?.id ||
    $sessionStore.user?.restaurantId ||
    "1";

  // Get EBARIMT configuration
  $: getEbarimtConfig = createGetEbarimtConfigQuery(restaurantId);
  $: ({ data: ebarimtConfig, isLoading: isLoadingEbarimt } = $getEbarimtConfig);

  // Mutations
  const updateEbarimtMutation = createUpdateEbarimtConfigMutation();
  $: ({ mutate: updateEbarimt, isPending: isSavingEbarimt } =
    $updateEbarimtMutation);

  const checkEbarimtStatusMutation = createCheckEbarimtStatusMutation();
  $: ({ mutate: checkEbarimtStatus, isPending: isCheckingStatus } =
    $checkEbarimtStatusMutation);

  const syncMerchantMutation = createSyncMerchantMutation();
  $: ({ mutate: syncMerchant, isPending: isSyncingMerchant } =
    $syncMerchantMutation);

  // Get VAT receipts
  $: getVatReceipts = createGetVatReceiptsQuery({ page: 1, page_size: 10 });
  $: getVatSummary = createGetVatReceiptsSummaryQuery();

  // Form state
  let ebarimtFormData: EbarimtConfigUpdate = {
    restaurant_tin: "",
    district_code: "",
    ebarimt_enabled: false,
  };

  let originalFormData: EbarimtConfigUpdate = {
    restaurant_tin: "",
    district_code: "",
    ebarimt_enabled: false,
  };

  let showEtaxInstructions = false;

  // Tab state
  let activeTab: "config" | "receipts" = "config";
  let hasSetDefaultTab = false;

  // Computed values
  $: showReceiptsTab = shouldShowReceiptsTab(
    ebarimtFormData.ebarimt_enabled,
    ebarimtConfig?.merchant_registered,
  );

  $: hasFormChanged = hasFormDataChanged(ebarimtFormData, originalFormData);

  // Update form when config loads
  $: if (ebarimtConfig && !isLoadingEbarimt) {
    ebarimtFormData = initializeFormData(ebarimtConfig);
    originalFormData = initializeFormData(ebarimtConfig);
  }

  // Auto-switch to receipts tab when conditions are met
  $: if (showReceiptsTab && !hasSetDefaultTab) {
    activeTab = "receipts";
    hasSetDefaultTab = true;
  }

  // Event handlers
  function handleTabChange(tab: "config" | "receipts") {
    activeTab = tab;
  }

  function handleCheckStatus() {
    checkEbarimtStatus(
      { restaurantId },
      {
        onSuccess: handleStatusCheckSuccess,
        onError: (error) => {
          toast.error(`Статус шалгахад алдаа гарлаа: ${error.message}`);
        },
      },
    );
  }

  function handleMerchantSync() {
    syncMerchant(undefined, {
      onSuccess: handleMerchantSyncSuccess,
      onError: (error) => {
        toast.error(`Төлөв шинэчлэхэд алдаа гарлаа: ${error.message}`);
      },
    });
  }

  function handleEbarimtSubmit(e: Event) {
    e.preventDefault();

    // Validate form
    const validation = validateEbarimtForm(ebarimtFormData);
    if (!validation.valid) {
      toast.error(validation.error || "Алдаа гарлаа");
      return;
    }

    const wasNotRegisteredBefore = !ebarimtConfig?.merchant_registered;

    updateEbarimt(
      { restaurantId, data: ebarimtFormData },
      {
        onSuccess: (data) => {
          showEtaxInstructions = handleConfigSaveSuccess(
            data,
            wasNotRegisteredBefore,
          );

          // Update original form data
          originalFormData = { ...ebarimtFormData };
        },
        onError: (error) => {
          toast.error(`Алдаа гарлаа: ${error.message}`);
        },
      },
    );
  }
</script>

<svelte:head>
  <title>E-barimt тохиргоо | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-2 text-sm text-gray-500 py-4">
        <div class="h-4 w-1 bg-indigo-600 rounded-sm"></div>
        <span class="font-medium text-gray-900">E-barimt тохиргоо</span>
      </div>
    </div>
  </div>

  <!-- Main Content with Sidebar -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if isLoadingEbarimt}
      <div class="flex justify-center items-center py-8">
        <CircularLoader size="md" color="indigo" />
      </div>
    {:else}
      <div class="flex gap-6">
        <!-- Sidebar Navigation -->
        <div class="hidden lg:block w-64 flex-shrink-0">
          <EbarimtSubNav
            {activeTab}
            showReceipts={showReceiptsTab}
            onTabChange={handleTabChange}
          />
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 min-w-0">
          {#if activeTab === "config"}
            <EbarimtConfigurationTab
              {ebarimtConfig}
              bind:ebarimtFormData
              {showEtaxInstructions}
              {isSavingEbarimt}
              {hasFormChanged}
              {isSyncingMerchant}
              {isCheckingStatus}
              onSubmit={handleEbarimtSubmit}
              onCheckStatus={handleCheckStatus}
              onMerchantSync={handleMerchantSync}
            />
          {:else if activeTab === "receipts" && showReceiptsTab}
            <EbarimtReceiptsTab
              receipts={$getVatReceipts.data?.results || []}
              summary={$getVatSummary.data}
              isLoading={$getVatReceipts.isLoading}
            />
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
