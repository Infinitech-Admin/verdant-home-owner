"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CitizenSidebar from './CitizenSidebar';
import CitizenBottomNav from '@/components/citizenBottomNav';
import CitizenHeader from '@/components/citizenHeader';
import { authClient } from '@/lib/auth';

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export default function CitizenLayout({ children }: CitizenLayoutProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Get user from cookie-based auth
        const currentUser = await authClient.getCurrentUser();
        
        if (!currentUser) {
          setError('No user session found');
          setTimeout(() => router.push('/login'), 1000);
          return;
        }
        
        // Check if user is a citizen
        if (currentUser.role !== 'citizen') {
          setError('Access denied. This area is for citizens only.');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        setUser(currentUser);
        setError(null);
      } catch (error) {
        setError('Authentication failed');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Verifying authentication...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Don't render content if no user (will redirect anyway)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Sidebar - Desktop only */}
      <CitizenSidebar />

      {/* Main Content */}
      <div className="lg:ml-64 pb-20 lg:pb-0">
        {/* Header */}
        <CitizenHeader />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <CitizenBottomNav />
    </div>
  );
}
