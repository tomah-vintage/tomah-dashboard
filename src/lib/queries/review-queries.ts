import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Review } from '$lib/types/review';

export interface ReviewsResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Review[];
}

export interface ReviewFilters {
	page?: number;
	pageSize?: number;
	search?: string;
	reviewType?: string;
	rating?: string;
	restaurant?: string;
}

export const reviewQueries = {
	getReviews: (filters: ReviewFilters = {}) => ({
		queryKey: ['reviews', filters],
		queryFn: async (): Promise<ReviewsResponse> => {
			const params = new URLSearchParams();
			
			if (filters.page) params.append('page', filters.page.toString());
			if (filters.pageSize) params.append('page_size', filters.pageSize.toString());
			if (filters.search) params.append('search', filters.search);
			if (filters.reviewType) params.append('review_type', filters.reviewType);
			if (filters.rating) params.append('rating', filters.rating);
			if (filters.restaurant) params.append('restaurant', filters.restaurant);

			return apiFetch<ReviewsResponse>(`${PUBLIC_BACKEND_URL}/api/review/?${params.toString()}`);
		}
	}),

	getReview: (id: string) => ({
		queryKey: ['reviews', id],
		queryFn: async (): Promise<Review> => {
			return apiFetch<Review>(`${PUBLIC_BACKEND_URL}/api/review/${id}/`);
		}
	}),

};