export interface AdminStatsApiResponse {
  total_users: number;
  userGrowth: {
    datetime: string;
    total: number;
  }[];
  totalCreditsSold: number;
  successRate: number;
  activeGenerations: number;
}
