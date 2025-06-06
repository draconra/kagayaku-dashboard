
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Lightbulb, CalendarPlus, AreaChart, LogOut } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/app/login/actions';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/smart-pricing', label: 'Smart Pricing', icon: Lightbulb },
  { href: '/appointments/create', label: 'New Appointment', icon: CalendarPlus },
  { href: '/financial-snapshot', label: 'Financial Snapshot', icon: AreaChart },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, setOpenMobile } = useSidebar();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 hover:no-underline">
          <Image
            src="https://placehold.co/96x32.png"
            alt="Kagayaku Studio Logo"
            width={96}
            height={32}
            className="h-8 w-auto"
            data-ai-hint="studio logo"
            priority
          />
          <h1
            className={cn(
              "font-semibold text-lg text-primary whitespace-nowrap transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0 md:opacity-100"
            )}
          >
            Kagayaku CC
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  onClick={() => setOpenMobile(false)}
                >
                  <a>
                    <item.icon />
                    <span className={cn(
                       "transition-opacity duration-200",
                       open ? "opacity-100 delay-100" : "opacity-0 md:opacity-100 md:delay-0"
                    )}>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator className="my-1" />
        <form action={logoutAction} className="w-full">
          <SidebarMenuItem>
            <SidebarMenuButton
              type="submit"
              className="w-full"
              tooltip={{ children: "Logout", side: 'right', align: 'center' }}
              variant="ghost" // Or "default" if you prefer a more prominent look
              // isActive={false} // Not applicable for an action button typically
            >
              <LogOut />
              <span className={cn(
                  "transition-opacity duration-200",
                  open ? "opacity-100 delay-100" : "opacity-0 md:opacity-100 md:delay-0"
              )}>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </form>
      </SidebarFooter>
    </>
  );
}
