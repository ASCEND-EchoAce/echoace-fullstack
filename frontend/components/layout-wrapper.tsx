'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import { HeartIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { SelfContext } from '@/hooks/useSelf';

type LayoutWrapperProps = {
  children: React.ReactNode;
  user: User | null;
};

export default function LayoutWrapper({ children, user }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isFeedbackPage = pathname?.startsWith('/feedback');

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center text-black">
        <SelfContext.Provider value={user}>
          {!isFeedbackPage && <Navbar user={user} />}
          <div className="flex flex-col gap-20 w-full">{children}</div>
          {!isFeedbackPage && (
            <footer className="w-full flex items-center justify-center mx-auto text-center text-xs gap-2 py-16">
              Built with <HeartIcon /> by ASCEND Product II.
            </footer>
          )}
        </SelfContext.Provider>
      </div>
    </main>
  );
}
