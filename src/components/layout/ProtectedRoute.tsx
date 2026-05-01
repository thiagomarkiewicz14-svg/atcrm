import { Navigate, Outlet } from 'react-router-dom';

import { LoadingState } from '@/components/shared/LoadingState';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState className="min-h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState className="min-h-screen" />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
