"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  MoreHorizontal,
  Search,
  Shield,
  FileWarning,
  ExternalLink,
  Plus
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { usePolicyManagement } from "@/hooks/use-policy-management";

export function PolicyManagementCard() {
  const { data, isLoading, error } = usePolicyManagement();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };
  
  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  // Get policy status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <FileText className="h-3 w-3" />
            Draft
          </Badge>
        );
      case 'review':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <Clock className="h-3 w-3" />
            In Review
          </Badge>
        );
      case 'update required':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <FileWarning className="h-3 w-3" />
            Update Required
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter policies based on search and filter
  const filteredPolicies = data?.policies?.filter(policy => {
    // Filter by search
    const matchesSearch = policy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (policy.description && policy.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         policy.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesFilter = filter === "all" || policy.status.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  }) || [];
  
  // Sort policies - update required first, then by review date
  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    // First sort by status (update required first)
    if (a.status.toLowerCase() === "update required" && b.status.toLowerCase() !== "update required") {
      return -1;
    }
    if (a.status.toLowerCase() !== "update required" && b.status.toLowerCase() === "update required") {
      return 1;
    }
    
    // Then sort by next review date (ascending)
    return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
  });
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Policy Management
          </CardTitle>
          <CardDescription>Manage compliance policies and procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Policy Management
          </CardTitle>
          <CardDescription>Manage compliance policies and procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading policy management data
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Policy Management</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Manage and track compliance policies, procedures, and standards. Monitor review dates and approval status.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Manage compliance policies and procedures</span>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            New Policy
          </Button>
        </CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search policies..."
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mt-2 flex gap-2">
          <Button 
            variant={filter === "all" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "active" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button 
            variant={filter === "draft" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setFilter("draft")}
          >
            Draft
          </Button>
          <Button 
            variant={filter === "review" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setFilter("review")}
          >
            In Review
          </Button>
          <Button 
            variant={filter === "update required" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setFilter("update required")}
          >
            Update Required
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Policy stats */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Total Policies</div>
            <div className="text-xl font-bold">{data.stats.total}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Active</div>
            <div className="text-xl font-bold text-green-600">{data.stats.active}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Drafts</div>
            <div className="text-xl font-bold text-blue-600">{data.stats.draft}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">In Review</div>
            <div className="text-xl font-bold text-amber-600">{data.stats.review}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Update Required</div>
            <div className="text-xl font-bold text-red-600">{data.stats.updateRequired}</div>
          </div>
        </div>
        
        {/* Policy list */}
        <ScrollArea className="h-[340px] pr-4">
          {sortedPolicies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No policies found matching your search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPolicies.map((policy) => (
                <div key={policy.id} className="border rounded-md overflow-hidden">
                  <Link 
                    href={`/policies/${policy.id}`}
                    className="block p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{policy.name}</h3>
                          {getStatusBadge(policy.status)}
                          {policy.isRequired && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {policy.category}
                          </Badge>
                          {policy.version && (
                            <span className="text-xs text-muted-foreground">
                              v{policy.version}
                            </span>
                          )}
                        </div>
                        
                        {policy.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {policy.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <div className="text-right mt-3">
                          {policy.status.toLowerCase() === 'update required' ? (
                            <div className="flex items-center text-xs text-red-600 font-medium">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Update Due: {formatDate(policy.nextReviewDate)}
                            </div>
                          ) : (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              Review: {formatDate(policy.nextReviewDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t flex justify-between items-center">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div>
                          Last updated: {getRelativeTime(policy.lastUpdated)}
                        </div>
                        <div>
                          Owner: {policy.owner}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {policy.documentUrl && (
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <BookOpen className="h-3 w-3" />
                            View
                          </Button>
                        )}
                        {policy.status.toLowerCase() === 'active' && (
                          <Button variant="secondary" size="sm" className="h-7 text-xs gap-1">
                            <Check className="h-3 w-3" />
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {formatDate("2025-03-05T09:44:59Z")}
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
          <Link href="/policies">
            View All Policies
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
