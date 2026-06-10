export interface User {
  id: string;
  email: string;
  username?: string;
  company_name?: string | null;
  available_credits: number;
  role: string;
  created_at?: string;
}

export type LoginRequest = Pick<User, 'email'> & { 
  password: string; 
};

export interface RegisterRequest {
  email: string;
  username: string;
  role: string;
  password: string; 
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type RegisterResponse = User;
