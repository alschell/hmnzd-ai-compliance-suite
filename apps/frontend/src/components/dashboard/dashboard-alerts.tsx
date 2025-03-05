import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/use-alerts";
import { Bell, CheckCircle, RefreshCw, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Alert } from "@/hooks/use-alerts";

export function DashboardAlerts() {
  const { data, isLoading, markAlertAsRead, markAllAlertsAsRead, refreshAlerts } = useAlerts();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshAlerts();
    } catch (error) {
      console.error("Failed to refresh alerts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAlertsAsRead();
    } catch (error) {
      console.error("Failed to mark all alerts as read:", error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date("2025-03-05T05:55:36Z"); // Using the provided current date
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    if (type === 'error') return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (type === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    if (type === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return "text-red-500 bg-red-100";
      case 'high': return "text-orange-500 bg-orange-100";
      case 'medium': return "text-amber-500 bg-amber-100";
      case 'low': return "text-green-500 bg-green-100";
      default: return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Recent Alerts</CardTitle>
            {!isLoading && data?.unreadCount ? (
              <Badge variant="destructive" className="ml-2">
                {data.unreadCount} new
              </Badge>
            ) : null}
          </div>
          <div className="flex space-x-2">
            {!isLoading && data?.unreadCount ? (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Mark all read
              </Button>
            ) : null}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={refreshing || isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
        <CardDescription>
          System notifications and compliance alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : data?.alerts && data.alerts.length > 0 ? (
          <div className="space-y-4">
            {data.alerts.slice(0, 5).map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start space-x-4 rounded-md border p-3 ${alert.read ? "" : "bg-muted/50"}`}
              >
                <div className="mt-0.5">
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium leading-none">{alert.title}</p>
                    <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(alert.createdAt)}
                    </span>
                    {!alert.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto py-0 text-xs"
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed">
            <CheckCircle className="h-8 w-8 text-muted-foreground/70" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No alerts to display
            </p>
          </div>
        )}
      </CardContent>
      {!isLoading && data?.alerts && data.alerts.length > 5 && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            View all {data.alerts.length} alerts
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
