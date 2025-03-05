"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  HelpCircle,
  Hourglass,
  Search,
  Shield,
  CheckCircle2,
  AlertOctagon,
  FileWarning,
  Plus,
  BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { useIncidentManagement } from "@/hooks/use-incident-management";
import { ScrollArea } from "@/components/ui/scroll-area";

export function IncidentManagementCard() {
  const { data, isLoading, error } = useIncidentManagement();
  const [searchQuery, setSearchQuery] = useState("");
  const currentDate = new Date("2025-03-05T09:47:13Z");
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };
  
  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Determine if SLA is breached or at risk
  const getSlaStatus = (incident: any) => {
    if (incident.status === 'Closed' || incident.status === 'Resolved') return 'met';
    
    if (incident.slaDeadline) {
      const deadline = new Date(incident.slaDeadline);
      const hoursLeft = (deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursLeft < 0) return 'breached';
      if (hoursLeft < 24) return 'at-risk';
    }
    
    return 'on-track';
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <AlertCircle className="h-3 w-3" />
            Open
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <Hourglass className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Resolved
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return (
          <Badge className="bg-red-100 text-red-800">
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-green-100 text-green-800">
            Low
          </Badge>
        );
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  // Get category badge with icon
  const getCategoryBadge = (category: string) => {
    const icon = category.toLowerCase() === 'security' ? 
      <Shield className="h-3 w-3 mr-1" /> : 
      category.toLowerCase() === 'data breach' ? 
      <FileWarning className="h-3 w-3 mr-1" /> : 
      category.toLowerCase() === 'compliance' ? 
      <AlertOctagon className="h-3 w-3 mr-1" /> : 
      <AlertTriangle className="h-3 w-3 mr-1" />;
    
    return (
      <Badge variant="secondary" className="flex items-center text-xs gap-1">
        {icon}
        {category}
      </Badge>
    );
  };
  
  // Filter incidents based on search
  const filteredIncidents = data?.incidents?.filter(incident => 
    incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (incident.description && incident.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    incident.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Sort incidents by priority (open + critical first, then severity, then createdAt)
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    // First sort by open vs. closed
    if ((a.status === 'Open' || a.status === 'In Progress') && 
        (b.status === 'Resolved' || b.status === 'Closed')) {
      return -1;
    }
    if ((b.status === 'Open' || b.status === 'In Progress') && 
        (a.status === 'Resolved' || a.status === 'Closed')) {
      return 1;
    }
    
    // Next sort by severity
    const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    if (severityOrder[a.severity as keyof typeof severityOrder] !== 
        severityOrder[b.severity as keyof typeof severityOrder]) {
      return severityOrder[a.severity as keyof typeof severityOrder] - 
             severityOrder[b.severity as keyof typeof severityOrder];
    }
    
    // Finally sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Incident Management
          </CardTitle>
          <CardDescription>Track and manage compliance incidents</CardDescription>
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
            <AlertCircle className="h-5 w-5 mr-2" />
            Incident Management
          </CardTitle>
          <CardDescription>Track and manage compliance incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading incident management data
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
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Incident Management</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
              <Link href="/incidents/reports">
                <BarChart3 className="h-3.5 w-3.5 mr-1" />
                Reports
              </Link>
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-1" asChild>
              <Link href="/incidents/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Incident
              </Link>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Track and manage security incidents, data breaches, and compliance violations.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Track and respond to security and compliance incidents</CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search incidents..."
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Incident stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Open Incidents</div>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.open}</div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-muted-foreground">Critical: {data.stats.openCritical}</span>
              <span className="text-muted-foreground">High: {data.stats.openHigh}</span>
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">SLA Breached</div>
              <AlertOctagon className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{data.stats.slaBreached}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              At Risk: {data.stats.slaAtRisk}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Avg. Resolution Time</div>
              <Clock className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.avgResolutionTime}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Last 30 days
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Total (Year)</div>
              <Shield className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.totalYear}</div>
            <div className="mt-1 text-xs">
              {data.stats.yearChange >= 0 ? (
                <span className="text-red-500">+{data.stats.yearChange}% YoY</span>
              ) : (
                <span className="text-green-600">{data.stats.yearChange}% YoY</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Incidents list */}
        <ScrollArea className="h-[360px] pr-4">
          {sortedIncidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No incidents found matching your search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedIncidents.map((incident) => {
                const slaStatus = getSlaStatus(incident);
                
                return (
                  <div key={incident.id} className="border rounded-md overflow-hidden">
                    <Link 
                      href={`/incidents/${incident.id}`}
                      className="block hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{incident.title}</h3>
                              {getSeverityBadge(incident.severity)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{incident.id}</span>
                              {getCategoryBadge(incident.category)}
                            </div>
                            
                            {incident.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {incident.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end">
                            {getStatusBadge(incident.status)}
                            <div className="text-right mt-2 text-xs text-muted-foreground">
                              Reported {getRelativeTime(incident.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        {/* SLA progress */}
                        {(incident.status === 'Open' || incident.status === 'In Progress') && incident.slaDeadline && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1 text-xs">
                              <span className="text-muted-foreground">SLA Deadline</span>
                              <span className={
                                slaStatus === 'breached' ? 'text-red-600 font-medium' : 
                                slaStatus === 'at-risk' ? 'text-amber-600 font-medium' : 
                                'text-muted-foreground'
                              }>
                                {slaStatus === 'breached' ? 'Breached' : formatDate(incident.slaDeadline)}
                              </span>
                            </div>
                            <Progress 
                              value={incident.slaPercentage} 
                              className="h-1.5" 
                              indicatorClassName={
                                slaStatus === 'breached' ? 'bg-red-600' : 
                                slaStatus === 'at-risk' ? 'bg-amber-500' : 
                                'bg-blue-600'
                              }
                            />
                          </div>
                        )}
                        
                        {/* Assigned team/person and actions taken */}
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <div className="text-xs text-muted-foreground flex items-center">
                            <span>Assigned: {incident.assignedTo || 'Unassigned'}</span>
                            <span className="mx-2">•</span>
                            <span>Actions: {incident.actionsCount || 0}</span>
                          </div>
                          <div>
                            {incident.status !== 'Closed' && (
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                Update
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date("2025-03-05T09:47:13Z"), "MMM d, yyyy HH:mm:ss")}
        </div>
        <Button variant="outline" size="sm" className="text-xs" asChild>
          <Link href="/incidents">
            View All Incidents
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
