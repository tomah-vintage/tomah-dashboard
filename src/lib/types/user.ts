export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  orderCount: number;
}

export interface OrderHistoryItem {
  orderId: string;
  date: string;
  restaurantName: string;
  totalAmount: number;
  status: 'Completed' | 'Cancelled';
}