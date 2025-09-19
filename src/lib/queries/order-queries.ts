import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Order, OrderListResponse, OrderFilters, OrderStatus, DateRange } from '$lib/types/order';

export function createGetOrdersQuery(filters: OrderFilters = {}) {
	const queryParams = new URLSearchParams();
	
	if (filters.restaurant) queryParams.append('restaurant', filters.restaurant);
	if (filters.user) queryParams.append('user', filters.user);
	if (filters.order_status) queryParams.append('order_status', filters.order_status);
	if (filters.order_type) queryParams.append('order_type', filters.order_type);
	if (filters.created_at__gte) queryParams.append('created_at__gte', filters.created_at__gte);
	if (filters.created_at__lte) queryParams.append('created_at__lte', filters.created_at__lte);
	if (filters.date_range) queryParams.append('date_range', filters.date_range);
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