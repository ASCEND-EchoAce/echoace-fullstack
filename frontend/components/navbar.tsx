'use client';

import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; // If you want a Radix-based dropdown
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

type NavbarProps = {
  user: User | null;
};

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const links = [
    { url: '/userform', label: 'Survey' },
    { url: 'interview', label: 'Interview' }
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
            <div className="text-black dark:text-white sm:flex hidden items-center space-x-8">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                    <svg
                      className="absolute w-12 h-12 text-gray-400 -left-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="absolute right-0 bg-white text-black dark:text-white rounded-lg shadow-lg p-2 mt-2 z-50 transition ease-in-out duration-200 w-[400px]">
                  <div className="flex-1 w-full flex flex-col items-center">
                    <DropdownMenu.Item asChild>
                      <button
                        type="button"
                        className="ml-auto bg-white rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                      >
                        <span className="sr-only">Close menu</span>
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </DropdownMenu.Item>

                    <div className="relative w-28 h-28 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <svg
                        className="absolute w-full h-full text-gray-400 "
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-4xl mt-12">Profile</h2>
                    <button className="mt-12 font-bold border border-2 border-blue-500 text-blue-500 rounded-lg py-3 px-8">
                      Edit User Information
                    </button>
                    <div className="flex flex-row justify-center mt-20 gap-8 text-md mb-4">
                      <DropdownMenu.Item className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                        <Link href="../">Memberships</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                        Settings
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                        <Link href="../sign-in">Log out</Link>
                      </DropdownMenu.Item>
                    </div>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
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
