'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import { HeartIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { SelfContext } from '@/hooks/useSelf';
import { SidebarProvider } from './ui/sidebar';
import AppSidebar from './app-sidebar';

type LayoutWrapperProps = {
  children: React.ReactNode;
  user: User | null;
};

export default function LayoutWrapper({ children, user }: LayoutWrapperProps) {
  const pathname = usePathname();
  const authorizedPaths = ['/dashboard', '/interview', '/feedback', '/history', '/profile'];
  const showNavbar = authorizedPaths.every((path) => !pathname.startsWith(path));

  return (
    <SelfContext.Provider value={user}>
      <SidebarProvider>
        {!showNavbar && <AppSidebar />}
        <main className="min-h-screen flex flex-col w-full items-center">
          <div
            className={`flex-1 w-full flex flex-col items-center text-black ${showNavbar ? '' : 'px-8'}`}
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
      </SidebarProvider>
    </SelfContext.Provider>
  );
}
