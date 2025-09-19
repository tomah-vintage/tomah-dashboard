export interface OrderInsights {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  average_order_value: number;
  orders_by_type: Record<string, number>;
  orders_by_status: Record<string, number>;
  revenue_growth_percentage: number;
  order_growth_percentage: number;
  customer_growth_percentage: number;
}

export interface ReviewInsights {
  total_reviews: number;
  average_rating: number;
  reviews_by_rating: Record<number, number>;
  reviews_by_type: Record<string, number>;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  order_count: number;
}

export interface TopMenuItem {
  item_name: string;
  item_image: string;
  total_orders: number;
  restaurant_name: string;
}

export interface TopCustomer {
  user_id: number;
  name: string;
  email: string;
  avatar: string;
  total_orders: number;
  total_spent: number;
  favorite_restaurant: string;
}

export interface RestaurantRanking {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_logo: string;
  total_revenue: number;
  total_orders: number;
  average_rating: number;
  revenue_percentage: number;
}

export interface RestaurantInsights {
  restaurant_id: number;
  restaurant_name: string;
  order_insights: OrderInsights;
  review_insights: ReviewInsights;
  time_series_data: TimeSeriesData[];
  top_menu_items: TopMenuItem[];
  top_customers: TopCustomer[];
}

export interface PlatformInsights {
  total_restaurants: number;
  platform_order_insights: OrderInsights;
  platform_review_insights: ReviewInsights;
  restaurant_rankings: RestaurantRanking[];
  time_series_data: TimeSeriesData[];
  top_menu_items: TopMenuItem[];
  top_customers: TopCustomer[];
}

export interface InsightsFilters {
  days?: number;
}