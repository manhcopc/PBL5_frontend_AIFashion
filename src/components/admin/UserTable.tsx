import { ChevronUp, Trash2, Settings } from "lucide-react";
import { formatCredits } from "@/mappers/adminMapper";
import type { AdminUser } from "@/features/admin/types/admin.types";

interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onManage: (user: AdminUser) => void;
  onDelete: (userId: string, username: string) => void;
}

export const UserTable = ({
  users,
  isLoading,
  onManage,
  onDelete,
}: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center shadow-sm">
        <p className="text-zinc-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">
                User
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">
                Credits
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">
                Join Date
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userId = user._id || user.id || "";
              const credits =
                user.available_credits ?? user.creditsRemaining ?? 0;
              const joinDate = user.created_at || user.joinDate || "N/A";

              return (
                <tr
                  key={userId || user.email}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ChevronUp className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-zinc-900">
                        {formatCredits(credits)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {joinDate}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onManage(user)}
                        disabled={isLoading}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Manage user"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(userId, user.username)}
                        disabled={isLoading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
