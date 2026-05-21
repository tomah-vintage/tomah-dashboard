import { Clock, Package, Utensils, CheckCircle, XCircle } from "@lucide/svelte";
import { OrderStatus, OrderType } from "$lib/types/order";
import type { ComponentType } from "svelte";
import { apiFetch } from "$lib/utils/api";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.PREPARING:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.READY:
      return "bg-orange-100 text-orange-800";
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
    case OrderStatus.READY:
      return Package;
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
      return "Хүлээгдэж буй";
    case OrderStatus.PREPARING:
      return "Бэлтгэж байна";
    case OrderStatus.READY:
      return "Хайрцагт хийгдэж байна";
    case OrderStatus.IN_BOX:
      return "Хайрцагт орсон";
    case OrderStatus.DONE:
      return "Дууссан";
    case OrderStatus.CANCELLED:
      return "Цуцлагдсан";
    default:
      return status;
  }
}

export function getOrderTypeLabel(type: OrderType): string {
  switch (type) {
    case OrderType.DINE_IN:
      return "Газар дээр идэх";
    case OrderType.TAKE_OUT:
      return "Авч явах";
    default:
      return type;
  }
}

export function getDateRangeLabel(range: string): string {
  switch (range) {
    case "today":
      return "Өнөөдөр";
    case "yesterday":
      return "Өчигдөр";
    case "last_7_days":
      return "Сүүлийн 7 хоног";
    case "last_30_days":
      return "Сүүлийн 30 хоног";
    case "this_week":
      return "Энэ долоо хоног";
    case "this_month":
      return "Энэ сар";
    case "last_week":
      return "Өнгөрсөн долоо хоног";
    case "last_month":
      return "Өнгөрсөн сар";
    default:
      return "Бүх хугацаа";
  }
}


export async function fetchOrders(params: {
  user?: string;
  phone?: string;
  selectedStatus?: string;
  selectedOrderType?: string;
  selectedDateRange?: string;
  currentPage?: number;
}) {
  const queryParams = new URLSearchParams();

  if (params.user && params.user.trim()) queryParams.append("user", params.user.trim());
  if (params.phone && params.phone.trim()) queryParams.append("phone", params.phone.trim());
  if (params.selectedStatus && params.selectedStatus.trim()) queryParams.append("order_status", params.selectedStatus);
  if (params.selectedOrderType && params.selectedOrderType.trim()) queryParams.append("order_type", params.selectedOrderType);
  if (params.selectedDateRange && params.selectedDateRange.trim()) queryParams.append("date_range", params.selectedDateRange);
  if (params.currentPage && params.currentPage > 1) {
    queryParams.append("page", params.currentPage.toString());
  }

  const url = `${PUBLIC_BACKEND_URL}/api/order/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  console.log('Fetching orders from URL:', url);
  console.log('Query params:', queryParams.toString());

  try {
    const data = await apiFetch(url);
    return data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
}