export interface AdminUser {
  _id?: string;
  id?: string;
  email: string;
  username: string;
  available_credits?: number;
  created_at?: string;
  role?: "User" | "Admin";
  plan?: "Free" | "Pro" | "Enterprise";
  creditsRemaining?: number;
  joinDate?: string;
  avatar?: string;
  isActive?: boolean;
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
  newPlan: "Free" | "Pro" | "Enterprise";
}

export interface AdminUserResponse extends AdminUser {
  createdAt: string;
  lastActive: string;
}
//     "username": "minhph",
//     "email": "minhph@gmail.com",
//     "role": "User",
//     "_id": "69d87956bc7c7312b53f024a",
//     "available_credits": 10,
//     "created_at": "2026-04-10T04:15:18.908000"
// }

// Credit Log Types
export type CreditLogType = "Top-up" | "Design Generation" | "Refund";
export type CreditLogStatus = "Success" | "Failed" | "Pending";

export interface CreditLog {
  id: string;
  transactionId: string;
  userId: string;
  type: CreditLogType;
  amount: number;
  userEmail: string;
  status: CreditLogStatus;
  timestamp: string;
  description?: string;
}

// Response body
// Download
// {
//   "user_id": "69e514b094de292600020968",
//   "transaction_type": "TOP_UP",
//   "amount": 10,
//   "related_request_id": "6a145eb808b2ac76a5c103b8",
//   "_id": "6a145eb808b2ac76a5c103b9",
//   "created_at": "2026-05-25T14:37:44.904000"
// }

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
    version: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "claude-2";
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
    version?: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "claude-2";
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
