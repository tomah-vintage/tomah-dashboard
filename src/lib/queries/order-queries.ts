import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Order, OrderListResponse, OrderFilters, OrderStatus } from '$lib/types/order';

export function createGetOrdersQuery(filters: OrderFilters = {}) {
	const queryParams = new URLSearchParams();
	
	if (filters.status) queryParams.append('status', filters.status);
	if (filters.order_type) queryParams.append('order_type', filters.order_type);
	if (filters.date_from) queryParams.append('date_from', filters.date_from);
	if (filters.date_to) queryParams.append('date_to', filters.date_to);
	if (filters.search) queryParams.append('search', filters.search);
	if (filters.page) queryParams.append('page', filters.page.toString());
	if (filters.page_size) queryParams.append('page_size', filters.page_size.toString());

	const url = `${PUBLIC_BACKEND_URL}/api/order/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

	return createQuery({
		queryKey: ['orders', filters],
		queryFn: (): Promise<OrderListResponse> => apiFetch(url, {}, 'json')
	});
}

export function createGetOrderQuery(orderId: string) {
	return createQuery({
		queryKey: ['orders', orderId],
		queryFn: (): Promise<Order> => apiFetch(`${PUBLIC_BACKEND_URL}/api/order/${orderId}/`, {}, 'json'),
		enabled: !!orderId
	});
}

export function createUpdateOrderStatusMutation() {
	const queryClient = useQueryClient();
	
	return createMutation({
		mutationFn: (data: { id: string; status: OrderStatus }) =>
			apiFetch(`${PUBLIC_BACKEND_URL}/api/order/${data.id}/`, {
				method: 'PATCH',
				body: JSON.stringify({ order_status: data.status })
			}, 'json'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		}
	});
}

export function createCancelOrderMutation() {
	const queryClient = useQueryClient();
	
	return createMutation({
		mutationFn: (orderId: string) =>
			apiFetch(`${PUBLIC_BACKEND_URL}/api/order/${orderId}/`, {
				method: 'PATCH',
				body: JSON.stringify({ order_status: 'CANCELLED' })
			}, 'json'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		}
	});
}