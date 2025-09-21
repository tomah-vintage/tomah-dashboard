import { z } from 'zod';
import type { DefaultCategory, DefaultCategoryForm } from '$lib/types/category';

/**
 * Validation schema for default category form
 */
export const defaultCategoryFormSchema = z.object({
  name: z.string().min(1, { message: 'Англи нэр шаардлагатай' }),
  mongolian_name: z.string().min(1, { message: 'Монгол нэр шаардлагатай' }),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal(''))
});

/**
 * Creates an empty default category form
 */
export function createEmptyDefaultCategoryForm(): DefaultCategoryForm {
  return {
    name: '',
    mongolian_name: '',
    description: '',
    image_url: ''
  };
}

/**
 * Converts a default category to form data
 */
export function categoryToFormData(category: DefaultCategory): DefaultCategoryForm {
  return {
    name: category.name,
    mongolian_name: category.mongolian_name || '',
    description: category.description || '',
    image_url: category.image_url || ''
  };
}

/**
 * Filters categories based on search value
 */
export function filterCategories(categories: DefaultCategory[], searchValue: string): DefaultCategory[] {
  if (!searchValue.trim()) return categories;
  
  const lowerSearch = searchValue.toLowerCase();
  return categories.filter(category =>
    category.name.toLowerCase().includes(lowerSearch) ||
    (category.mongolian_name && category.mongolian_name.toLowerCase().includes(lowerSearch)) ||
    (category.description && category.description.toLowerCase().includes(lowerSearch))
  );
}

/**
 * Formats date for display
 */
export function formatDisplayDate(dateString?: string): string {
  if (!dateString) return 'Тодорхойгүй';
  return new Date(dateString).toLocaleDateString();
}