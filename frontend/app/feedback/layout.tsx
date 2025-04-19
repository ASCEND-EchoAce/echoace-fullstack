import React from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
})

{
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }
  
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        {children}
      </div>
    </main>
  );
} 