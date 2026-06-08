import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/features/auth/state/use-auth-store';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400 mb-2">
          You don't have permission to access this page.
        </p>
        <div className="mt-6 space-y-3">
          <p className="text-xs text-zinc-500">
            Logged in as: <span className="text-zinc-300">{user?.email}</span>
          </p>
          <p className="text-xs text-zinc-500">
            Role: <span className="text-zinc-300 font-semibold">{user?.role?.toUpperCase()}</span>
          </p>
        </div>
        
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
