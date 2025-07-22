export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: 'MAIN_ADMIN' | 'RESTAURANT_ADMIN';
}
