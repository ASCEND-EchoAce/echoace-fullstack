'use client';

import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; // If you want a Radix-based dropdown
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { signOutAction } from '../app/actions';

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
      {(pathname === '/' || pathname === '/interview') && (
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
                    />
                  </svg>
                </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="absolute right-0 bg-white text-black dark:text-white rounded-xl shadow-lg p-2 mt-2 z-50 transition ease-in-out duration-200 w-[400px]">
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
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </DropdownMenu.Item>
    
                  <div className="relative w-28 h-28 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <svg
                      className="absolute w-full h-full text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl mt-12">Profile</h2>
                  <button className="mt-12 font-bold border-2 border-blue-500 text-blue-500 rounded-lg py-3 px-8">
                    Edit User Information
                  </button>
                  <div className="w-80 rounded-lg border shadow-md bg-white text-black mt-8 mb-4">
                    <button className="w-full flex-row text-left hover:bg-gray-50 text-sm py-4 px-2">
                      <div className='flex flex-row gap-1'>
                        <svg 
                        className="h-5 w-5 text-sky-500"  
                        fill="none" 
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        /></svg>Membership
                      </div>
                    </button> 
                    <button className="w-full text-left hover:bg-gray-50 text-sm py-4 px-2">
                      <div className='flex flex-row gap-1'>
                        <svg 
                          className="w-[20px] h-[20px] fill-[#8e8e8e]" 
                          viewBox="0 0 512 512" 
                          xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"></path>
                        </svg>Settings
                      </div>
                    </button>
                    <form action={signOutAction}>
                      
                      <button type="submit" className="w-full text-left hover:bg-gray-50 text-sm py-4 px-2">
                        <div className='flex flex-row gap-1'>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#000000" 
                            strokeWidth="2" strokeLinecap="round" 
                            strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" x2="9" y1="12" y2="12"></line>
                          </svg>Sign out
                        </div>
                      </button>
                    </form>
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
