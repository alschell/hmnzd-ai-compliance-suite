import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight, Bell, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useAlerts } from '@/hooks/use-alerts';
import { formatDistanceToNow } from 'date-fns';

export function RecentAlerts() {
  const { data, isLoading, error, markAlertAsRead } = useAlerts();
  const [visibleAlerts, setVisibleAlerts] = useState(3);
  
  // Function to get alert severity badge with appropriate styling
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Badge className="risk-badge-critical">Critical</Badge>;
      case 'high':
        return <Badge className="risk-badge-high">High</Badge>;
      case 'medium':
        return <Badge className="risk-badge-medium">Medium</Badge>;
      case 'low':
        return <Badge className="risk-badge-low">Low</Badge>;
      case 'info':
        return <Badge variant="outline" className="border-sky-500/50 bg-sky-500/10 text-sky-500">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Handler for marking an alert as read
  const handleMarkAsRead = async (alertId: string) => {
    await markAlertAsRead(alertId);
  };
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Recent Alerts
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="advanced-tooltip">
                  <p>Important notifications and alerts about your compliance status.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Important notifications</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Alerts</CardTitle>
          <CardDescription>Important notifications</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center text-destructive py-6">
            Error loading alerts data
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hasMoreAlerts = data.alerts?.length > visibleAlerts;
  const unreadCount = data.alerts?.filter(alert => !alert.read).length || 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Recent Alerts
          {unreadCount > 0 && (
            <Badge className="bg-primary">{unreadCount} new</Badge>
          )}
        </CardTitle>
        <CardDescription>Important notifications</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {data.alerts?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No recent alerts</p>
            </div>
          ) : (
            data.alerts?.slice(0, visibleAlerts).map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors ${
                  !alert.read ? 'bg-accent/30' : ''
                }`}
              >
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  alert.severity.toLowerCase() === 'critical' ? 'bg-destructive/20 text-destructive' :
                  alert.severity.toLowerCase() === 'high' ? 'bg-amber-500/20 text-amber-500' :
                  alert.severity.toLowerCase() === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-primary/20 text-primary'
                }`}>
                  <alert.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <p className="text-sm font-medium">{alert.title}</p>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </span>
                    {!alert.read && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 text-xs"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {hasMoreAlerts && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs mt-2"
              onClick={() => setVisibleAlerts(prev => prev + 3)}
            >
              Show more alerts
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <a href="/dashboard/alerts">
            View All Alerts
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
