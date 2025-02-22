'use client'; // Ensure this is a client-side component
import Link from 'next/link'; // For routing between pages
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; // If you want a Radix-based dropdown
import { useRouter } from 'next/navigation'; // For programmatic navigation (optional)
import { useState, useEffect } from "react";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="text-white p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Middle: Navigation Links */}
        <div className="hidden sm:flex space-x-6">
          <Link href="/" className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500">
            Home
          </Link>
          <Link href="/about" className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500">
            About
          </Link>
          <Link href="/userform" className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500">
            Survey
          </Link>
          <Link href="/interview" className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500">
            Interview
          </Link>
        </div>

        {/* Right side: Dropdown or Profile (optional) */}
        <div className="text-black dark:text-white sm:flex hidden items-center space-x-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-500 px-5 py-2 text-sm">Options</button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="text-black dark:text-white rounded-md shadow-lg p-2 mt-2">
              <DropdownMenu.Item className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">My Profile</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Settings</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                <Link href="../sign-in">Log out</Link></DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
