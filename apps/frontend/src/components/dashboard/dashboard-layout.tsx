import { cn } from '@/lib/utils';
import { DashboardNav } from './dashboard-nav';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { AppNav } from '@/components/app-nav';
import { Separator } from '@/components/ui/separator';
import { CompanyLogo } from '@/components/company-logo';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAlerts } from '@/hooks/use-alerts';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ 
  children,
  className
}: DashboardLayoutProps) {
  const { data } = useAlerts();
  const unreadCount = data?.alerts?.filter(alert => !alert.read).length || 0;
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 md:gap-4 mr-4">
            <CompanyLogo />
          </div>
          
          {/* Main navigation */}
          <AppNav className="hidden md:flex mx-6" />
          
          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex relative w-40 lg:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 h-9 md:w-40 lg:w-64"
              />
            </div>
            
            {/* Alert bell */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* User menu */}
            <UserNav />
          </div>
        </div>
      </header>
      
      {/* Secondary navigation */}
      <div className="container flex items-center h-12 border-b">
        <DashboardNav />
        <div className="ml-auto">
          <Button variant="ghost" size="sm" className="h-8">Help</Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className={cn('container flex-1 pb-12 pt-6', className)}>
        {children}
      </div>
      
      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 ComplianceGuard. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Button variant="link" size="sm" className="text-xs text-muted-foreground">
              Terms of Service
            </Button>
            <Button variant="link" size="sm" className="text-xs text-muted-foreground">
              Privacy Policy
            </Button>
            <Button variant="link" size="sm" className="text-xs text-muted-foreground">
              Contact Support
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
