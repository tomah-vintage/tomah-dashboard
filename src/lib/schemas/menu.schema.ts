import { z } from 'zod';

/**
 * Menu item variant schema
 */
export const menuItemVariantSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, 'Variant name is required')
    .max(100, 'Variant name too long')
    .trim(),
  price: z
    .number()
    .positive('Price must be positive')
    .max(10000000, 'Price too high')
    .finite(),
  is_default: z.boolean().optional().default(false),
});

export type MenuItemVariantInput = z.infer<typeof menuItemVariantSchema>;

/**
 * Menu item metadata schema
 */
export const menuItemMetaDataSchema = z.object({
  calories: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? val : val.toString()))
    .optional()
    .default(''),
  ingredients: z
    .array(
      z
        .string()
        .max(100, 'Ingredient name too long')
        .trim()
    )
    .max(50, 'Too many ingredients')
    .default([]),
  variants: z.array(menuItemVariantSchema).max(20, 'Too many variants').default([]),
  has_variants: z.boolean().optional().default(false),
});

export type MenuItemMetaDataInput = z.infer<typeof menuItemMetaDataSchema>;

/**
 * Menu item create/update schema
 */
export const menuItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name too long')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description too long')
    .trim()
    .optional()
    .default(''),
  price: z
    .number()
    .positive('Price must be positive')
    .max(10000000, 'Price too high')
    .finite(),
  categories: z
    .array(z.number().int().positive())
    .min(1, 'At least one category is required')
    .max(10, 'Too many categories'),
  is_available: z.boolean().default(true),
  is_emphasized: z.boolean().optional().default(false),
  meta_data: menuItemMetaDataSchema,
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;

/**
 * Menu item form data schema (includes file uploads)
 */
export const menuItemFormSchema = menuItemSchema.extend({
  img_urls: z
    .array(z.instanceof(File))
    .max(5, 'Maximum 5 images allowed')
    .optional()
    .default([]),
});

export type MenuItemFormInput = z.infer<typeof menuItemFormSchema>;

/**
 * Category schema
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name too long')
    .trim(),
  restaurant: z.string().uuid('Invalid restaurant ID').optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

/**
 * Bulk category update schema
 */
export const bulkCategoryUpdateSchema = z.object({
  categories: z.array(
    z.object({
      id: z.number().int().positive(),
      name: z
        .string()
        .min(1, 'Category name is required')
        .max(100, 'Category name too long')
        .trim(),
    })
  ).max(50, 'Too many categories to update at once'),
});

export type BulkCategoryUpdateInput = z.infer<typeof bulkCategoryUpdateSchema>;
