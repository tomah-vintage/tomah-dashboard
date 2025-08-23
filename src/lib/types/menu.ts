export interface Category {
  id: number;
  name: string;
}

export interface MenuItem {
	id: number;
	name: string;
	price: string;
	img_urls: string[];
	description: string;
	meta_data: {
		calories: string;
		ingredients: string[];
	};
	is_available: boolean;
	created_at: string;
	updated_at: string;
	restaurant: number;
	categories: number[];
}

export interface MenuItemFormData {
	name: string;
	description: string;
	price: number;
	categories: number[];
	is_available: boolean;
	meta_data: {
		calories: number;
		ingredients: string[];
	};
	img_urls: File[];
}

export interface MenuItemFormForBackend {
	name: string;
	description: string;
	price: number;
	categories: number[];
	is_available: boolean;
	meta_data: {
		calories: number;
		ingredients: string[];
	};
	img_urls: string[];
	restaurant: number;
}
