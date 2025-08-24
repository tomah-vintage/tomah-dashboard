import type { MenuItem, MenuItemFormData as BaseMenuItemFormData } from './menu';
import type { Category } from './category';

export interface MenuItemVariant {
  id?: number; // Optional for new variants
  option: string; // e.g., "Жижиг", "Нимгэн"
  size: string; // e.g., "25см"
  price: number;
}

export interface MenuItemDetail extends MenuItem {
  code: string;
  variants: MenuItemVariant[];
  category?: Category; // For display purposes, will be converted from categories: number[]
}

export interface MenuItemDetailFormData extends BaseMenuItemFormData {
  code: string;
  variants: MenuItemVariant[];
}
