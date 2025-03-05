## File 14: apps/frontend/src/components/dashboard/dashboard-header.tsx

```tsx
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Download, Plus, Share2 } from 'lucide-react';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  showExportButton?: boolean;
  showAddButton?: boolean;
  showShareButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  className?: string;
}

export function DashboardHeader({
  heading,
  text,
  children,
  actions,
  showExportButton = false,
  showAddButton = false,
  showShareButton = false,
  addButtonLabel = "Add New",
  onAddClick,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn("pb-5", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Heading size="h3">{heading}</Heading>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
        {(actions || showExportButton || showAddButton || showShareButton) && (
          <div className="flex items-center gap-2">
            {showExportButton && (
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
            {showShareButton && (
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            )}
            {showAddButton && (
              <Button size="sm" onClick={onAddClick}>
                <Plus className="mr-2 h-4 w-4" />
                {addButtonLabel}
              </Button>
            )}
            {actions}
          </div>
        )}
      </div>
      {children}
      <Separator className="mt-4" />
    </div>
  );
}
```
