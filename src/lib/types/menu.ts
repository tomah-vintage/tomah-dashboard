export interface MenuItem {
  id: number;
  name: string;
  image: string;
  category: string;
  price: string;
  status: string;
}

export interface MenuItemFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  code: string;
  // image: File; // handle file later
}
