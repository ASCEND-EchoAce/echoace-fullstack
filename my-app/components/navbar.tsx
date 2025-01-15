'use client'; // Ensure this is a client-side component
import Link from 'next/link'; // For routing between pages
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; // If you want a Radix-based dropdown
import { useRouter } from 'next/navigation'; // For programmatic navigation (optional)

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="text-white p-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Middle: Navigation Links */}
        <div className="hidden sm:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link href="/survey" className="hover:text-gray-300">
            Survey
          </Link>
        </div>

        {/* Right side: Dropdown or Profile (optional) */}
        <div className="sm:flex hidden items-center space-x-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="px-4 py-2 text-sm font-medium rounded-md">Options</button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="rounded-md shadow-lg p-2 mt-2">
              <DropdownMenu.Item className="p-2 text-white">My Profile</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 text-white">Settings</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 text-white">Log out</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
