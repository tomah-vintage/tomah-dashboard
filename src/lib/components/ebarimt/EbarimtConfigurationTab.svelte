<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { EbarimtConfig, EbarimtConfigUpdate } from "$lib/types/restaurant";
	import EbarimtHeader from "./EbarimtHeader.svelte";
	import EbarimtEnableCheckbox from "./EbarimtEnableCheckbox.svelte";
	import EbarimtWarningNotRegistered from "./EbarimtWarningNotRegistered.svelte";
	import EbarimtSyncButton from "./EbarimtSyncButton.svelte";
	import EbarimtStatusCard from "./EbarimtStatusCard.svelte";
	import EbarimtInstructions from "./EbarimtInstructions.svelte";
	import EbarimtConfigForm from "./EbarimtConfigForm.svelte";

	export let ebarimtConfig: EbarimtConfig | undefined;
	export let ebarimtFormData: EbarimtConfigUpdate;
	export let showEtaxInstructions: boolean;
	export let isSavingEbarimt: boolean;
	export let hasFormChanged: boolean;
	export let isSyncingMerchant: boolean;
	export let isCheckingStatus: boolean;
	export let onSubmit: (e: Event) => void;
	export let onCheckStatus: () => void;
	export let onMerchantSync: () => void;
</script>

<div class="space-y-8">
	<!-- Header -->
	<EbarimtHeader />

	<!-- Enable/Disable EBARIMT (only show if TIN not set yet) -->
	{#if !ebarimtConfig?.restaurant_tin}
		<EbarimtEnableCheckbox bind:enabled={ebarimtFormData.ebarimt_enabled} />
	{/if}

	<!-- Warning: TIN exists but merchant not registered -->
	{#if ebarimtConfig?.restaurant_tin && !ebarimtConfig?.merchant_registered}
		<EbarimtWarningNotRegistered restaurantTin={ebarimtConfig.restaurant_tin} />

		<!-- Sync Button: Show when TIN exists but merchant not registered -->
		<EbarimtSyncButton isSyncing={isSyncingMerchant} onSync={onMerchantSync} />
	{/if}

	<!-- Merchant Registration Status -->
	{#if ebarimtConfig?.merchant_registered}
		<EbarimtStatusCard
			merchantRegistered={ebarimtConfig.merchant_registered}
			restaurantStatus={ebarimtConfig.restaurant_status}
			{isCheckingStatus}
			onCheckStatus={onCheckStatus}
			ebarimtEnabled={ebarimtFormData.ebarimt_enabled}
		/>
	{/if}

	<!-- eTax Instructions (shown after successful registration but not approved, and EBARIMT not enabled) -->
	{#if (showEtaxInstructions || ebarimtConfig?.merchant_registered) && !ebarimtConfig?.restaurant_status && !ebarimtFormData.ebarimt_enabled}
		<EbarimtInstructions />
	{/if}

	<!-- Configuration Form -->
	<EbarimtConfigForm
		bind:restaurantTin={ebarimtFormData.restaurant_tin}
		bind:districtCode={ebarimtFormData.district_code}
	/>

	<!-- Save Section -->
	<div class="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
		<div class="flex justify-between items-center">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">E-barimt тохиргоог хадгалах</h3>
				<p class="text-sm text-gray-600 mt-1">
					{#if ebarimtFormData.ebarimt_enabled && !ebarimtConfig?.merchant_registered}
						Идэвхжүүлсэн тохиолдолд PosAPI-д автоматаар бүртгэгдэнэ
					{:else}
						E-barimt тохиргоог шинэчлэх
					{/if}
				</p>
			</div>
			<Button
				on:click={onSubmit}
				disabled={isSavingEbarimt || !hasFormChanged}
				variant="primary"
				size="lg"
				class="px-8 bg-indigo-600 hover:bg-indigo-700"
			>
				{isSavingEbarimt ? "Хадгалж байна..." : "Хадгалах"}
			</Button>
		</div>
	</div>
</div>
