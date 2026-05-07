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

// Credit Log Types
export type CreditLogType = 'Top-up' | 'Design Generation' | 'Refund';
export type CreditLogStatus = 'Success' | 'Failed' | 'Pending';

export interface CreditLog {
  id: string;
  transactionId: string;
  userId: string;
  userEmail: string;
  type: CreditLogType;
  amount: number;
  status: CreditLogStatus;
  timestamp: string;
  description?: string;
}

export interface CreditLogResponse {
  logs: CreditLog[];
  total: number;
  totalCreditsIssued: number;
  totalCreditsUsedToday: number;
}

export interface CreditLogFilters {
  search?: string;
  type?: CreditLogType;
  page?: number;
  limit?: number;
}

// System Settings Types
export interface SystemConfig {
  id: string;
  aiModel: {
    apiKey: string;
    version: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'claude-2';
    maintenanceMode: boolean;
  };
  pricing: {
    creditPrice: number;
    creditsPerGeneration: number;
  };
  security: {
    emailVerificationRequired: boolean;
    newUserBonusCredits: number;
  };
  updatedAt: string;
  updatedBy: string;
}

export interface SystemConfigUpdate {
  aiModel?: {
    apiKey?: string;
    version?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'claude-2';
    maintenanceMode?: boolean;
  };
  pricing?: {
    creditPrice?: number;
    creditsPerGeneration?: number;
  };
  security?: {
    emailVerificationRequired?: boolean;
    newUserBonusCredits?: number;
  };
}

export interface SystemConfigResponse {
  success: boolean;
  data: SystemConfig;
  message?: string;
}
