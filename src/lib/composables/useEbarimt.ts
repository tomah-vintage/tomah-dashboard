import { get } from 'svelte/store';
import { toast } from 'svelte-french-toast';
import type { EbarimtConfigUpdate } from '$lib/types/restaurant';

/**
 * Utility functions for EBARIMT operations
 */

/**
 * Validates EBARIMT form data before submission
 */
export function validateEbarimtForm(formData: EbarimtConfigUpdate): { valid: boolean; error?: string } {
  if (formData.ebarimt_enabled) {
    if (!formData.restaurant_tin || !formData.district_code) {
      return {
        valid: false,
        error: 'E-barimt идэвхжүүлэхийн тулд байгууллагын дугаар болон дүүргийн кодыг оруулна уу'
      };
    }
  }
  return { valid: true };
}

/**
 * Checks if form data has changed compared to original
 */
export function hasFormDataChanged(
  current: EbarimtConfigUpdate,
  original: EbarimtConfigUpdate
): boolean {
  return (
    current.restaurant_tin !== original.restaurant_tin ||
    current.district_code !== original.district_code ||
    current.ebarimt_enabled !== original.ebarimt_enabled
  );
}

/**
 * Handles EBARIMT status check success
 */
export function handleStatusCheckSuccess(data: { registered: boolean; message: string }) {
  if (data.registered) {
    toast.success(`Амжилттай! ${data.message}`);
  } else {
    toast.error(`${data.message}. Татварын системд хүсэлтийг зөвшөөрнө үү.`);
  }
}

/**
 * Handles merchant sync success
 */
export function handleMerchantSyncSuccess(data: {
  success: boolean;
  data: {
    status_changed: boolean;
    merchant_registered: boolean;
  };
}) {
  if (data.success) {
    if (data.data.status_changed) {
      if (data.data.merchant_registered) {
        toast.success(`Амжилттай! Танай ресторан EBARIMT системд бүртгэлтэй байна.`);
      } else {
        toast.error(
          `Танай ресторан EBARIMT системд бүртгэлгүй байна. Эхлээд EBARIMT-д бүртгүүлнэ үү.`
        );
      }
    } else {
      toast.success('Төлөв шинэчлэгдлээ. Өөрчлөлт ороогүй байна.');
    }
  } else {
    toast.error('Төлөв шинэчлэхэд алдаа гарлаа.');
  }
}

/**
 * Handles EBARIMT config save success
 */
export function handleConfigSaveSuccess(
  data: { merchant_registered: boolean },
  wasNotRegisteredBefore: boolean
): boolean {
  toast.success('E-barimt тохиргоо амжилттай шинэчлэгдлээ');

  if (data.merchant_registered && wasNotRegisteredBefore) {
    toast.success('PosAPI-д амжилттай бүртгэгдлээ! Татварын системд хүсэлтийг зөвшөөрнө үү.');
    return true; // Should show eTax instructions
  }
  return false;
}

/**
 * Determines if receipts tab should be shown
 */
export function shouldShowReceiptsTab(
  ebarimtEnabled: boolean,
  merchantRegistered: boolean | undefined
): boolean {
  return ebarimtEnabled && !!merchantRegistered;
}

/**
 * Initializes form data from EBARIMT config
 */
export function initializeFormData(config: {
  restaurant_tin?: string;
  district_code?: string;
  ebarimt_enabled?: boolean;
}): EbarimtConfigUpdate {
  return {
    restaurant_tin: config.restaurant_tin || '',
    district_code: config.district_code || '',
    ebarimt_enabled: config.ebarimt_enabled || false
  };
}
