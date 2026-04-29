export interface Category {
  id: number;
  name: string;
  restaurant: string;
  order_index: number;
  checked?: boolean;
  menu_item_count?: number;
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