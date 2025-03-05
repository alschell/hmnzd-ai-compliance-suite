"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  ArrowUpRight,
  HelpCircle,
  Plus,
  Clock,
  Calendar,
  XCircle,
  BarChart2,
  ExternalLink,
  Filter,
  ClipboardCheck
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { useVendorRisk } from "@/hooks/use-vendor-risk";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VendorRiskCard() {
  const { data, isLoading, error } = useVendorRisk();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"vendors" | "assessments" | "issues">("vendors");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const currentDate = new Date("2025-03-05T12:14:33Z");
  const currentUser = "alschell";
  
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
  
  // Get risk level badge
  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{riskLevel}</Badge>;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Expired
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter vendors based on search and risk level
  const filteredVendors = data?.vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.description && vendor.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vendor.category && vendor.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRiskLevel = selectedRiskLevel === "all" || 
      vendor.riskLevel.toLowerCase() === selectedRiskLevel.toLowerCase();
    
    const matchesCategory = selectedCategory === "all" || 
      vendor.category === selectedCategory;
    
    return matchesSearch && matchesRiskLevel && matchesCategory;
  }) || [];
  
  // Filter assessments based on search
  const filteredAssessments = data?.assessments.filter(assessment => {
    const matchesSearch = 
      assessment.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) || [];
  
  // Filter issues based on search
  const filteredIssues = data?.issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.description && issue.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  }) || [];
  
  // Sort vendors by risk level (highest to lowest)
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    const riskOrder: Record<string, number> = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3
    };
    
    return (riskOrder[a.riskLevel.toLowerCase()] || 4) - (riskOrder[b.riskLevel.toLowerCase()] || 4);
  });
  
  // Sort assessments by date (most recent first)
  const sortedAssessments = [...filteredAssessments].sort((a, b) => 
    new Date(b.completionDate || b.dueDate).getTime() - new Date(a.completionDate || a.dueDate).getTime()
  );
  
  // Sort issues by severity
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const severityOrder: Record<string, number> = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3
    };
    
    return (severityOrder[a.severity.toLowerCase()] || 4) - (severityOrder[b.severity.toLowerCase()] || 4);
  });
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Vendor Risk Management
          </CardTitle>
          <CardDescription>Track and manage third-party vendor risks</CardDescription>
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
            <Building className="h-5 w-5 mr-2" />
            Vendor Risk Management
          </CardTitle>
          <CardDescription>Track and manage third-party vendor risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading vendor risk data
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
            <Building className="h-5 w-5" />
            <CardTitle>Vendor Risk Management</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
              <Link href="/vendors/assessments">
                <BarChart2 className="h-3.5 w-3.5 mr-1" />
                Assessment Reports
              </Link>
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-1" asChild>
              <Link href="/vendors/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Vendor
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
                  <p>Track, assess, and manage risks associated with third-party vendors and service providers.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Assess and manage third-party vendor security and compliance risks</CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={
              activeTab === "vendors" ? "Search vendors..." : 
              activeTab === "assessments" ? "Search assessments..." : 
              "Search issues..."
            }
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="vendors" value={activeTab} onValueChange={(value) => setActiveTab(value as "vendors" | "assessments" | "issues")} className="mt-2">
          <TabsList className="grid w-[360px] grid-cols-3">
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Risk stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Total Vendors</div>
              <Building className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.totalVendors}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Active: {data.stats.activeVendors}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">High Risk Vendors</div>
              <ShieldAlert className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{data.stats.highRiskVendors}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Critical: {data.stats.criticalRiskVendors}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Assessments Due</div>
              <Calendar className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{data.stats.assessmentsDue}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Overdue: {data.stats.overdueAssessments}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Open Issues</div>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{data.stats.openIssues}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              High Severity: {data.stats.highSeverityIssues}
            </div>
          </div>
        </div>
        
        <TabsContent value="vendors" className="mt-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Risk Level:</span>
            </div>
            <Button 
              variant={selectedRiskLevel === "all" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedRiskLevel("all")}
            >
              All
            </Button>
            <Button 
              variant={selectedRiskLevel === "critical" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedRiskLevel("critical")}
            >
              Critical
            </Button>
            <Button 
              variant={selectedRiskLevel === "high" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedRiskLevel("high")}
            >
              High
            </Button>
            <Button 
              variant={selectedRiskLevel === "medium" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedRiskLevel("medium")}
            >
              Medium
            </Button>
            <Button 
              variant={selectedRiskLevel === "low" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedRiskLevel("low")}
            >
              Low
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Category:</span>
            </div>
            <select
              className="text-sm border rounded-md px-2 py-1"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {data.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <ScrollArea className="h-[310px] pr-4">
            {sortedVendors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No vendors found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedVendors.map((vendor) => (
                  <div key={vendor.id} className="border rounded-md overflow-hidden">
                    <Link 
                      href={`/vendors/${vendor.id}`}
                      className="block hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{vendor.name}</h3>
                              {getRiskLevelBadge(vendor.riskLevel)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{vendor.id}</span>
                              {vendor.category && (
                                <Badge variant="outline" className="text-xs">
                                  {vendor.category}
                                </Badge>
                              )}
                            </div>
                            
                            {vendor.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {vendor.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            {vendor.nextAssessment && (
                              <div className={cn(
                                "text-xs",
                                new Date(vendor.nextAssessment) < currentDate 
                                  ? "text-red-600 font-medium" 
                                  : "text-muted-foreground"
                              )}>
                                Next Assessment: {formatDate(vendor.nextAssessment)}
                              </div>
                            )}
                            {vendor.dataAccessed && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Data: {vendor.dataAccessed.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Risk scores */}
                        {vendor.riskScores && (
                          <div className="mt-3 grid grid-cols-3 gap-3">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Security</div>
                              <div className="flex items-center">
                                <Progress 
                                  value={vendor.riskScores.security} 
                                  className={cn(
                                    "h-1.5 flex-1",
                                    vendor.riskScores.security >= 70 ? "text-green-600" :
                                    vendor.riskScores.security >= 50 ? "text-amber-600" :
                                    "text-red-600"
                                  )}
                                />
                                <span className="ml-2 text-xs font-medium">
                                  {vendor.riskScores.security}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Privacy</div>
                              <div className="flex items-center">
                                <Progress 
                                  value={vendor.riskScores.privacy} 
                                  className={cn(
                                    "h-1.5 flex-1",
                                    vendor.riskScores.privacy >= 70 ? "text-green-600" :
                                    vendor.riskScores.privacy >= 50 ? "text-amber-600" :
                                    "text-red-600"
                                  )}
                                />
                                <span className="ml-2 text-xs font-medium">
                                  {vendor.riskScores.privacy}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Compliance</div>
                              <div className="flex items-center">
                                <Progress 
                                  value={vendor.riskScores.compliance} 
                                  className={cn(
                                    "h-1.5 flex-1",
                                    vendor.riskScores.compliance >= 70 ? "text-green-600" :
                                    vendor.riskScores.compliance >= 50 ? "text-amber-600" :
                                    "text-red-600"
                                  )}
                                />
                                <span className="ml-2 text-xs font-medium">
                                  {vendor.riskScores.compliance}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Vendor metadata */}
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            <span>Last assessed: {
                              vendor.lastAssessmentDate ? 
                              getRelativeTime(vendor.lastAssessmentDate) : 
                              "Never"
                            }</span>
                            {vendor.openIssues !== undefined && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Issues: {vendor.openIssues}</span>
                              </>
                            )}
                          </div>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            View Details
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="assessments" className="mt-0">
          <ScrollArea className="h-[350px] pr-4">
            {sortedAssessments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardCheck className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No assessments found matching your search</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAssessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-md overflow-hidden">
                    <Link 
                      href={`/vendors/assessments/${assessment.id}`}
                      className="block hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{assessment.type}</h3>
                              {getStatusBadge(assessment.status)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{assessment.id}</span>
                              <span className="text-sm font-medium">
                                {assessment.vendorName}
                              </span>
                              {assessment.riskLevel && (
                                getRiskLevelBadge(assessment.riskLevel)
                              )}
                            </div>
                            
                            {assessment.scope && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Scope: {assessment.scope}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              {assessment.completionDate ? (
                                <span>Completed: {formatDate(assessment.completionDate)}</span>
                              ) : (
                                <span className={cn(
                                  new Date(assessment.dueDate) < currentDate 
                                    ? "text-red-600 font-medium" 
                                    : "text-muted-foreground"
                                )}>
                                  Due: {formatDate(assessment.dueDate)}
                                </span>
                              )}
                            </div>
                            {assessment.nextDueDate && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Next Due: {formatDate(assessment.nextDueDate)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Assessment progress */}
                        {assessment.status === "In Progress" && assessment.progress !== undefined && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1 text-xs">
                              <span className="font-medium">Progress</span>
                              <span>{assessment.progress}% complete</span>
                            </div>
                            <Progress value={assessment.progress} className="h-1.5" />
                          </div>
                        )}
                        
                        {/* Assessment stats */}
                        {assessment.issues !== undefined && (
                          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                            <div>
                              <div className="text-muted-foreground">Issues</div>
                              <div className={assessment.issues > 0 ? "text-amber-600 font-medium" : ""}>
                                {assessment.issues}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">High Risk</div>
                              <div className={assessment.highRiskIssues > 0 ? "text-red-600 font-medium" : ""}>
                                {assessment.highRiskIssues}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Remediated</div>
                              <div>{assessment.remediatedIssues}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Controls</div>
                              <div>{assessment.controlsAssessed}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Assessment metadata */}
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            <span>Assessor: {assessment.assessor}</span>
                            {assessment.method && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Method: {assessment.method}</span>
                              </>
                            )}
                          </div>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            View Report
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="issues" className="mt-0">
          <ScrollArea className="h-[350px] pr-4">
            {sortedIssues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No issues found matching your search</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={cn(
                      "border rounded-md overflow-hidden",
                      issue.status.toLowerCase() === 'open' && issue.severity.toLowerCase() === 'critical' 
                        ? "border-red-300 bg-red-50/20" : ""
                    )}
                  >
                    <Link 
                      href={`/vendors/issues/${issue.id}`}
                      className="block hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{issue.title}</h3>
                              {getRiskLevelBadge(issue.severity)}
                              <Badge variant={issue.status.toLowerCase() === 'open' ? 'destructive' : 'outline'} className="text-xs">
                                {issue.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{issue.id}</span>
                              <span className="text-sm font-medium">
                                {issue.vendorName}
                              </span>
