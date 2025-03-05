## File 22: apps/frontend/src/components/dashboard/dashboard-nav.tsx

```tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Home, 
  Settings 
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: Home,
    },
    {
      href: '/dashboard/activity',
      label: 'Activity',
      icon: Activity,
    },
    {
      href: '/dashboard/calendar',
      label: 'Calendar',
      icon: Calendar,
    },
    {
      href: '/dashboard/tasks',
      label: 'Tasks',
      icon: ClipboardList,
    },
    {
      href: '/dashboard/documents',
      label: 'Documents',
      icon: FileText,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  return (
    <div className={cn('flex items-center space-x-1', className)} {...props}>
      <TooltipProvider>
        {navItems.map((item) => (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'h-9 w-9 p-0',
                  pathname === item.href && 'bg-secondary text-secondary-foreground'
                )}
                size="icon"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
```
