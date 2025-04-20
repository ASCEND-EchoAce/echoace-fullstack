import { Geist } from 'next/font/google';
import './globals.css';
import { createClient } from '@/utils/supabase/server';
import LayoutWrapper from '@/components/layout-wrapper';

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
        <LayoutWrapper user={user}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
