export type ReviewType = 'SERVICE' | 'TASTE' | 'ENVIRONMENT';

export interface Review {
	id: string;
	restaurant: {
		id: string;
		name: string;
		slug?: string;
	};
	user: {
		id: string;
		firstName: string;
		lastName: string;
		email?: string;
	};
	rating: number;
	comment: string;
	reviewType: ReviewType;
	createdAt: string;
	updatedAt?: string;
}

export interface ReviewStats {
	totalReviews: number;
	averageRating: number;
	ratingDistribution: {
		1: number;
		2: number;
		3: number;
		4: number;
		5: number;
	};
	typeDistribution: {
		SERVICE: number;
		TASTE: number;
		ENVIRONMENT: number;
	};
}