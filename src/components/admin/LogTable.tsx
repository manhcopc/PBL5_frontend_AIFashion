import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CreditLog } from "@/features/admin/types/admin.types";
import {
  formatTimestamp,
  getAmountColorClass,
  formatCreditAmount,
  getTypeColor,
  getStatusColor,
} from "@/mappers/logMapper";

interface LogTableProps {
  logs: CreditLog[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const LogTable = ({
  logs,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: LogTableProps) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                User (Email)
              </th>
              <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                Type
              </th>
              <th className="px-6 py-4 text-right font-semibold text-zinc-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                Timestamp
              </th>
              <th className="px-6 py-4 text-center font-semibold text-zinc-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-zinc-500">Loading logs...</span>
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
                <tr
                  key={log.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-zinc-600">
                    {log.transactionId.slice(0, 8)}...
                  </td>

                  <td className="px-6 py-4 text-zinc-700">{log.userEmail}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-medium border ${getTypeColor(
                        log.type
                      )}`}
                    >
                      {log.type}
                    </span>
                  </td>

                  <td
                    className={`px-6 py-4 text-right font-semibold ${getAmountColorClass(
                      log.amount
                    )}`}
                  >
                    {formatCreditAmount(log.amount)}
                  </td>

                  <td className="px-6 py-4 text-zinc-500 text-xs">
                    {formatTimestamp(log.timestamp)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && logs.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <span className="text-sm text-zinc-500">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
