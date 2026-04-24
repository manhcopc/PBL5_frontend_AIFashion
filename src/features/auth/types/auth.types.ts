export interface User {
  id: string;
  email: string;
  username: string;      // Dữ liệu nội bộ UI dùng 'username'
  role: string;
}

export type LoginRequest = Pick<User, 'email'> & { 
  password: string; 
};

export type RegisterRequest = Omit<User, 'id'> & { 
  username: string;  // API yêu cầu 'username' thay vì 'name'
  password: string; 
};

export interface AuthResponse {
  user: User & { company_name: string, available_credits: number }; // API trả về user không có 'id'
  token: string;
}