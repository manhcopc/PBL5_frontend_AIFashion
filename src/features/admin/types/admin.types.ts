export interface AdminUser {
  id: string;
  email: string;
  username: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  creditsRemaining: number;
  joinDate: string;
  avatar?: string;
  isActive: boolean;
}

export interface AdminStats {
  totalUsers: number;
  userGrowth: number;
  totalCreditsSold: number;
  successRate: number;
  activeGenerations: number;
}

export interface TopUpRequest {
  userId: string;
  amount: number;
}

export interface PlanChangeRequest {
  userId: string;
  newPlan: 'Free' | 'Pro' | 'Enterprise';
}

export interface AdminUserResponse extends AdminUser {
  createdAt: string;
  lastActive: string;
}
