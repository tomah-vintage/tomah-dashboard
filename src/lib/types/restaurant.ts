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

// New types for admin restaurant endpoints
export interface AdminRestaurantUser {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	profile_img: string;
	created_at: string;
	updated_at?: string;
	last_login: string;
	is_active: boolean;
}

export interface RestaurantHighlight {
	id: number;
	name: string;
	display_name: string;
	highlight_type: string;
	color: string;
	icon?: string;
}

// Subscription types
export interface SubscriptionPlan {
	id: number;
	name: string;
	description: string;
	price: number;
	interval: string;
	is_active: boolean;
}

export interface PaymentSummary {
	total_paid: number;
	outstanding_amount: number;
	overdue_invoices_count: number;
}

export interface SubscriptionInvoice {
	id: number;
	invoice_number: string;
	amount_due: number;
	amount_paid: number;
	due_date: string;
	status: string;
	is_overdue: boolean;
}

export interface RestaurantSubscription {
	id: number;
	status: string;
	plan: SubscriptionPlan;
	start_date: string;
	end_date: string;
	renewal_date: string;
	trial_end: string | null;
	cancel_at_period_end: boolean;
	canceled_at: string | null;
	days_until_expiry: number;
	is_expired: boolean;
	is_due_soon: boolean;
	payment_summary: PaymentSummary;
	latest_invoice: SubscriptionInvoice | null;
	invoice_history: SubscriptionInvoice[];
}

// Separate type for list API which has different subscription structure
export interface RestaurantSubscriptionList {
	id: number;
	status: string;
	plan_name: string;
	plan_price: number;
	plan_interval: string;
	start_date: string;
	end_date: string;
	renewal_date: string;
	trial_end: string | null;
	cancel_at_period_end: boolean;
	canceled_at: string | null;
	days_until_expiry: number;
	is_expired: boolean;
	is_due_soon: boolean;
	latest_invoice: SubscriptionInvoice | null;
}

export interface AdminRestaurantListItem {
	id: number;
	name: string;
	logo: string;
	address: string;
	latitude: string | null;
	longitude: string | null;
	created_at: string;
	updated_at: string;
	user_count: number;
	total_orders: number;
	total_revenue: number;
	average_rating: number;
	subscription: RestaurantSubscriptionList;
	admin_users: AdminRestaurantUser[];
	highlights: RestaurantHighlight[];
}

export interface RestaurantOrderInsights {
	total_orders: number;
	total_revenue: string;
	pending_orders: number;
	completed_orders: number;
	cancelled_orders: number;
	average_order_value: string;
}

export interface RestaurantReviewInsights {
	total_reviews: number;
	average_rating: number;
}

export interface RestaurantInsights {
	orders: RestaurantOrderInsights;
	reviews: RestaurantReviewInsights;
	menu_items_count: number;
	tables_count: number;
}

export interface RecentOrderCustomer {
	id: number;
	name: string;
	email: string;
}

export interface RestaurantRecentOrder {
	id: number;
	total_price: string;
	order_status: string;
	order_type: string;
	created_at: string;
	customer: RecentOrderCustomer;
}

export interface AdminRestaurantDetail {
	id: number;
	name: string;
	logo: string;
	address: string;
	latitude: string | null;
	longitude: string | null;
	restaurant_img_urls: string[];
	created_at: string;
	updated_at: string;
	subscription: RestaurantSubscription;
	admin_users: AdminRestaurantUser[];
	highlights: RestaurantHighlight[];
	insights: RestaurantInsights;
	recent_orders: RestaurantRecentOrder[];
}

export interface AdminRestaurantListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: AdminRestaurantListItem[];
}

// User management types
export interface AddUserToRestaurantData {
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
	password: string;
	role: number;
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