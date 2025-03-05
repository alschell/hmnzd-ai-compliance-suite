import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight, Calendar, Clock, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useDeadlines } from '@/hooks/use-deadlines';
import { formatDistanceToNow } from 'date-fns';

export function UpcomingDeadlines() {
  const { data, isLoading, error } = useDeadlines();
  const [visibleDeadlines, setVisibleDeadlines] = useState(3);
  
  // Function to render priority badge with appropriate color
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return <Badge className="risk-badge-critical">Urgent</Badge>;
      case 'high':
        return <Badge className="risk-badge-high">High</Badge>;
      case 'medium':
        return <Badge className="risk-badge-medium">Medium</Badge>;
      case 'low':
        return <Badge className="risk-badge-low">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Upcoming Deadlines
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="advanced-tooltip">
                  <p>Critical regulatory deadlines and compliance tasks requiring attention.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Upcoming compliance dates</CardDescription>
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
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          <CardDescription>Upcoming compliance dates</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center text-destructive py-6">
            Error loading deadline data
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hasMoreDeadlines = data.length > visibleDeadlines;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Upcoming Deadlines
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="advanced-tooltip">
                <p>Critical regulatory deadlines and compliance tasks requiring attention.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Upcoming compliance dates</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {data.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No upcoming deadlines</p>
            </div>
          ) : (
            data.slice(0, visibleDeadlines).map((deadline, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{deadline.title}</p>
                    {getPriorityBadge(deadline.priority)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {formatDistanceToNow(new Date(deadline.dueDate), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {hasMoreDeadlines && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs mt-2"
              onClick={() => setVisibleDeadlines(prev => prev + 3)}
            >
              Show more
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <a href="/dashboard/calendar">
            View All Deadlines
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
