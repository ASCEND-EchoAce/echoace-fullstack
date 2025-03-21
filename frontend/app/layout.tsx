import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import { createClient } from '@/utils/supabase/server';

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin']
});

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body>
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col items-center text-black">
            <Navbar user={user} />
            <div className="flex flex-col gap-20 w-full">{children}</div>
            <footer className="w-full flex items-center justify-center mx-auto text-center text-xs gap-8 py-16"></footer>
          </div>
        </main>
      </body>
    </html>
  );
}
