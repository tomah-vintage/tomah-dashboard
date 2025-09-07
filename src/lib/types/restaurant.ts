import type { User } from "./user";

/**
 * @file Defines the core types for the Restaurant Management feature.
 */

export interface Restaurant {
	id: string;
	name: string;
	logo_url: string; // Renamed from 'logo'
	address: string;
	phone: string;
	email: string;
	status: 'active' | 'inactive';
	created_at: string;
	restaurant_img_urls?: string[]; // Optional array of image URLs
	latitude: number; // Added
	longitude: number; // Added
	open_hours: FormattedDailyHours[]; // Added
	user?: User; // Added, assuming User type exists
}

export interface Menu {
	id: string;
	restaurantId: string;
	name: string;
}

export interface MenuItem {
	id: string;
	menuId: string;
	name: string;
	description: string;
	price: number;
}

export interface RestaurantFormData {
	name: string;
	address: string;
	phone: string;
	email: string;
	status: 'active' | 'inactive';
}

export interface DailyHours {
  open: string; // e.g., "09:00"
  close: string; // e.g., "17:00"
}

export type OpeningHours = {
  [key: string]: DailyHours[]; // e.g., { "monday": [{ open: "09:00 AM", close: "05:00 PM" }], "tuesday": [] }
};

export interface FormattedDailyHours {
  day_of_week: number;
  opening_time: string;
  closing_time: string;
}

export interface NewRestaurantFormData {
	name: string;
	address: string;
	phone: string;
	email: string;
	logo_file: File | undefined;
	latitude: number;
	longitude: number;
	open_hours: FormattedDailyHours[];
	first_name: string;
	last_name: string;
	password: string;
	role: number;
}