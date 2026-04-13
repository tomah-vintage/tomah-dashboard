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
  status: "active" | "inactive";
  created_at: string;
  restaurant_img_urls?: string[]; // Optional array of image URLs
  latitude: number; // Added
  longitude: number; // Added
  open_hours: FormattedDailyHours[]; // Added
  user?: User; // Added, assuming User type exists
  bonum_api_key?: string; // Bonum Terminal ID (read-only from API)
  takeout_container_price?: string; // Food container/packaging fee for takeout
  // EBARIMT VAT Receipt fields
  restaurant_tin?: string; // Restaurant's own TIN for merchant registration
  merchant_tin?: string; // Merchant TIN for receipts
  district_code?: string; // District code for VAT receipts (4 digits)
  ebarimt_enabled?: boolean; // Enable/disable VAT receipt integration
  merchant_registered?: boolean; // Whether merchant is registered in PosAPI (read-only)
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
  invoice_history?: SubscriptionInvoice[];
  recent_invoices?: SubscriptionInvoice[];
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
  status: "active" | "inactive";
}

// Extended type for restaurant settings updates (PATCH endpoint)
export interface RestaurantSettingsData {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  cuisine_type?: string;
  open_hours?: string;
  delivery_fee?: number;
  minimum_order?: number;
  estimated_delivery_time?: number;
  takeout_container_price?: string; // Food container/packaging fee for takeout
  is_active?: boolean;
  logo_url?: string;
  cover_image_url?: string;
  bonum_api_key?: string; // Bonum Terminal ID (can be updated)
  bonum_secret_key?: string; // Bonum App Secret (write-only, never returned)
  // Note: EBARIMT fields are managed via dedicated /ebarimt-config/ endpoint
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

// Types for restaurant admin my-subscription endpoint
export interface MySubscriptionResponse {
  subscription: RestaurantSubscription | null;
  message?: string;
}

// EBARIMT Configuration Types
export interface EbarimtConfig {
  id: number;
  name: string; // Restaurant name (read-only)
  restaurant_tin: string;
  district_code: string;
  ebarimt_enabled: boolean;
  merchant_registered: boolean; // Read-only, set by backend
  restaurant_status?: boolean; // Read-only, whether merchant was accepted by EBARIMT service
  serves_alcohol: boolean;
}

export interface EbarimtConfigUpdate {
  restaurant_tin?: string;
  district_code?: string;
  ebarimt_enabled?: boolean;
  serves_alcohol?: boolean;
}

export interface EbarimtStatusResponse {
  success: boolean;
  registered: boolean;
  restaurant_tin: string;
  message: string;
}

// VAT Receipt Types
export type VatReceiptStatus = "pending" | "created" | "failed" | "cancelled" | "returned";
export type VatReceiptType = "B2C" | "B2B" | "RETURN";

export interface VatReceipt {
  id: number;
  receipt_id: string | null;
  bill_id: string | null;
  status: VatReceiptStatus;
  receipt_type: VatReceiptType;
  customer_tin: string | null;
  consumer_no: string | null;
  error_message: string | null;
  retry_count: number;
  return_receipt_id: string | null;
  return_bill_id: string | null;
  return_created_at: string | null;
  created_at: string;
  updated_at: string;
  receipt_date: string | null;
  order_id: number;
  order_code: string | null;
  order_total: string;
  restaurant_name: string;
}

export interface VatReceiptSummary {
  total: number;
  pending: number;
  created: number;
  failed: number;
  cancelled: number;
}

export interface VatReceiptsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VatReceipt[];
}
