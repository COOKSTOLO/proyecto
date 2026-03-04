'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  console.log('🔒 ProtectedRoute: Component rendered');
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('🔒 ProtectedRoute: User:', user?.email, 'Loading:', loading);

  useEffect(() => {
    if (!loading && !user) {
      console.log('❌ ProtectedRoute: No user, redirecting to login');
      router.push('/login');
    }
  }, [loading, user]);

  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ ProtectedRoute: No user, showing null');
    return null;
  }

  console.log('✅ ProtectedRoute: User found, rendering children');
  return <>{children}</>;
}
