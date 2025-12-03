import { z } from 'zod';

/**
 * Order status enum
 */
export const orderStatusEnum = z.enum([
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'DELIVERED',
  'CANCELLED',
  'COMPLETED',
]);

export type OrderStatus = z.infer<typeof orderStatusEnum>;

/**
 * Order item schema
 */
export const orderItemSchema = z.object({
  menu_item_id: z.number().int().positive('Invalid menu item'),
  variant_id: z.number().int().positive().optional(),
  quantity: z
    .number()
    .int()
    .positive('Quantity must be positive')
    .max(100, 'Quantity too high'),
  special_instructions: z
    .string()
    .max(500, 'Special instructions too long')
    .optional()
    .default(''),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;

/**
 * Order status update schema
 */
export const orderStatusUpdateSchema = z.object({
  status: orderStatusEnum,
  notes: z
    .string()
    .max(1000, 'Notes too long')
    .optional()
    .default(''),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

/**
 * Table/seating schema
 */
export const tableSchema = z.object({
  table_number: z
    .string()
    .min(1, 'Table number is required')
    .max(50, 'Table number too long')
    .trim(),
  seats: z
    .number()
    .int()
    .positive('Number of seats must be positive')
    .max(50, 'Too many seats'),
  location: z
    .string()
    .max(100, 'Location description too long')
    .optional()
    .default(''),
  is_available: z.boolean().default(true),
});

export type TableInput = z.infer<typeof tableSchema>;

/**
 * Banner/promotion schema
 */
export const bannerSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title too long')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description too long')
    .optional()
    .default(''),
  link_url: z
    .string()
    .url('Invalid URL')
    .max(500, 'URL too long')
    .optional()
    .or(z.literal('')),
  start_date: z.string().datetime('Invalid date format'),
  end_date: z.string().datetime('Invalid date format'),
  is_active: z.boolean().default(true),
  display_order: z
    .number()
    .int()
    .min(0, 'Display order cannot be negative')
    .max(1000, 'Display order too high')
    .optional()
    .default(0),
}).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.start_date) < new Date(data.end_date);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
);

export type BannerInput = z.infer<typeof bannerSchema>;
