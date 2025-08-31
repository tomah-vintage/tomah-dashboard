export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: number;
}

export type Permission = 'create_user' |
  'read_user' |
  'update_user' |
  'delete_user' |
  'create_role' |
  'read_role' |
  'update_role' |
  'delete_role' |
  'create_permission' |
  'read_permission' |
  'update_permission' |
  'delete_permission' |
  'create_rolepermission' |
  'read_rolepermission' |
  'update_rolepermission' |
  'delete_rolepermission' |
  'create_restaurant' |
  'read_restaurant' |
  'update_restaurant' |
  'delete_restaurant' |
  'create_table' |
  'read_table' |
  'update_table' |
  'delete_table' |
  'create_boxcontainer' |
  'read_boxcontainer' |
  'update_boxcontainer' |
  'delete_boxcontainer' |
  'create_box' |
  'read_box' |
  'update_box' |
  'delete_box' |
  'create_itemcategory' |
  'read_itemcategory' |
  'update_itemcategory' |
  'delete_itemcategory' |
  'create_menuitem' |
  'read_menuitem' |
  'update_menuitem' |
  'delete_menuitem' |
  'create_paymentmethod' |
  'read_paymentmethod' |
  'update_paymentmethod' |
  'delete_paymentmethod' |
  'create_subscriptionplan' |
  'read_subscriptionplan' |
  'update_subscriptionplan' |
  'delete_subscriptionplan' |
  'create_subscription' |
  'read_subscription' |
  'update_subscription' |
  'delete_subscription' |
  'create_order' |
  'read_order' |
  'update_order' |
  'delete_order' |
  'create_orderitem' |
  'read_orderitem' |
  'update_orderitem' |
  'delete_orderitem' |
  'create_orderpayment' |
  'read_orderpayment' |
  'update_orderpayment' |
  'delete_orderpayment' |
  'create_invoice' |
  'read_invoice' |
  'update_invoice' |
  'delete_invoice'

export interface User {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: number;
  role_name: string;
  created_at: string;
  permissions: Permission[];
  restaurant: {
    id: number,
    name: string,
    logo: string,
    address: string,
    restaurant_img_urls: string[],
    created_at: string,
    updated_at: string
  }
}
export interface UserListData {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: {
    name: string;
    id: number
  }
  created_at: string;
}

export interface Session {
  user: User | null;
  accessToken: string | null;
}