
"use client";

import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6 lg:hidden"> {/* Mobile trigger */}
          <SidebarTrigger asChild>
            <Button variant="outline" size="icon">
              <PanelLeft />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SidebarTrigger>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
