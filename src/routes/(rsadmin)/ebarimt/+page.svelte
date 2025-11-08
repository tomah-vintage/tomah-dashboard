<script lang="ts">
  import { sessionStore } from "$lib/stores/sessionStore";
  import {
    createGetEbarimtConfigQuery,
    createUpdateEbarimtConfigMutation,
    createCheckEbarimtStatusMutation,
  } from "$lib/queries/restaurant-queries";
  import { Button } from "$lib/components/ui/button";
  import type { EbarimtConfigUpdate } from "$lib/types/restaurant";
  import { toast } from "svelte-french-toast";

  // Components
  import EbarimtHeader from "$lib/components/ebarimt/EbarimtHeader.svelte";
  import EbarimtEnableCheckbox from "$lib/components/ebarimt/EbarimtEnableCheckbox.svelte";
  import EbarimtWarningNotRegistered from "$lib/components/ebarimt/EbarimtWarningNotRegistered.svelte";
  import EbarimtStatusCard from "$lib/components/ebarimt/EbarimtStatusCard.svelte";
  import EbarimtConfigForm from "$lib/components/ebarimt/EbarimtConfigForm.svelte";
  import EbarimtInstructions from "$lib/components/ebarimt/EbarimtInstructions.svelte";

  // Get restaurant ID from session store
  $: restaurantId =
    $sessionStore.user?.restaurant?.id ||
    $sessionStore.user?.restaurantId ||
    "1";

  // Get EBARIMT configuration
  $: getEbarimtConfig = createGetEbarimtConfigQuery(restaurantId);
  $: ({ data: ebarimtConfig, isLoading: isLoadingEbarimt } = $getEbarimtConfig);

  // Create EBARIMT update mutation
  const updateEbarimtMutation = createUpdateEbarimtConfigMutation();
  $: ({ mutate: updateEbarimt, isPending: isSavingEbarimt } =
    $updateEbarimtMutation);

  // Create EBARIMT status check mutation
  const checkEbarimtStatusMutation = createCheckEbarimtStatusMutation();
  $: ({ mutate: checkEbarimtStatus, isPending: isCheckingStatus } =
    $checkEbarimtStatusMutation);

  // EBARIMT form data
  let ebarimtFormData: EbarimtConfigUpdate = {
    restaurant_tin: "",
    district_code: "",
    ebarimt_enabled: false,
  };

  // Track if merchant was just registered
  let showEtaxInstructions = false;

  // Update EBARIMT form when config loads
  $: if (ebarimtConfig && !isLoadingEbarimt) {
    ebarimtFormData = {
      restaurant_tin: ebarimtConfig.restaurant_tin || "",
      district_code: ebarimtConfig.district_code || "",
      ebarimt_enabled: ebarimtConfig.ebarimt_enabled || false,
    };
  }

  // Handle checking EBARIMT status
  function handleCheckStatus() {
    checkEbarimtStatus(
      { restaurantId },
      {
        onSuccess: (data) => {
          if (data.registered) {
            toast.success(`Амжилттай! ${data.message}`);
          } else {
            toast.error(
              `${data.message}. Татварын албанд хүсэлтийг зөвшөөрнө үү.`,
            );
          }
        },
        onError: (error) => {
          toast.error(`Статус шалгахад алдаа гарлаа: ${error.message}`);
        },
      },
    );
  }

  // Handle EBARIMT configuration submission
  function handleEbarimtSubmit(e: Event) {
    e.preventDefault();

    // Validate required fields when enabling EBARIMT
    if (ebarimtFormData.ebarimt_enabled) {
      if (!ebarimtFormData.restaurant_tin || !ebarimtFormData.district_code) {
        toast.error(
          "EBARIMT идэвхжүүлэхийн тулд ТТД болон дүүргийн кодыг оруулна уу",
        );
        return;
      }
    }

    const wasNotRegisteredBefore = !ebarimtConfig?.merchant_registered;

    updateEbarimt(
      { restaurantId, data: ebarimtFormData },
      {
        onSuccess: (data) => {
          toast.success("EBARIMT тохиргоо амжилттай шинэчлэгдлээ");
          if (data.merchant_registered && wasNotRegisteredBefore) {
            toast.success(
              "Мерчант амжилттай бүртгэгдлээ! Татварын албанд хүсэлтийг зөвшөөрнө үү.",
            );
            showEtaxInstructions = true;
          }
        },
        onError: (error) => {
          toast.error(`Алдаа гарлаа: ${error.message}`);
        },
      },
    );
  }
</script>

<svelte:head>
  <title>EBARIMT тохиргоо | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <div class="flex items-center space-x-2 text-sm text-gray-500 py-4">
        <div class="h-4 w-1 bg-indigo-600 rounded-sm"></div>
        <span class="font-medium text-gray-900">EBARIMT тохиргоо</span>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if isLoadingEbarimt}
      <div class="flex justify-center items-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
        ></div>
      </div>
    {:else}
      <div class="space-y-8">
        <!-- Header -->
        <EbarimtHeader />

        <!-- Enable/Disable EBARIMT (only show if TIN not set yet) -->
        {#if !ebarimtConfig?.restaurant_tin}
          <EbarimtEnableCheckbox
            bind:enabled={ebarimtFormData.ebarimt_enabled}
          />
        {/if}

        <!-- Warning: TIN exists but merchant not registered -->
        {#if ebarimtConfig?.restaurant_tin && !ebarimtConfig?.merchant_registered}
          <EbarimtWarningNotRegistered
            restaurantTin={ebarimtConfig.restaurant_tin}
          />
        {/if}

        <!-- Merchant Registration Status -->
        {#if ebarimtConfig?.merchant_registered}
          <EbarimtStatusCard
            merchantRegistered={ebarimtConfig.merchant_registered}
            restaurantStatus={ebarimtConfig.restaurant_status}
            {isCheckingStatus}
            onCheckStatus={handleCheckStatus}
          />
        {/if}

        <!-- eTax Instructions (shown after successful registration but not approved) -->
        {#if (showEtaxInstructions || ebarimtConfig?.merchant_registered) && !ebarimtConfig?.restaurant_status}
          <EbarimtInstructions />
        {/if}

        <!-- Configuration Form -->
        <EbarimtConfigForm
          bind:restaurantTin={ebarimtFormData.restaurant_tin}
          bind:districtCode={ebarimtFormData.district_code}
          ebarimtEnabled={ebarimtFormData.ebarimt_enabled}
        />

        <!-- Save Section -->
        <div class="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                EBARIMT тохиргоо хадгалах
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {#if ebarimtFormData.ebarimt_enabled && !ebarimtConfig?.merchant_registered}
                  Идэвхжүүлсэн тохиолдолд мерчант автоматаар бүртгэгдэнэ
                {:else}
                  EBARIMT тохиргоог шинэчлэх
                {/if}
              </p>
            </div>
            <Button
              on:click={handleEbarimtSubmit}
              disabled={isSavingEbarimt}
              variant="primary"
              size="lg"
              class="px-8 bg-indigo-600 hover:bg-indigo-700"
            >
              {isSavingEbarimt ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
