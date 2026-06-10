import type { CreditLog } from '@/features/admin/types/admin.types';

/**
 * Format timestamp to DD/MM/YYYY HH:mm format
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return timestamp;
  }
};

/**
 * Get color class for credit amount based on sign
 * Positive amounts (refunds/top-ups) in emerald, negative (usage) in red
 */
export const getAmountColorClass = (amount: number): string => {
  return amount > 0 ? 'text-emerald-600' : 'text-red-600';
};

/**
 * Format credit amount with sign
 */
export const formatCreditAmount = (amount: number): string => {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toLocaleString('en-US')}`;
};

/**
 * Get badge color and styling for credit log type
 */
export const getTypeColor = (type: 'Top-up' | 'Design Generation' | 'Refund'): string => {
  const colors: Record<string, string> = {
    'Top-up': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Design Generation': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    'Refund': 'bg-blue-50 text-blue-700 border border-blue-200',
  };
  return colors[type] || 'bg-zinc-100 text-zinc-700';
};

/**
 * Get badge color and styling for credit log status
 */
export const getStatusColor = (status: 'Success' | 'Failed' | 'Pending'): string => {
  const colors: Record<string, string> = {
    'Success': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Failed': 'bg-red-50 text-red-700 border border-red-200',
    'Pending': 'bg-amber-50 text-amber-700 border border-amber-200',
  };
  return colors[status] || 'bg-zinc-100 text-zinc-700';
};

/**
 * Transform and format credit log for display
 */
export const formatCreditLog = (log: CreditLog) => {
  return {
    ...log,
    formattedTimestamp: formatTimestamp(log.timestamp),
    formattedAmount: formatCreditAmount(log.amount),
    amountColorClass: getAmountColorClass(log.amount),
    typeColor: getTypeColor(log.type),
    statusColor: getStatusColor(log.status),
  };
};

/**
 * Transform array of credit logs for display
 */
export const formatCreditLogs = (logs: CreditLog[]) => {
  return logs.map(formatCreditLog);
};
