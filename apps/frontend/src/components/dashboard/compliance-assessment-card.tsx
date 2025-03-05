"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardCheck,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart2,
  ArrowUpRight,
  HelpCircle,
  Plus,
  Clock,
  Calendar,
  ChevronRight,
  ExternalLink,
  Shield
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { useComplianceAssessment } from "@/hooks/use-compliance-assessment";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ComplianceAssessmentCard() {
  const { data, isLoading, error } = useComplianceAssessment();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"frameworks" | "assessments" | "findings">("frameworks");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const currentDate = new Date("2025-03-05T12:06:56Z");
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
  
  // Get status badge for assessment
  const getAssessmentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Compliant
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <XCircle className="h-3 w-3" />
            Non-Compliant
          </Badge>
        );
      case 'planned':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
            <Calendar className="h-3 w-3" />
            Planned
          </Badge>
        );
      case 'remediation':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Remediation
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
  
  // Filter frameworks based on search
  const filterFrameworks = () => {
    if (!data?.frameworks) return [];
    
    return data.frameworks.filter(framework => 
      framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (framework.description && framework.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      framework.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // Filter assessments based on search and selected status
  const filterAssessments = () => {
    if (!data?.assessments) return [];
    
    return data.assessments.filter(assessment => {
      const matchesSearch = 
        assessment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.framework.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === "all" || 
                          assessment.status.toLowerCase() === selectedStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  };
  
  // Filter findings based on search
  const filterFindings = () => {
    if (!data?.findings) return [];
    
    return data.findings.filter(finding => 
      finding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (finding.description && finding.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      finding.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.framework.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // Sort frameworks by compliance score (descending)
  const sortedFrameworks = [...filterFrameworks()].sort((a, b) => 
    (b.complianceScore || 0) - (a.complianceScore || 0)
  );
  
  // Sort assessments by date (most recent first)
  const sortedAssessments = [...filterAssessments()].sort((a, b) => 
    new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime()
  );
  
  // Sort findings by severity and then by date
  const sortedFindings = [...filterFindings()].sort((a, b) => {
    const severityOrder: Record<string, number> = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3
    };
    
    const aSeverity = severityOrder[a.severity.toLowerCase()] || 4;
    const bSeverity = severityOrder[b.severity.toLowerCase()] || 4;
    
    if (aSeverity !== bSeverity) {
      return aSeverity - bSeverity;
    }
    
    // If same severity, sort by date (most recent first)
    return new Date(b.identifiedDate).getTime() - new Date(a.identifiedDate).getTime();
  });
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardCheck className="h-5 w-5 mr-2" />
            Compliance Assessment
          </CardTitle>
          <CardDescription>Monitor compliance status across frameworks</CardDescription>
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
            Compliance Assessment
          </CardTitle>
          <CardDescription>Monitor compliance status across frameworks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading compliance assessment data
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
            <CardTitle>Compliance Assessment</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
              <Link href="/compliance/dashboard">
                <BarChart2 className="h-3.5 w-3.5 mr-1" />
                Dashboard
              </Link>
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-1" asChild>
              <Link href="/compliance/assessments/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Assessment
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
                  <p>Track compliance status across frameworks, manage assessments, and monitor findings.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Monitor compliance status across frameworks and track findings</CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={
              activeTab === "frameworks" ? "Search frameworks..." : 
              activeTab === "assessments" ? "Search assessments..." : 
              "Search findings..."
            }
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="frameworks" value={activeTab} onValueChange={(value) => setActiveTab(value as "frameworks" | "assessments" | "findings")} className="mt-2">
          <TabsList className="grid w-[360px] grid-cols-3">
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Compliance stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Overall Compliance</div>
              <Shield className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{data.stats.overallCompliance}%</div>
            <div className="flex items-center mt-1">
              <Progress 
                value={data.stats.overallCompliance}
                className="h-1 w-24" 
              />
              <span className="ml-2 text-xs text-muted-foreground">Score</span>
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Open Findings</div>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{data.stats.openFindings}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              High Priority: {data.stats.highPriorityFindings}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Frameworks</div>
              <BarChart2 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.totalFrameworks}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Active: {data.stats.activeFrameworks}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Assessments</div>
              <ClipboardCheck className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{data.stats.totalAssessments}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Completed: {data.stats.completedAssessments}
            </div>
          </div>
        </div>
        
        <TabsContent value="frameworks" className="mt-0">
          <ScrollArea className="h-[350px] pr-4">
            {sortedFrameworks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardCheck className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No frameworks found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedFrameworks.map((framework) => (
                  <div key={framework.id} className="border rounded-md overflow-hidden">
                    <Link 
                      href={`/compliance/frameworks/${framework.id}`}
                      className="block hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{framework.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {framework.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{framework.id}</span>
                              <span className="text-xs text-muted-foreground">
                                Version: {framework.version}
                              </span>
                            </div>
                            
                            {framework.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {framework.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className={cn(
                              "text-lg font-bold",
                              (framework.complianceScore || 0) >= 90 ? "text-green-600" :
                              (framework.complianceScore || 0) >= 70 ? "text-amber-600" :
                              "text-red-600"
                            )}>
                              {framework.complianceScore || 0}%
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Compliance Score
                            </div>
                          </div>
                        </div>
                        
                        {/* Compliance details */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span className="font-medium">Control compliance</span>
                            <span>{framework.controlStats?.compliantControls || 0}/{framework.controlStats?.totalControls || 0} compliant</span>
                          </div>
                          <Progress 
                            value={framework.controlStats ? 
                              (framework.controlStats.compliantControls / framework.controlStats.totalControls) * 100 : 0
                            } 
                            className="h-1.5" 
                          />
                          
                          <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
                            <div>
                              <div className="text-muted-foreground">Compliant</div>
                              <div className="text-green-600 font-medium">{framework.controlStats?.compliantControls || 0}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Partially</div>
                              <div className="text-amber-600 font-medium">{framework.controlStats?.partialControls || 0}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Non-Compliant</div>
                              <div className="text-red-600 font-medium">{framework.controlStats?.nonCompliantControls || 0}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Not Applicable</div>
                              <div className="text-slate-600 font-medium">{framework.controlStats?.notApplicableControls || 0}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Framework metadata */}
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            {framework.lastAssessmentDate && (
                              <span>Last assessed: {formatDate(framework.lastAssessmentDate)}</span>
                            )}
                            {!framework.lastAssessmentDate && (
                              <span>Not yet assessed</span>
                            )}
                            {framework.nextAssessmentDate && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Next assessment: {formatDate(framework.nextAssessmentDate)}</span>
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
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Button 
              variant={selectedStatus === "all" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedStatus("all")}
            >
              All
            </Button>
            <Button 
              variant={selectedStatus === "compliant" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedStatus("compliant")}
            >
              Compliant
            </Button>
            <Button 
              variant={selectedStatus === "non-compliant" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedStatus("non-compliant")}
            >
              Non-Compliant
            </Button>
            <Button 
              variant={selectedStatus === "in progress" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedStatus("in progress")}
            >
              In Progress
            </Button>
            <Button 
              variant={selectedStatus === "remediation" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedStatus("remediation")}
            >
              Remediation
            </Button>
            <Button 
              variant={selectedStatus === "planned" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedStatus("planned")}
            >
              Planned
            </Button>
          </div>
          
          <ScrollArea className="h-[320px] pr-4">
            {sortedAssessments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardCheck className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No assessments found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAssessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-md overflow-hidden">
                    <Link 
                      href={`/compliance/assessments/${assessment.id}`}
                      className="block hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{assessment.name}</h3>
                              {getAssessmentStatusBadge(assessment.status)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{assessment.id}</span>
                              <Badge variant="outline" className="text-xs">
                                {assessment.framework}
                              </Badge>
                            </div>
                            
                            {assessment.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {assessment.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              Assessment Date:
                            </div>
                            <div className="font-medium">
                              {formatDate(assessment.assessmentDate)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Assessment progress */}
                        {assessment.completionPercentage !== undefined && assessment.status !== 'Compliant' && assessment.status !== 'Non-Compliant' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1 text-xs">
                              <span className="font-medium">Assessment progress</span>
                              <span>{assessment.completionPercentage}% complete</span>
                            </div>
                            <Progress value={assessment.completionPercentage} className="h-1.5" />
                          </div>
                        )}
                        
                        {/* Assessment metadata */}
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            <span>Assessor: {assessment.assessor}</span>
                            {assessment.findings !== undefined && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Findings: {assessment.findings}</span>
                              </>
                            )}
                            {assessment.nextAssessmentDate && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Next assessment: {formatDate(assessment.nextAssessmentDate)}</span>
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
        
        <TabsContent value="findings" className="mt-0">
          <ScrollArea className="h-[350px] pr-4">
            {sortedFindings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No findings found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedFindings.map((finding) => (
                  <div 
                    key={finding.id} 
                    className={cn(
                      "border rounded-md overflow-hidden",
                      finding.status.toLowerCase() === 'open' && finding.severity.toLowerCase() === 'critical' 
                        ? "border-red-300 bg-red-50/20" : ""
                    )}
                  >
                    <Link 
                      href={`/compliance/findings/${finding.id}`}
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
                                {finding.framework}
                              </Badge>
                              <Badge variant={finding.status.toLowerCase() === 'open' ? 'destructive' : 'outline'} className="text-xs">
                                {finding.status}
                              </Badge>
                            </div>
                            
                            {finding.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {finding.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              Identified:
                            </div>
                            <div className="text-xs">
                              {formatDate(finding.identifiedDate)}
                            </div>
                            {finding.dueDate && (
                              <div className={cn(
                                "mt-1 text-xs",
                                new Date(finding.dueDate) < currentDate && finding.status.toLowerCase() === 'open' 
                                  ? "text-red-600 font-medium" : "text-muted-foreground"
                              )}>
                                Due: {formatDate(finding.dueDate)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Finding metadata */}
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div>
                              Control: {finding.controlId}
                            </div>
                            <div>
                              Owner: {finding.owner}
                            </div>
                            {finding.remediationProgress !== undefined && finding.status.toLowerCase() === 'open' && (
                              <div className="flex items-center gap-2">
                                <span>Remediation:</span>
                                <Progress value={finding.remediationProgress} className="h-1.5 w-16" />
                                <span>{finding.remediationProgress}%</span>
                              </div>
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
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date("2025-03-05T12:06:56Z"), "MMM d, yyyy HH:mm:ss")}
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
          <Link href="/compliance/reports">
            View Compliance Reports
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
