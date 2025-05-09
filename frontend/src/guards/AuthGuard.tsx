
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading  && !isAuthenticated && location.pathname !== "/login") {
      toast({
        variant: "destructive",
        title: "Truy cập bị từ chối",
        description: "Vui lòng đăng nhập để truy cập trang này.",
      });
    }
  }, [isLoading, isAuthenticated, toast]);

  if (isLoading) {
    // Hiển thị loading state trong khi kiểm tra đăng nhập
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return null; // tránh lặp
  }

  return <>{children}</>;
};

export default AuthGuard;
