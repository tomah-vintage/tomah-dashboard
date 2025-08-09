export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'MAIN_ADMIN' | 'RESTAURANT_ADMIN';
}

export type Permission = 'view-dashboard' | 'manage-restaurants' | 'edit-menus' | 'view-seating-charts';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: Permission[];
}

export interface Session {
  user: User | null;
  accessToken: string | null;
}