import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight, Clock, Filter, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useActivityLog } from '@/hooks/use-activity-log';
import { format, formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ActivityLog() {
  const { data, isLoading, error } = useActivityLog();
  const [visibleActivities, setVisibleActivities] = useState(5);
  const [activeTab, setActiveTab] = useState('all');
  
  // Function to get activity type badge
  const getActivityTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'login':
        return <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-500">Login</Badge>;
      case 'document':
        return <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-500">Document</Badge>;
      case 'assessment':
        return <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-500">Assessment</Badge>;
      case 'settings':
        return <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-500">Settings</Badge>;
      case 'user':
        return <Badge variant="outline" className="border-indigo-500/50 bg-indigo-500/10 text-indigo-500">User</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  // Filter activities based on active tab
  const filteredActivities = data?.activities?.filter(activity => {
    if (activeTab === 'all') return true;
    return activity.type.toLowerCase() === activeTab.toLowerCase();
  }) || [];
  
  // Show more activities handler
  const handleShowMore = () => {
    setVisibleActivities(prev => prev + 5);
  };
  
  if (isLoading) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Activity Log
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="advanced-tooltip">
                  <p>Record of all compliance-related activities and system events.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Recent system activity</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Activity Log</CardTitle>
          <CardDescription>Recent system activity</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center text-destructive py-6">
            Error loading activity logs
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasMoreActivities = filteredActivities.length > visibleActivities;
  
  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Activity Log
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="advanced-tooltip">
                <p>Record of all compliance-related activities and system events.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Recent system activity</span>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
            <Filter className="h-3 w-3" />
            Filter
          </Button>
        </CardDescription>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid grid-cols-5 h-8">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="document" className="text-xs">Documents</TabsTrigger>
            <TabsTrigger value="assessment" className="text-xs">Assessments</TabsTrigger>
            <TabsTrigger value="user" className="text-xs">Users</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pb-2 pt-3">
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No activity logs found</p>
            </div>
          ) : (
            filteredActivities.slice(0, visibleActivities).map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>
                      <span className="text-muted-foreground"> {activity.action}</span>
                    </p>
                    {getActivityTypeBadge(activity.type)}
                  </div>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.details}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">
                          {format(new Date(activity.timestamp), 'PPpp')}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {hasMoreActivities && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={handleShowMore}
            >
              Show more activities
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <a href="/dashboard/activity">
            View Full Activity Log
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
