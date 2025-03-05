import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRegulatoryUpdates } from "@/hooks/use-regulatory-updates";
import { FileText, ExternalLink, BookOpen, RefreshCw, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function DashboardRegulatoryUpdates() {
  const { data, isLoading, markUpdateAsRead, markAllAsRead, refreshUpdates } = useRegulatoryUpdates();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshUpdates();
    } catch (error) {
      console.error("Failed to refresh regulatory updates:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (updateId: string) => {
    try {
      await markUpdateAsRead(updateId);
    } catch (error) {
      console.error("Failed to mark update as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all updates as read:", error);
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
      case 'new':
        return <Badge variant="default" className="bg-blue-500">New</Badge>;
      case 'amendment':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Amendment</Badge>;
      case 'guidance':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Guidance</Badge>;
      case 'enforcement':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Enforcement</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Upcoming</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Other</Badge>;
    }
  };

  const getRelevanceBadge = (relevance: string) => {
    switch (relevance) {
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High Relevance</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium Relevance</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low Relevance</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Regulatory Updates</CardTitle>
            {!isLoading && data?.unreadCount ? (
              <Badge variant="secondary" className="ml-2">
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
          Recent regulatory changes and compliance updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : data?.updates && data.updates.length > 0 ? (
          <div className="space-y-4">
            {data.updates
              .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              .slice(0, 5)
              .map((update) => (
                <div 
                  key={update.id} 
                  className={`space-y-3 rounded-md border p-3 ${update.read ? "" : "bg-muted/50"}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{update.title}</span>
                        {!update.read && (
                          <Badge variant="default" className="bg-blue-500">New</Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{update.source}</span>
                        <span>•</span>
                        <span>{formatDate(update.publishedAt)}</span>
                        <span>•</span>
                        <span>{update.region}</span>
                        {update.framework && (
                          <>
                            <span>•</span>
                            <span>{update.framework}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {getCategoryBadge(update.category)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {update.summary}
                  </p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      {getRelevanceBadge(update.relevance)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {update.sourceUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-2"
                          asChild
                        >
                          <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Source
                          </a>
                        </Button>
                      )}
                      {!update.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2"
                          onClick={() => handleMarkAsRead(update.id)}
                        >
                          <BookOpen className="mr-1 h-3 w-3" />
                          Mark read
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
              No regulatory updates to display
            </p>
          </div>
        )}
      </CardContent>
      {!isLoading && data?.updates && data.updates.length > 5 && (
        <CardFooter>
          <Link href="/regulations" className="w-full">
            <Button variant="outline" className="w-full">
              View all regulatory updates
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
