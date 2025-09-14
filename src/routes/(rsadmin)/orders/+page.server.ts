import type { PageServerLoad } from './$types';
import type { OrderListResponse } from '$lib/types/order';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { serverApiFetch } from '$lib/utils/api-call-for-server';

export const load: PageServerLoad = async ({ fetch: customFetch, cookies, url }) => {
	try {
		const token = cookies.get('session');

		if (!token) {
			console.error('No auth token found');
			return {
				orders: {
					count: 0,
					next: null,
					previous: null,
					results: []
				}
			};
		}

		const searchParams = url.searchParams;
		const queryParams = new URLSearchParams();

		if (searchParams.get('status')) queryParams.append('status', searchParams.get('status')!);
		if (searchParams.get('order_type')) queryParams.append('order_type', searchParams.get('order_type')!);
		if (searchParams.get('date_from')) queryParams.append('date_from', searchParams.get('date_from')!);
		if (searchParams.get('date_to')) queryParams.append('date_to', searchParams.get('date_to')!);
		if (searchParams.get('search')) queryParams.append('search', searchParams.get('search')!);
		if (searchParams.get('page')) queryParams.append('page', searchParams.get('page')!);

		const apiUrl = `${PUBLIC_BACKEND_URL}/api/order/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

		const response = await serverApiFetch(customFetch, apiUrl, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		const orders = response as unknown as OrderListResponse;

		return {
			orders
		};
	} catch (error) {
		console.error('Error loading orders:', error);
		return {
			orders: {
				count: 0,
				next: null,
				previous: null,
				results: []
			}
		};
	}
};