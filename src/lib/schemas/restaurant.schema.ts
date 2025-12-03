import { z } from 'zod';

/**
 * Restaurant opening hours schema
 */
export const openingHoursSchema = z.object({
  day: z.number().int().min(0).max(6), // 0 = Sunday, 6 = Saturday
  open_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  close_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  is_closed: z.boolean().default(false),
});

export type OpeningHoursInput = z.infer<typeof openingHoursSchema>;

/**
 * Restaurant location schema
 */
export const restaurantLocationSchema = z.object({
  latitude: z.number().min(-90).max(90).finite(),
  longitude: z.number().min(-180).max(180).finite(),
});

export type RestaurantLocationInput = z.infer<typeof restaurantLocationSchema>;

/**
 * Restaurant create/update schema
 */
export const restaurantSchema = z.object({
  name: z
    .string()
    .min(1, 'Restaurant name is required')
    .max(200, 'Restaurant name too long')
    .trim(),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(500, 'Address too long')
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(2000, 'Description too long')
    .optional()
    .default(''),
  website: z
    .string()
    .url('Invalid website URL')
    .max(500, 'Website URL too long')
    .optional()
    .or(z.literal('')),
  opening_hours: z
    .array(openingHoursSchema)
    .max(7, 'Maximum 7 days')
    .optional()
    .default([]),
  location: restaurantLocationSchema.optional(),
  delivery_fee: z
    .number()
    .min(0, 'Delivery fee cannot be negative')
    .max(100000, 'Delivery fee too high')
    .optional(),
  min_order_amount: z
    .number()
    .min(0, 'Minimum order amount cannot be negative')
    .max(1000000, 'Minimum order amount too high')
    .optional(),
  is_active: z.boolean().default(true),
});

export type RestaurantInput = z.infer<typeof restaurantSchema>;

/**
 * Restaurant settings schema
 */
export const restaurantSettingsSchema = z.object({
  enable_delivery: z.boolean().default(false),
  enable_pickup: z.boolean().default(true),
  enable_dine_in: z.boolean().default(true),
  enable_reservations: z.boolean().default(false),
  tax_rate: z
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate too high')
    .optional(),
  service_charge: z
    .number()
    .min(0, 'Service charge cannot be negative')
    .max(100, 'Service charge too high')
    .optional(),
  auto_accept_orders: z.boolean().default(false),
  preparation_time_minutes: z
    .number()
    .int()
    .min(0, 'Preparation time cannot be negative')
    .max(300, 'Preparation time too long')
    .optional(),
});

export type RestaurantSettingsInput = z.infer<typeof restaurantSettingsSchema>;

/**
 * Staff/User invitation schema
 */
export const staffInvitationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email too long')
    .trim()
    .toLowerCase(),
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name too long')
    .trim(),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name too long')
    .trim(),
  role: z.number().int().positive('Invalid role'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
});

export type StaffInvitationInput = z.infer<typeof staffInvitationSchema>;
