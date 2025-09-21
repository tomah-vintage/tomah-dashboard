export interface Category {
  id: number;
  name: string;
  restaurant: string,
  checked?: boolean; // Optional, as it's for UI state
  menu_item_count?: number; // Optional, for product count
}

export interface DefaultCategory {
  id: number;
  name: string;
  mongolian_name?: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DefaultCategoryForm {
  name: string;
  mongolian_name?: string;
  description?: string;
  image_url?: string;
}