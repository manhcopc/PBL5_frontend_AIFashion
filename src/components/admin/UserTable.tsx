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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
        <p className="text-zinc-400">No users found</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-800/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                User
              </th>
              {/* <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Plan
              </th> */}
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Credits
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Join Date
              </th>
              {/* <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                Status
              </th> */}
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                {/* User */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    /> */}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.username}
                      </p>
                      <p className="text-xs text-zinc-400">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Plan */}
                {/* <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(
                      user.plan
                    )}`}
                  >
                    {user.plan}
                  </span>
                </td> */}

                {/* Credits */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ChevronUp className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-white">
                      {formatCredits(user.available_credits)}
                    </span>
                  </div>
                </td>

                {/* Join Date */}
                <td className="px-6 py-4 text-sm text-zinc-400">
                  {user.created_at}
                </td>

                {/* Status */}
                {/* <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                      user.isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-700/50 text-zinc-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        user.isActive ? "bg-emerald-400" : "bg-zinc-500"
                      }`}
                    />
                    {user.isActive ? "Active" : "Inactive"}
                  </div>
                </td> */}

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onManage(user)}
                      disabled={isLoading}
                      className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Manage user"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user._id, user.username)}
                      disabled={isLoading}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
