export interface Category {
  id: number;
  name: string;
  restaurant: string;
  checked?: boolean; // Optional, as it's for UI state
  menu_item_count?: number; // Optional, for product count
}

export interface MenuItemVariant {
	id?: number;
	name: string;
	price: number;
	is_default?: boolean;
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
		variants?: MenuItemVariant[];
		has_variants?: boolean;
	};
	is_available: boolean;
	is_emphasized?: boolean;
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
		variants: MenuItemVariant[];
		has_variants: boolean;
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
		variants?: MenuItemVariant[];
		has_variants: boolean;
	};
	img_urls: string[];
	restaurant: number;
}
