import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/state/use-auth-store';
import { isTokenValid } from '@/services/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

/**
 * Protected Route Component
 * - Checks if user is authenticated
 * - Validates user role if specified
 * - Redirects to login if not authenticated
 * - Redirects to unauthorized if role doesn't match
 */
export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, clearAuth } = useAuthStore();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user || !isTokenValid()) {
    console.warn('ProtectedRoute: User not authenticated, redirecting to login');
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole) {
    // Normalize role to lowercase for comparison
    const userRole = user.role?.toLowerCase();
    const hasRequiredRole = requiredRole.includes(userRole as string);
    
    console.log('ProtectedRoute - Checking role:', {
      userRole,
      requiredRole,
      hasRequiredRole,
    });

    if (!hasRequiredRole) {
      console.warn('ProtectedRoute: User role does not match required role, redirecting to unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
