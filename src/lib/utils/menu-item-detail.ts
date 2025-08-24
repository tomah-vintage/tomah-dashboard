import type { MenuItemDetailFormData } from "$lib/types/menu-item-detail";
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const validateMenuItemDetailFormData = (data: MenuItemDetailFormData): string | null => {
  if (!data.name || data.name.trim() === "") {
    return "Хоолны нэр заавал оруулна.";
  }
  if (!data.description || data.description.trim() === "") {
    return "Тайлбар заавал оруулна.";
  }
  if (data.price === undefined || data.price <= 0) {
    return "Үнэ эерэг тоо байх ёстой.";
  }
  if (!data.categories || data.categories.length === 0) {
    return "Ядаж нэг ангилал заавал оруулна.";
  }
  if (!data.code || data.code.trim() === "") {
    return "Код заавал оруулна.";
  }

  // Validate variants
  for (const variant of data.variants) {
    if (!variant.option || variant.option.trim() === "") {
      return "Хувилбарын сонголт хоосон байж болохгүй.";
    }
    if (!variant.size || variant.size.trim() === "") {
      return "Хувилбарын хэмжээ хоосон байж болохгүй.";
    }
    if (variant.price === undefined || variant.price <= 0) {
      return "Хувилбарын үнэ эерэг тоо байх ёстой.";
    }
  }

  return null; // No errors
};

export const apiEndpoints = {
  getMenuItem: (id: number) => `${PUBLIC_BACKEND_URL}/api/menu-item/${id}/`,
  updateMenuItem: (id: number) => `${PUBLIC_BACKEND_URL}/api/menu-item/${id}/`,
};
