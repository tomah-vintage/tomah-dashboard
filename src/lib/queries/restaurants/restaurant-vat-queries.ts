import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
import type {
  VatReceiptsResponse,
  VatReceipt,
  VatReceiptSummary,
} from "$lib/types/restaurant";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Get VAT receipts list with optional filters (src/lib/queries/restaurant-queries.ts:527-565)
export const createGetVatReceiptsQuery = (params?: {
  restaurant_id?: string;
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  receipt_type?: string;
}) =>
  createQuery<VatReceiptsResponse, Error>({
    queryKey: ["vat-receipts", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.restaurant_id)
        queryParams.append("restaurant_id", params.restaurant_id);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.page_size)
        queryParams.append("page_size", params.page_size.toString());
      if (params?.start_date)
        queryParams.append("start_date", params.start_date);
      if (params?.end_date) queryParams.append("end_date", params.end_date);
      if (params?.receipt_type)
        queryParams.append("receipt_type", params.receipt_type);

      const url = `${PUBLIC_BACKEND_URL}/api/vat-receipts/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const data = await apiFetch<VatReceiptsResponse | VatReceipt[]>(url);

      // Handle both array response and paginated response
      if (Array.isArray(data)) {
        return {
          count: data.length,
          next: null,
          previous: null,
          results: data,
        };
      }
      return data;
    },
  });

// Get failed VAT receipts (src/lib/queries/restaurant-queries.ts:567-575)
export const createGetFailedVatReceiptsQuery = () =>
  createQuery<VatReceiptsResponse, Error>({
    queryKey: ["vat-receipts-failed"],
    queryFn: () =>
      apiFetch<VatReceiptsResponse>(
        `${PUBLIC_BACKEND_URL}/api/vat-receipts/failed/`,
      ),
  });

// Get VAT receipts summary (src/lib/queries/restaurant-queries.ts:577-585)
export const createGetVatReceiptsSummaryQuery = () =>
  createQuery<VatReceiptSummary, Error>({
    queryKey: ["vat-receipts-summary"],
    queryFn: () =>
      apiFetch<VatReceiptSummary>(
        `${PUBLIC_BACKEND_URL}/api/vat-receipts/summary/`,
      ),
  });

// Send data to EBARIMT system — POST /api/system/send-data/
export const createSendEbarimtDataMutation = () =>
  createMutation<{ success: boolean; data?: unknown }, Error, Record<string, unknown>>({
    mutationFn: (payload) =>
      apiFetch(`${PUBLIC_BACKEND_URL}/api/system/send-data/`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });

// Retry a failed VAT receipt — POST /api/vat-receipts/{id}/retry/
export const createRetryVatReceiptMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<{ success: boolean; receipt?: VatReceipt }, Error, number>({
    mutationFn: (receiptId) =>
      apiFetch(`${PUBLIC_BACKEND_URL}/api/vat-receipts/${receiptId}/retry/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vat-receipts"] });
      queryClient.invalidateQueries({ queryKey: ["vat-receipts-summary"] });
      queryClient.invalidateQueries({ queryKey: ["vat-receipts-failed"] });
    },
  });
};
