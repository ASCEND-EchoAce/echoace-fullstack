import { ThemeSwitcher } from '@/components/theme-switcher';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Page from './userform/page';
import { Home } from 'lucide-react';

// import { useLocation } from 'react-router-dom';


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'EchoAce',
  description: 'Your solution to the world!'
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin']
});

const routes = [
  { path: '/home', component: Home, meta: { hideNavbar: true } },
  // other routes...
];

type RootLayoutProps = {
  children: React.ReactNode;
  routeMeta?: any; // you can replace `any` with a more specific type if needed
};

export default async function RootLayout({ children, routeMeta }: RootLayoutProps) {
  

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-offwhite text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="fixed bg-white w-full flex justify-center border-b border-b-foreground/10 h-20">
                <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-md gap-5">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={'/home'}>
                      {/* Correctly reference the logo */}
                      <Image
                        src="/invert%20icon.png" // Use the correct URL path
                        alt="EchoAce Logo"
                        height={64}
                        width={64}
                      />
                    </Link>
                    <div className="flex items-center gap-2">{/* <DeployButton /> */}</div>
                    <div className='flex flex-row'><div className='text-black text-2xl mt-1'>
                      EchoAce
                    </div>
                    </div>
                  </div>
                  <div className='font-bold'>
                  {!routeMeta?.hideNavbar && <Navbar />}
                
                    </div>
                </div>
              </nav>
              {/* <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div> */}
              <div className="flex-1 w-full mt-44">{children}</div>

              <footer className="w-full flex items-center justify-center mx-auto text-center text-xs gap-8 py-16">
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
