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
  useSidebar
} from './ui/sidebar';
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
  const pathname = usePathname();
  const { state, setSidebarState } = useSidebar();

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
    <Sidebar
      variant="floating"
      collapsible="icon"
      onMouseEnter={() => setSidebarState(true)}
      onMouseLeave={() => setSidebarState(false)}
    >
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
        {state === 'expanded' && (
          <div className="flex items-center gap-4">
            <Link href="/profile">Profile</Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
