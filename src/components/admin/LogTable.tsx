import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CreditLog } from '@/features/admin/types/admin.types';
import { formatTimestamp, getAmountColorClass, formatCreditAmount, getTypeColor, getStatusColor } from '@/mappers/logMapper';

interface LogTableProps {
  logs: CreditLog[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const LogTable = ({ logs, loading, currentPage, totalPages, onPageChange }: LogTableProps) => {
  return (
    <div className="bg-zinc-900 border border-zinc-900 rounded-lg overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-6 py-4 text-left font-semibold text-zinc-300">Transaction ID</th>
              <th className="px-6 py-4 text-left font-semibold text-zinc-300">User (Email)</th>
              <th className="px-6 py-4 text-left font-semibold text-zinc-300">Type</th>
              <th className="px-6 py-4 text-right font-semibold text-zinc-300">Amount</th>
              <th className="px-6 py-4 text-left font-semibold text-zinc-300">Timestamp</th>
              <th className="px-6 py-4 text-center font-semibold text-zinc-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-zinc-400">Loading logs...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  No credit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  {/* Transaction ID */}
                  <td className="px-6 py-4 font-mono text-xs text-zinc-300">
                    {log.transactionId.slice(0, 8)}...
                  </td>

                  {/* User Email */}
                  <td className="px-6 py-4 text-zinc-300">
                    {log.userEmail}
                  </td>

                  {/* Type Badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium border ${getTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </td>

                  {/* Amount with Color */}
                  <td className={`px-6 py-4 text-right font-semibold ${getAmountColorClass(log.amount)}`}>
                    {formatCreditAmount(log.amount)}
                  </td>

                  {/* Timestamp */}
                  <td className="px-6 py-4 text-zinc-400 text-xs">
                    {formatTimestamp(log.timestamp)}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium border ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && logs.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
          <span className="text-sm text-zinc-400">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
