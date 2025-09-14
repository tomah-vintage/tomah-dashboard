import type { MenuItem } from "$lib/types/menu";

export function getMenuItemStatusText(isAvailable: boolean): string {
  return isAvailable ? "Идэвхтэй" : "Идэвхгүй";
}

export function getMenuItemStatusClass(isAvailable: boolean): string {
  return isAvailable ? "text-status-success" : "text-status-error";
}

export function formatMenuItemPrice(price: number): string {
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: 'MNT',
    minimumFractionDigits: 0,
  }).format(price);
}

export function getMenuItemImageUrl(item: MenuItem): string | null {
  return item.img_urls && item.img_urls.length > 0 ? item.img_urls[0] : null;
}

export function getCategoriesText(categories: string[]): string {
  return categories.join(", ");
}

export function validateMenuItemForm(formData: any): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.name?.trim()) {
    errors.name = "Нэр заавал бөглөх ёстой";
  }

  if (!formData.price || formData.price <= 0) {
    errors.price = "Үнэ 0-с их байх ёстой";
  }

  if (!formData.categories || formData.categories.length === 0) {
    errors.categories = "Ангилал сонгох ёстой";
  }

  return errors;
}

export function createMenuItemSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9а-я\u0430-\u044f]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}