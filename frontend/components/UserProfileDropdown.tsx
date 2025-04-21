'use client';

import { User } from '@supabase/supabase-js';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { signOutAction } from '@/app/actions';
import Link from 'next/link';
import {LogOut, UserCog, BadgeCheck} from 'lucide-react'


interface UserProfileDropdownProps {
  user: User | null;
}

export const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  const displayName = user ? 
    (user.user_metadata?.full_name || 
     user.user_metadata?.name || 
     user.email || 
     'Profile') : 'Profile';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer">
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
          <h2 className="text-2xl mt-12">{displayName}</h2>
          <div className="w-80 rounded-lg border shadow-md bg-white text-black mt-8 mb-4">
            <Link href="/membership">
              <button className="w-full flex-row text-left hover:bg-gray-50 text-sm py-4 px-2">
                <div className='flex flex-row gap-1'>
                  <BadgeCheck className='w-5 h-5' color='lightblue' />
                  Manage Membership
                </div>
              </button> 
            </Link>
            <Link href="/profile">
              <button className="w-full text-left hover:bg-gray-50 text-sm py-4 px-2">
                <div className='flex flex-row gap-1'>
                  <UserCog className='w-5 h-5' />
                  Profile
                </div>
              </button>
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="w-full text-left hover:bg-gray-50 text-sm py-4 px-2">
                <div className='flex flex-row gap-1'>
                  <LogOut className='w-5 h-5' />
                  Sign out
                </div>
              </button>
            </form>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}; 