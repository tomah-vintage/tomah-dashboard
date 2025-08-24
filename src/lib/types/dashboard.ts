export interface DashboardHeaderCardData {
  title: string;
  value: number;
  percentageChange: number;
  isPositive: boolean;
  icon: string; // Lucide icon name
}

export interface SalesChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

export interface OrderItem {
  id: number;
  name: string;
  restaurant: string;
  orderCount: number;
  imageUrl: string;
}

export interface RestaurantPerformanceData {
  name: string;
  percentage: number;
  color: string;
}

export interface UserActivity {
  id: number;
  name: string;
  email: string;
  restaurant: string;
  activityCount: number;
  location: string;
  avatarUrl: string;
}
