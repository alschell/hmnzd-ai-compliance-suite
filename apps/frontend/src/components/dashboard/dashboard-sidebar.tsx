## File 13: apps/frontend/src/components/dashboard/dashboard-sidebar.tsx

```tsx
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  HandshakeIcon, 
  FileBarChart, 
  AlertOctagon, 
  Users, 
  Settings, 
  HelpCircle,
  FileCheck,
  Building,
  LineChart,
  BookOpen
} from 'lucide-react';

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className, ...props }: DashboardSidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      href: "/dashboard",
      color: "text-blue-500",
    },
    {
      label: "Compliance Frameworks",
      icon: <ShieldCheck className="mr-2 h-4 w-4" />,
      href: "/dashboard/frameworks",
      color: "text-green-500",
    },
    {
      label: "Risk Assessment",
      icon: <AlertOctagon className="mr-2 h-4 w-4" />,
      href: "/dashboard/risk",
      color: "text-amber-500",
    },
    {
      label: "Consent Management",
      icon: <HandshakeIcon className="mr-2 h-4 w-4" />,
      href: "/dashboard/consent",
      color: "text-purple-500",
    },
    {
      label: "Contract Analysis",
      icon: <FileText className="mr-2 h-4 w-4" />,
      href: "/dashboard/contracts",
      color: "text-indigo-500",
    },
    {
      label: "Assessments",
      icon: <FileCheck className="mr-2 h-4 w-4" />,
      href: "/dashboard/assessments",
      color: "text-cyan-500",
    },
    {
      label: "Reports & Analytics",
      icon: <LineChart className="mr-2 h-4 w-4" />,
      href: "/dashboard/reports",
      color: "text-teal-500",
    },
    {
      label: "Regulatory Updates",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      href: "/dashboard/regulatory",
      color: "text-rose-500",
    },
    {
      label: "Organization",
      icon: <Building className="mr-2 h-4 w-4" />,
      href: "/dashboard/organization",
      color: "text-sky-500",
    },
    {
      label: "Team Management",
      icon: <Users className="mr-2 h-4 w-4" />,
      href: "/dashboard/team",
      color: "text-orange-500",
    },
  ];

  const bottomRoutes = [
    {
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      href: "/dashboard/settings",
    },
    {
      label: "Help & Support",
      icon: <HelpCircle className="mr-2 h-4 w-4" />,
      href: "/dashboard/support",
    },
  ];
  
  return (
    <div className={cn("w-64 border-r bg-card flex flex-col", className)} {...props}>
      <div className="flex h-16 items-center border-b px-6">
        <Logo className="h-8 w-auto" />
      </div>
      
      <div className="space-y-4 py-4 flex flex-col flex-1">
        <div className="px-3 py-2">
          <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-tight">
            MAIN NAVIGATION
          </div>
          <nav className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-secondary",
                  route.color
                )}
                asChild
              >
                <Link href={route.href}>
                  {route.icon}
                  <span>{route.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto px-3 py-2">
          <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-tight">
            SYSTEM
          </div>
          <nav className="space-y-1">
            {bottomRoutes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={route.href}>
                  {route.icon}
                  <span>{route.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="px-3 py-2">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">AI Assistant</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Get compliance guidance and answers from our AI assistant.
            </p>
            <Button size="sm" className="w-full text-xs">
              Open Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```
