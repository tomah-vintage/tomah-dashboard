export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'MAIN_ADMIN' | 'RESTAURANT_ADMIN';
}
