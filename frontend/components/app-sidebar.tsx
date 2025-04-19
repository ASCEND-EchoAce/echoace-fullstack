import { Gauge, Users, FolderClock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from './ui/sidebar';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useSelf } from '@/hooks/useSelf';
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
  const self = useSelf();
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  const items = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Gauge
    },
    {
      title: 'Interview',
      url: '/interview',
      icon: Users
    },
    {
      title: 'History',
      url: '/history',
      icon: FolderClock
    }
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center h-16">
        {state === 'expanded' && (
          <div className="flex gap-8">
            <Link href="/" className="flex gap-4 items-center">
              <Image src={'/logo.png'} alt={'logo'} width={32} height={32} className="invert" />
              <p className="text-xl font-semibold">EchoAce</p>
            </Link>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-black text-lg gap-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={pathname.startsWith(item.url) ? `bg-gray-200 rounded-lg` : ''}
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex items-center flex-row justify-center h-16 font-bold text-lg">
        {state === 'expanded' ? (
          <>
            <div className="flex items-center gap-4">
              <p>Profile</p>
              <UserProfileDropdown user={self} />
            </div>
            <ChevronLeft onClick={toggleSidebar} className="absolute right-5 hover:bg-gray-200 rounded-lg" />
          </>
        ) : (
          <SidebarMenuButton asChild>
            <ChevronRight onClick={toggleSidebar} />
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
