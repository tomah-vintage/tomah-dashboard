export interface Category {
  id: number;
  name: string;
  restaurant: string,
  checked?: boolean; // Optional, as it's for UI state
  count?: number; // Optional, for product count
}