"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileCheck,
  Filter,
  HelpCircle,
  Search,
  XCircle,
  AlertCircle,
  Calendar,
  ArrowRight,
  BarChart2,
  Plus
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { useAuditManagement } from "@/hooks/use-audit-management";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuditManagementCard() {
  const { data, isLoading, error } = useAuditManagement();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"audits" | "findings">("audits");
  const currentDate = new Date("2025-03-05T09:51:02Z");
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };
  
  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  // Get audit status badge
  const getAuditStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planned':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <Calendar className="h-3 w-3" />
            Planned
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get finding status badge
  const getFindingStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <AlertCircle className="h-3 w-3" />
            Open
          </Badge>
        );
      case 'in remediation':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <Clock className="h-3 w-3" />
            In Remediation
          </Badge>
        );
      case 'remediated':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Remediated
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
            <FileCheck className="h-3 w-3" />
            Accepted
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get severity badge for findings
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  // Filter audits based on search
  const filteredAudits = data?.audits?.filter(audit => 
    audit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.auditor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.framework.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Filter findings based on search
  const filteredFindings = data?.findings?.filter(finding => 
    finding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finding.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    finding.auditId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (finding.description && finding.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    finding.control.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Sort audits by date (upcoming first, then in progress, then recently completed)
  const sortedAudits = [...filteredAudits].sort((a, b) => {
    // First sort by status
    const statusOrder = { 'planned': 0, 'in progress': 1, 'completed': 2 };
    if (a.status.toLowerCase() !== b.status.toLowerCase()) {
      return statusOrder[a.status.toLowerCase() as keyof typeof statusOrder] - 
             statusOrder[b.status.toLowerCase() as keyof typeof statusOrder];
    }
    
    // For planned audits, sort by start date (soonest first)
    if (a.status.toLowerCase() === 'planned') {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    
    // For completed audits, sort by end date (most recent first)
    if (a.status.toLowerCase() === 'completed') {
      return new Date(b.endDate || '').getTime() - new Date(a.endDate || '').getTime();
    }
    
    // Default sorting by ID
    return a.id.localeCompare(b.id);
  });
  
  // Sort findings by priority (open + critical first, then by due date)
  const sortedFindings = [...filteredFindings].sort((a, b) => {
    // First sort by status (open first)
    const statusOrder = { 'open': 0, 'in remediation': 1, 'remediated': 2, 'accepted': 3 };
    if (a.status.toLowerCase() !== b.status.toLowerCase()) {
      return statusOrder[a.status.toLowerCase() as keyof typeof statusOrder] - 
             statusOrder[b.status.toLowerCase() as keyof typeof statusOrder];
    }
    
    // Next sort by severity
    const severityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    if (a.severity.toLowerCase() !== b.severity.toLowerCase()) {
      return severityOrder[a.severity.toLowerCase() as keyof typeof severityOrder] - 
             severityOrder[b.severity.toLowerCase() as keyof typeof severityOrder];
    }
    
    // Finally sort by due date (soonest first)
    return new Date(a.remediationDueDate || '').getTime() - new Date(b.remediationDueDate || '').getTime();
  });
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardCheck className="h-5 w-5 mr-2" />
            Audit Management
          </CardTitle>
          <CardDescription>Track compliance audits and findings</CardDescription>
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
            <ClipboardCheck className="h-5 w-5 mr-2" />
            Audit Management
          </CardTitle>
          <CardDescription>Track compliance audits and findings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading audit management data
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
            <ClipboardCheck className="h-5 w-5" />
            <CardTitle>Audit Management</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
              <Link href="/audits/reports">
                <BarChart2 className="h-3.5 w-3.5 mr-1" />
                Reports
              </Link>
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-1" asChild>
              <Link href="/audits/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Audit
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
                  <p>Track internal and external compliance audits, manage findings, and monitor remediation progress.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Track audits, findings, and remediation activities</CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={activeTab === "audits" ? "Search audits..." : "Search findings..."}
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Audit stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Upcoming Audits</div>
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.planned}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Next: {formatDate(data.stats.nextAuditDate)}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Open Findings</div>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{data.stats.openFindings}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Critical: {data.stats.criticalFindings}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">In Remediation</div>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{data.stats.inRemediationFindings}</div>
            <div className="flex items-center mt-1 text-xs">
              <Progress 
                value={data.stats.remediationProgress} 
                className="h-1 w-24" 
              />
              <span className="ml-2 text-muted-foreground">{data.stats.remediationProgress}%</span>
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Annual Progress</div>
              <FileCheck className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.completedThisYear}</div>
            <div className="mt-1 text-xs">
              <span className="text-muted-foreground">
                {data.stats.completedThisYear} of {data.stats.plannedThisYear} ({Math.round((data.stats.completedThisYear / data.stats.plannedThisYear) * 100)}%)
              </span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="audits" value={activeTab} onValueChange={(value) => setActiveTab(value as "audits" | "findings")}>
          <TabsList className="grid w-[240px] grid-cols-2 mb-4">
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audits" className="mt-0">
            <ScrollArea className="h-[360px] pr-4">
              {sortedAudits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardCheck className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No audits found matching your search</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedAudits.map((audit) => (
                    <div key={audit.id} className="border rounded-md overflow-hidden">
                      <Link 
                        href={`/audits/${audit.id}`}
                        className="block hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{audit.name}</h3>
                                {getAuditStatusBadge(audit.status)}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{audit.id}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {audit.framework}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">
                                {audit.type === 'Internal' ? 'Internal Audit' : 'External Audit'}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {audit.auditor}
                              </div>
                            </div>
                          </div>
                          
                          {/* Audit details */}
                          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                            <div>
                              <span className="text-muted-foreground">Start Date:</span>{' '}
                              <span>{formatDate(audit.startDate)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">End Date:</span>{' '}
                              <span>{formatDate(audit.endDate)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Scope:</span>{' '}
                              <span>{audit.scope || 'Full'}</span>
                            </div>
                          </div>
                          
                          {/* Findings summary */}
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-medium">Findings Summary</div>
                              <div className="flex space-x-2">
                                {audit.findingStats && (
                                  <>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                      {audit.findingStats.open || 0} Open
                                    </Badge>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                      {audit.findingStats.inRemediation || 0} In Progress
                                    </Badge>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                      {audit.findingStats.closed || 0} Closed
                                    </Badge>
                                  </>
                                )}
                                {(!audit.findingStats || 
                                 (audit.findingStats.open === 0 && 
                                  audit.findingStats.inRemediation === 0 && 
                                  audit.findingStats.closed === 0)) && (
                                  <span className="text-xs text-muted-foreground">No findings</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="findings" className="mt-0">
            <ScrollArea className="h-[360px] pr-4">
              {sortedFindings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No findings found matching your search</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedFindings.map((finding) => (
                    <div key={finding.id} className="border rounded-md overflow-hidden">
                      <Link 
                        href={`/audits/findings/${finding.id}`}
                        className="block hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{finding.title}</h3>
                                {getSeverityBadge(finding.severity)}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{finding.id}</span>
                                <Badge variant="outline" className="text-xs">
                                  {finding.control}
                                </Badge>
                              </div>
                              
                              {finding.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {finding.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end">
                              {getFindingStatusBadge(finding.status)}
                              <div className="text-xs text-muted-foreground mt-1">
                                Audit: {finding.auditId}
                              </div>
                            </div>
                          </div>
                          
                          {/* Remediation details */}
                          {(finding.status === 'Open' || finding.status === 'In Remediation') && finding.remediationDueDate && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1 text-xs">
                                <span className="text-muted-foreground">Remediation Due</span>
                                <span className={
                                  new Date(finding.remediationDueDate) < currentDate 
                                    ? 'text-red-600 font-medium' 
                                    : 'text-muted-foreground'
                                }>
                                  {formatDate(finding.remediationDueDate)}
                                </span>
                              </div>
                              {finding.remediationProgress !== undefined && (
                                <Progress 
                                  value={finding.remediationProgress} 
                                  className="h-1.5" 
                                />
                              )}
                            </div>
                          )}
                          
                          {/* Owner and updated info */}
                          <div className="mt-3 pt-3 border-t flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                              <span>Owner: {finding.owner || 'Unassigned'}</span>
                              {finding.lastUpdated && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Updated: {getRelativeTime(finding.lastUpdated)}</span>
                                </>
                              )}
                            </div>
                            {(finding.status === 'Open' || finding.status === 'In Remediation') && (
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                Update
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
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date("2025-03-05T09:51:02Z"), "MMM d, yyyy HH:mm:ss")}
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
          <Link href="/audits">
            View All Audits
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
