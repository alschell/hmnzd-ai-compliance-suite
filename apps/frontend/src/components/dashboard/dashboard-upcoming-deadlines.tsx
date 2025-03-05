import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingDeadlines } from "@/hooks/use-upcoming-deadlines";
import { Calendar, Clock, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function DashboardUpcomingDeadlines() {
  const { data, isLoading, completeDeadline, refreshDeadlines } = useUpcomingDeadlines();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshDeadlines();
    } catch (error) {
      console.error("Failed to refresh deadlines:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCompleteDeadline = async (deadlineId: string) => {
    try {
      await completeDeadline(deadlineId);
    } catch (error) {
      console.error("Failed to complete deadline:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'regulatory':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Regulatory</Badge>;
      case 'assessment':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Assessment</Badge>;
      case 'report':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Report</Badge>;
      case 'audit':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Audit</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Other</Badge>;
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const isDeadlineOverdue = (dueDate: string) => {
    const now = new Date("2025-03-05T05:56:45Z"); // Using the current timestamp provided
    const deadlineDate = new Date(dueDate);
    return deadlineDate < now;
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Upcoming Deadlines</CardTitle>
            {!isLoading && data?.overdueCount ? (
              <Badge variant="destructive" className="ml-2">
                {data.overdueCount} overdue
              </Badge>
            ) : null}
          </div>
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
        <CardDescription>
          Important compliance deadlines and due dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : data?.deadlines && data.deadlines.length > 0 ? (
          <div className="space-y-4">
            {data.deadlines
              .filter(deadline => !deadline.completed)
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5)
              .map((deadline) => (
                <div 
                  key={deadline.id} 
                  className={`flex items-start space-x-4 rounded-md border p-3 ${
                    isDeadlineOverdue(deadline.dueDate) ? "border-red-200 bg-red-50" : ""
                  }`}
                >
                  <div className="mt-0.5">
                    {getPriorityIndicator(deadline.priority)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium leading-none">{deadline.title}</p>
                      {getCategoryBadge(deadline.category)}
                    </div>
                    {deadline.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {deadline.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span className={isDeadlineOverdue(deadline.dueDate) ? "text-red-500 font-medium" : ""}>
                          Due {formatDate(deadline.dueDate)}
                        </span>
                        {deadline.framework && (
                          <span className="ml-2 text-xs">• {deadline.framework}</span>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto py-0 text-xs"
                        onClick={() => handleCompleteDeadline(deadline.id)}
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Complete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground/70" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No upcoming deadlines
            </p>
          </div>
        )}
      </CardContent>
      {!isLoading && data?.deadlines && data.deadlines.length > 0 && (
        <CardFooter>
          <Link href="/deadlines" className="w-full">
            <Button variant="outline" className="w-full">
              View all deadlines
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
