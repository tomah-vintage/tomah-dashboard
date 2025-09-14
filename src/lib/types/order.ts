export interface Order {
	id: string;
	user: {
		id: string;
		first_name: string;
		last_name: string;
		email: string;
		phone?: string;
	};
	restaurant: {
		id: string;
		name: string;
	};
	order_status: OrderStatus;
	total_price: string;
	table?: {
		id: string;
		table_number: string;
	};
	box?: {
		id: string;
		box_number: string;
	};
	order_type: OrderType;
	created_at: string;
	updated_at: string;
	items: OrderItem[];
	payments?: OrderPayment[];
}

export interface OrderItem {
	id: string;
	menu_item: {
		id: string;
		name: string;
		price: string;
		image_url?: string;
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
	status?: OrderStatus;
	order_type?: OrderType;
	date_from?: string;
	date_to?: string;
	search?: string;
	page?: number;
	page_size?: number;
}

export interface OrderListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Order[];
}