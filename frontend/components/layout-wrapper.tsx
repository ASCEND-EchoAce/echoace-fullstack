'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import { HeartIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { SidebarProvider } from './ui/sidebar';
import AppSidebar from './app-sidebar';
import { useEffect, useState } from 'react';
import { UserProfileAPI } from '@/api/userProfileAPI';
import { UserAPI } from '@/api/userAPI';
import { SelfProvider } from './SelfProvider';

type LayoutWrapperProps = {
  children: React.ReactNode;
  user: User | null;
};

export default function LayoutWrapper({ children, user }: LayoutWrapperProps) {
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const pathname = usePathname();
  const authorizedPaths = [
    '/dashboard',
    '/interview',
    '/feedback',
    '/history',
    '/profile',
    '/membership'
  ];
  const showNavbar = authorizedPaths.every((path) => !pathname.startsWith(path));

  useEffect(() => {
    if (!user) return;

    if (window.sessionStorage.getItem('user')) {
      setDbUser(JSON.parse(window.sessionStorage.getItem('user') || ''));
      setUserProfile(JSON.parse(window.sessionStorage.getItem('profile') || ''));
    }

    UserAPI.getUser(user.id).then((data) => {
      setDbUser(data);
      window.sessionStorage.setItem('user', JSON.stringify(data));
    });
    UserProfileAPI.getUserProfile(user.id).then((data) => {
      setUserProfile(data);
      window.sessionStorage.setItem('profile', JSON.stringify(data));
    });
  }, [user]);

  return (
    <SidebarProvider>
      <SelfProvider value={{ user: dbUser, profile: userProfile }}>
        {!showNavbar && <AppSidebar />}
        <main className="min-h-screen flex flex-col w-full items-center">
          <div
            className={`flex-1 w-full flex flex-col items-center text-black ${showNavbar ? '' : pathname === '/feedback' ? '' : 'p-8'}`}
          >
            {showNavbar && <Navbar user={user} />}
            <div className="flex flex-col gap-20 w-full">{children}</div>
            {showNavbar && (
              <footer className="w-full flex items-center justify-center mx-auto text-center text-xs gap-2 py-16">
                Built with <HeartIcon /> by ASCEND Product II.
              </footer>
            )}
          </div>
        </main>
      </SelfProvider>
    </SidebarProvider>
  );
}
