export interface Order {
	id: number;
	user: number; // Just the user ID
	restaurant: number; // Just the restaurant ID
	order_status: OrderStatus;
	total_price: string;
	table?: {
		id: string;
		table_number: string;
	} | null;
	box?: {
		id: string;
		box_number: string;
	} | null;
	order_type: OrderType;
	created_at: string;
	updated_at: string;
	items: OrderItem[];
	payments?: OrderPayment[];
}

export interface OrderItem {
	menu_item: {
		id: number;
		name: string;
		price: string;
		img_urls: string[];
		description: string;
		meta_data: any;
		is_available: boolean;
		is_emphasized: boolean;
		created_at: string;
		updated_at: string;
		restaurant: number;
		categories: number[];
	};
	quantity: number;
	unit_price: string;
}

export interface OrderPayment {
	id: string;
	amount: string;
	status: PaymentStatus;
	payment_method?: {
		id: string;
		name: string;
	};
	paid_at?: string;
}

export enum OrderStatus {
	PENDING = 'PENDING',
	PREPARING = 'PREPARING',
	CANCELLED = 'CANCELLED',
	IN_BOX = 'IN_BOX',
	DONE = 'DONE'
}

export enum OrderType {
	DINE_IN = 'DINE_IN',
	TAKE_OUT = 'TAKE_OUT'
}

export enum PaymentStatus {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED'
}

export interface OrderFilters {
	restaurant?: string;
	user?: string;
	order_status?: OrderStatus;
	order_type?: OrderType;
	created_at__gte?: string;
	created_at__lte?: string;
	date_range?: DateRange;
	search?: string;
	page?: number;
	page_size?: number;
}

export enum DateRange {
	TODAY = 'today',
	YESTERDAY = 'yesterday',
	LAST_7_DAYS = 'last_7_days',
	LAST_30_DAYS = 'last_30_days',
	THIS_WEEK = 'this_week',
	THIS_MONTH = 'this_month',
	LAST_WEEK = 'last_week',
	LAST_MONTH = 'last_month'
}

export interface OrderListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Order[];
}