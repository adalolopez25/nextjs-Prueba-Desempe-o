'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/');
      return;
    }
    // Check if user has the required role
    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'client') {
        router.push('/dashboard/client');
      } else if (user.role === 'agent') {
        router.push('/dashboard/agent');
      }
    }
  }, [user, router, allowedRoles]);

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Check if user has the required role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Access denied. Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;