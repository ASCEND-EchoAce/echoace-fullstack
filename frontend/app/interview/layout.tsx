import React from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

type InterviewLayoutProps = {
  children: React.ReactNode;
};

export default async function InterviewLayout({
  children,
}: InterviewLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        <div className="flex flex-col gap-5 max-w-3xl p-3 w-2xl mx-auto">
          {children}
        </div>
      </div>
    </main>
  );
}
  