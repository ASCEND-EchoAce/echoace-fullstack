'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { UserProfileDropdown } from './UserProfileDropdown';

type NavbarProps = {
  user: User | null;
};

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const displayName = user
    ? user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Profile'
    : 'Profile';

  const links = [
    ...(user ? [{ url: '/dashboard', label: 'Dashboard' }] : [{ url: '/sign-in', label: 'Survey' }]),
    ...(user
      ? [{ url: '/interview', label: 'Interview' }]
      : [{ url: '/sign-in', label: 'Interview' }])
  ];

  return (
    <>
      {pathname === '/' && (
        <img
          src="/landing-background.png"
          alt="landing page background"
          className="absolute pointer-events-none z-[-10]"
        />
      )}
      <div className="w-full py-4 px-24 flex justify-between">
        <Link href="/" className="flex gap-4 items-center">
          <Image src={'/logo.png'} alt={'logo'} width={32} height={32} className="invert" />
          <p className="text-xl font-semibold">EchoAce</p>
        </Link>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.url}
              className="text-sm font-semibold hover:text-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="text-black dark:text-white sm:flex hidden items-center">
              <UserProfileDropdown user={user} />
            </div>
          ) : (
            <Button variant={'secondary'}>
              <Link href={'/sign-in'}>Sign Up / Log In</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
