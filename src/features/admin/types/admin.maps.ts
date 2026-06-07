import type { AdminStatsApiResponse } from "./admin.response";
import type { AdminStats } from "./admin.types";

export const mapAdminStats = (data: AdminStatsApiResponse): AdminStats => {
  const growthList = data.userGrowth ?? [];

  const currentMonth = growthList[growthList.length - 1]?.total ?? 0;
  const previousMonth = growthList[growthList.length - 2]?.total ?? 0;

  let growthPercent = 0;

  if (previousMonth > 0) {
    growthPercent = Math.round(
      ((currentMonth - previousMonth) / previousMonth) * 100
    );
  } else if (currentMonth > 0) {
    growthPercent = 100;
  }

  return {
    totalUsers: data.total_users ?? 0,
    userGrowth: growthPercent ?? 0,
    totalCreditsSold: data.totalCreditsSold ?? 0,
    successRate: data.successRate ?? 0,
    activeGenerations: data.activeGenerations ?? 0,
  };
};
