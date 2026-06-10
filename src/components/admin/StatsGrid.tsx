import { Users, TrendingUp, Zap, Activity } from "lucide-react";
import { formatCredits } from "@/mappers/adminMapper";
import type { AdminStats } from "@/features/admin/types/admin.types";

interface StatsGridProps {
  stats: AdminStats | null;
  isLoading: boolean;
}

export const StatsGrid = ({ stats, isLoading }: StatsGridProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200 rounded-xl p-6 animate-pulse shadow-sm"
          >
            <div className="h-4 bg-zinc-100 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-zinc-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      change: `+${stats.userGrowth}% this month`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-white border-zinc-200",
    },
    {
      title: "Total Credits Sold",
      value: formatCredits(stats.totalCreditsSold),
      change: "This month",
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-white border-zinc-200",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: "All time",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-white border-zinc-200",
    },
    {
      title: "Active Generations",
      value: stats.activeGenerations.toString(),
      change: "Running now",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-white border-zinc-200",
      pulse: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`border rounded-xl p-6 transition-all shadow-sm ${card.bgColor} ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-500">
                {card.title}
              </h3>
              <div
                className={`p-2 bg-zinc-50 rounded-lg ${
                  card.pulse ? "animate-pulse" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
              <p className="text-xs text-zinc-500">{card.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
