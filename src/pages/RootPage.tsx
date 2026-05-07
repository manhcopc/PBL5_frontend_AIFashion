import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/state/use-auth-store';

export const RootPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (isLoading) return; // Wait for auth validation

    if (!isAuthenticated) {
      // Not logged in - redirect to login
      navigate('/login', { replace: true });
      return;
    }

    // User is authenticated - redirect based on role
    // Normalize role to lowercase for comparison
    const userRole = user?.role?.toLowerCase();
    console.log('RootPage - User authenticated with role:', userRole);
    
    if (userRole === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      // Default user role
      navigate('/workspace', { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Show loading while checking auth
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  );
};
