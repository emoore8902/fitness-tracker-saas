import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // TODO: Replace with real role check once backend sends is_admin on the user object
  if (!user?.is_admin) return <Navigate to="/app/dashboard" replace />;
  return <>{children}</>;
}
