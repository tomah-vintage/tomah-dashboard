import { Clock, Package, Utensils, CheckCircle, XCircle } from "@lucide/svelte";
import { OrderStatus } from "$lib/types/order";
import type { ComponentType } from "svelte";

export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.PREPARING:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.IN_BOX:
      return "bg-purple-100 text-purple-800";
    case OrderStatus.DONE:
      return "bg-green-100 text-green-800";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusIcon(status: OrderStatus): ComponentType {
  switch (status) {
    case OrderStatus.PENDING:
      return Clock;
    case OrderStatus.PREPARING:
      return Utensils;
    case OrderStatus.IN_BOX:
      return Package;
    case OrderStatus.DONE:
      return CheckCircle;
    case OrderStatus.CANCELLED:
      return XCircle;
    default:
      return Clock;
  }
}

export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "Pending";
    case OrderStatus.PREPARING:
      return "Preparing";
    case OrderStatus.IN_BOX:
      return "In Box";
    case OrderStatus.DONE:
      return "Done";
    case OrderStatus.CANCELLED:
      return "Cancelled";
    default:
      return status;
  }
}

export async function fetchOrders(params: {
  searchTerm?: string;
  selectedStatus?: string;
  selectedOrderType?: string;
  currentPage?: number;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.searchTerm) queryParams.append("search", params.searchTerm);
  if (params.selectedStatus) queryParams.append("status", params.selectedStatus);
  if (params.selectedOrderType) queryParams.append("order_type", params.selectedOrderType);
  if (params.currentPage && params.currentPage > 1) {
    queryParams.append("page", params.currentPage.toString());
  }

  const url = `${import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:8000"}/api/order/${
    queryParams.toString() ? "?" + queryParams.toString() : ""
  }`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  return response.json();
}