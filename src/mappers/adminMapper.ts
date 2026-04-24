import type { AdminUserResponse, AdminUser } from '@/features/admin/types/admin.types';

/**
 * Transform backend user data to frontend display format
 */
export const mapAdminUserToDisplay = (user: AdminUserResponse): AdminUser => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    plan: user.plan,
    creditsRemaining: user.creditsRemaining,
    joinDate: formatDate(user.joinDate),
    avatar: user.avatar || generateAvatarUrl(user.email),
    isActive: user.isActive,
  };
};

/**
 * Transform array of backend users to display format
 */
export const mapAdminUsersToDisplay = (users: AdminUserResponse[]): AdminUser[] => {
  return users.map(mapAdminUserToDisplay);
};

/**
 * Generate avatar URL from email (using gravatar or initials)
 */
export const generateAvatarUrl = (email: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
};

/**
 * Format date string to readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Get plan badge color based on plan type
 */
export const getPlanColor = (plan: 'Free' | 'Pro' | 'Enterprise'): string => {
  const colors: Record<string, string> = {
    Free: 'bg-zinc-800 text-zinc-300',
    Pro: 'bg-purple-900/40 text-purple-300 border border-purple-700/50',
    Enterprise: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
  };
  return colors[plan] || colors.Free;
};

/**
 * Format credit amount with thousand separator
 */
export const formatCredits = (credits: number): string => {
  return credits.toLocaleString('en-US');
};
