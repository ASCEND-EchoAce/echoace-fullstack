'use client'; // Ensure this is a client-side component

import { useRouter } from 'next/navigation'; // Use useRouter from next/navigation
import * as DropdownMenu from '@/components/ui/dropdown-menu'; // Assuming you have a custom dropdown component
export default function CenteredDropdownPage() {
  const router = useRouter(); // Using the App Router's useRouter

  // Handle navigation to page2 when Option 1 is selected
  const handleNavigateToPage1 = () => {
    router.push('/survey'); // Navigate to the page1 video
  };
  const handleNavigateToPage2 = () => {
    router.push('/survey'); //change for added links from other devs.
  };
  //change for added links from other devs.
  const handleNavigateToSurvey = () => {
    router.push('/survey'); // Navigate to the survey route
  };

  return (
    <div className="overflow-hidden flex items-center justify-center text-white">
      <div className="text-center">
        {/* Heading */}
        <h1 className="text-4xl mb-4">Choose a prompt</h1>

        {/* Dropdown menu */}
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger asChild>
            <button className="px-4 py-2 text-sm font-medium text-white rounded-md bg-slate-600 hover:bg-blue-700 focus:outline-none">
              Select a prompt to answer.
            </button>
          </DropdownMenu.DropdownMenuTrigger>

          <DropdownMenu.DropdownMenuContent className="p-2 mt-2 rounded-md shadow-lg bg-black w-48">
            <DropdownMenu.DropdownMenuItem onClick={handleNavigateToPage2}>
              My best skill is...
            </DropdownMenu.DropdownMenuItem>
            <DropdownMenu.DropdownMenuSeparator className="border-t-2 border-white" />
            <DropdownMenu.DropdownMenuItem>
              Tell me about a time where you showed leadership...
            </DropdownMenu.DropdownMenuItem>
            <DropdownMenu.DropdownMenuSeparator className="border-t-2 border-white" />
            <DropdownMenu.DropdownMenuItem>One of my hobbies is...</DropdownMenu.DropdownMenuItem>
            <DropdownMenu.DropdownMenuSeparator className="border-t-2 border-white" />
            <DropdownMenu.DropdownMenuItem onClick={handleNavigateToSurvey}>
              About you survey
            </DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      </div>
    </div>
  );
}
