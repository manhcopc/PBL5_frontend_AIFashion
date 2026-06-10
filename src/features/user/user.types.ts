export interface User {
  _id: string;
  username: string;
  email: string;
  company_name?: string;
  available_credits: number;
  role: string;
  created_at: string;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  role: string;
  password?: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  role?: string;
  available_credits?: number;
}

export interface UpdateUserProfilePayload {
  username: string;
  email: string;
}
