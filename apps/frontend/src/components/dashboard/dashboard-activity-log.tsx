import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivityLog } from "@/hooks/use-activity-log";
import { Clock, RefreshCw, Search, Filter, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardActivityLog() {
  const { data, isLoading, refreshActivityLog } = useActivityLog();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshActivityLog();
    } catch (error) {
      console.error("Failed to refresh activity log:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date("2025-03-05T06:45:42Z"); // Current timestamp from user
    const date = new Date(dateString);
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)} minutes ago`;
    } else if (diffSeconds < 86400) {
      return `${Math.floor(diffSeconds / 3600)} hours ago`;
    } else if (diffSeconds < 604800) {
      return `${Math.floor(diffSeconds / 86400)} days ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'user':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">User</Badge>;
      case 'system':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">System</Badge>;
      case 'compliance':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Compliance</Badge>;
      case 'security':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Security</Badge>;
      case 'audit':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Audit</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{category}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const filteredActivities = data?.activities
    ? data.activities
        .filter(activity => 
          (searchQuery === "" || 
           activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           activity.user?.name.toLowerCase().includes(searchQuery.toLowerCase())) && 
          (filterCategory === "all" || activity.category === filterCategory)
        )
    : [];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Activity Log</CardTitle>
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
          Recent activities and changes in your compliance environment
        </CardDescription>
        
        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search activities..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="user">My Activities</TabsTrigger>
            <TabsTrigger value="important">Important</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    {activity.user ? (
                      <Avatar>
                        <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
                        <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarFallback>SYS</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                          {activity.user ? activity.user.name : "System"}
                        </p>
                        <div className="flex items-center space-x-2">
                          {getCategoryBadge(activity.category)}
                          <span className="text-xs text-muted-foreground">{getRelativeTime(activity.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      {activity.details && (
                        <p className="text-xs text-muted-foreground mt-1 border-l-2 border-muted pl-2">
                          {activity.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed">
                <CheckCircle className="h-8 w-8 text-muted-foreground/70" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  No activities found
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="user">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities
                  .filter(activity => activity.user?.username === "alschell") // Current user's login
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={activity.user?.avatarUrl} alt={activity.user?.name} />
                        <AvatarFallback>{getInitials(activity.user?.name || "")}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">
                            {activity.user?.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            {getCategoryBadge(activity.category)}
                            <span className="text-xs text-muted-foreground">{getRelativeTime(activity.timestamp)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        {activity.details && (
                          <p className="text-xs text-muted-foreground mt-1 border-l-2 border-muted pl-2">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="important">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities
                  .filter(activity => activity.important)
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      {activity.user ? (
                        <Avatar>
                          <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
                          <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AvatarFallback>SYS</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">
                            {activity.user ? activity.user.name : "System"}
                          </p>
                          <div className="flex items-center space-x-2">
                            {getCategoryBadge(activity.category)}
                            <span className="text-xs text-muted-foreground">{getRelativeTime(activity.timestamp)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        {activity.details && (
                          <p className="text-xs text-muted-foreground mt-1 border-l-2 border-muted pl-2">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      {!isLoading && data?.activities && data.activities.length > 10 && (
        <CardFooter>
          <Link href="/activity" className="w-full">
            <Button variant="outline" className="w-full">
              View full activity log
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
