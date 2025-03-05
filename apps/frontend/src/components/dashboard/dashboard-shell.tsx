import { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { UserDropdown } from '@/components/dashboard/user-dropdown';
import { ModeToggle } from '@/components/mode-toggle';
import { Notifications } from '@/components/dashboard/notifications';
import { SearchBar } from '@/components/dashboard/search-bar';
import { SideDrawer } from '@/components/dashboard/side-drawer';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <DashboardSidebar className="hidden lg:flex" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="lg:hidden">
            <SideDrawer>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SideDrawer>
          </div>
          
          <div className="lg:hidden">
            <Logo />
          </div>
          
          <div className="flex-1">
            <SearchBar />
          </div>
          
          <nav className="flex items-center gap-2">
            <DashboardNav className="hidden lg:flex" />
            <Notifications />
            <ModeToggle />
            <UserDropdown />
          </nav>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl py-6">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t py-4 px-6">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 HMNZD AI Compliance Suite. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/terms" className="hover:underline">Terms</a>
              <a href="/privacy" className="hover:underline">Privacy</a>
              <a href="/help" className="hover:underline">Help</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
