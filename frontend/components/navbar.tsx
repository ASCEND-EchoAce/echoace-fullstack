'use client'; // Ensure this is a client-side component
import Link from 'next/link'; // For routing between pages
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; // If you want a Radix-based dropdown
import { useRouter } from 'next/navigation'; // For programmatic navigation (optional)
import { useState, useEffect } from "react";

const Navbar = () => {
  const router = useRouter();

  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <nav className="text-white p-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Middle: Navigation Links */}
        <div className="hidden sm:flex space-x-6">
          <Link href="/landing" className="text-black dark:text-white hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="text-black dark:text-white hover:text-gray-300">
            About
          </Link>
          <Link href="/userform" className="text-black dark:text-white hover:text-gray-300">
            Survey
          </Link>
          <Link href="/interview" className="hover:text-gray-300">
            Interview
          </Link>
        </div>

        {/* Right side: Dropdown or Profile (optional) */}
        <div className="text-black dark:text-white sm:flex hidden items-center space-x-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="text-black dark:text-white px-5 py-2 text-sm">Options</button>
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
