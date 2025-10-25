export type HighlightType = 'BADGE' | 'FEATURED';

export interface SimpleRestaurant {
	id: number;
	name: string;
	restaurant_img_urls: string[];
	average_rating?: number;
}

export interface RestaurantHighlight {
	id: number;
	name: string;
	display_name: string;
	highlight_type: HighlightType;
	color: string;
	icon?: string;
	image_url?: string;
	is_active: boolean;
	order_index: number;
	created_at: string;
	updated_at: string;
	restaurants?: SimpleRestaurant[];
}

export interface RestaurantHighlightForm {
	name: string;
	display_name: string;
	highlight_type: HighlightType;
	color: string;
	icon?: string;
	image_url?: string;
	is_active: boolean;
	order_index: number;
}