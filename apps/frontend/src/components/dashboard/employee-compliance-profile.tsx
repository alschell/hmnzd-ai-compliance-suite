"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileCheck,
  GraduationCap,
  Shield,
  Building2,
  Mail,
  Phone,
  User,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  PlusCircle,
  Download,
  FileText
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useEmployeeCompliance } from "@/hooks/use-employee-compliance";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EmployeeComplianceProfile() {
  const { data, employees, isLoading, error, selectEmployee } = useEmployeeCompliance();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };
  
  // Handle employee selection
  const handleEmployeeSelect = (id: string) => {
    setSelectedEmployeeId(id);
    selectEmployee(id);
  };
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Compliant
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Non-Compliant
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'exempt':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Exempt
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter employees based on search
  const filteredEmployees = employees?.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Employee Compliance Profile
          </CardTitle>
          <CardDescription>View detailed compliance status for individual employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Employee Compliance Profile
          </CardTitle>
          <CardDescription>View detailed compliance status for individual employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading employee compliance data
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-full shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Employee Compliance Profile
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8" asChild>
            <Link href="/compliance/team">
              View Team Dashboard
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <CardDescription>View and manage individual employee compliance status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {/* Employee selection sidebar */}
          <div className="col-span-1 border rounded-md overflow-hidden">
            <div className="p-3 bg-muted/50 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search employees..."
                  className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  <Filter className="h-3 w-3" />
                  Filter
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="divide-y">
                {filteredEmployees.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No employees found matching your search
                  </div>
                ) : (
                  filteredEmployees.map((employee) => (
                    <button
                      key={employee.id}
                      className={`w-full text-left p-3 hover:bg-muted/50 transition-colors flex items-center space-x-3 ${
                        selectedEmployeeId === employee.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleEmployeeSelect(employee.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{employee.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{employee.department}</p>
                      </div>
                      <div>
                        {employee.complianceScore >= 90 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : employee.complianceScore >= 70 ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t bg-muted/50">
              <Button size="sm" className="w-full gap-1 text-xs" asChild>
                <Link href="/compliance/team/add">
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  Add Employee
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Employee compliance details */}
          <div className="col-span-3 border rounded-md overflow-hidden">
            {!data ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                <User className="h-12 w-12 mb-3 opacity-50" />
                <p>Select an employee to view their compliance profile</p>
              </div>
            ) : (
              <>
                {/* Employee header */}
                <div className="p-4 bg-muted/30 border-b">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={data.avatarUrl} alt={data.name} />
                      <AvatarFallback>{data.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium">{data.name}</h2>
                        {getStatusBadge(data.overallStatus)}
                      </div>
                      <p className="text-muted-foreground">{data.title}</p>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1.5" />
                          {data.department}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1.5" />
                          {data.email}
                        </div>
                        {data.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1.5" />
                            {data.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Compliance Score</span>
                      <span className={
                        data.complianceScore >= 90 ? "text-green-600 font-medium" :
                        data.complianceScore >= 70 ? "text-amber-600 font-medium" :
                        "text-red-600 font-medium"
                      }>
                        {data.complianceScore}%
                      </span>
                    </div>
                    <Progress 
                      value={data.complianceScore} 
                      className="h-2"
                      indicatorClassName={
                        data.complianceScore >= 90 ? "bg-green-600" :
                        data.complianceScore >= 70 ? "bg-amber-500" :
                        "bg-red-500"
                      }
                    />
                  </div>
                </div>
                
                {/* Tabs for different compliance aspects */}
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="p-4">
                  <TabsList className="grid grid-cols-4 h-8">
                    <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                    <TabsTrigger value="training" className="text-xs">Training</TabsTrigger>
                    <TabsTrigger value="documentation" className="text-xs">Documentation</TabsTrigger>
                    <TabsTrigger value="access" className="text-xs">Access Rights</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-4 space-y-6">
                    {/* Compliance summary stats */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="border rounded-md p-3 flex flex-col items-center justify-center">
                        <div className="text-sm text-muted-foreground">Training</div>
                        <div className={`text-xl font-bold ${
                          data.training.completionRate >= 90 ? "text-green-600" :
                          data.training.completionRate >= 70 ? "text-amber-600" :
                          "text-red-600"
                        }`}>
                          {data.training.completionRate}%
                        </div>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center justify-center">
                        <div className="text-sm text-muted-foreground">Documentation</div>
                        <div className={`text-xl font-bold ${
                          data.documentation.completionRate >= 90 ? "text-green-600" :
                          data.documentation.completionRate >= 70 ? "text-amber-600" :
                          "text-red-600"
                        }`}>
                          {data.documentation.completionRate}%
                        </div>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center justify-center">
                        <div className="text-sm text-muted-foreground">Certifications</div>
                        <div className={`text-xl font-bold ${
                          data.certifications.valid / data.certifications.total >= 0.9 ? "text-green-600" :
                          data.certifications.valid / data.certifications.total >= 0.7 ? "text-amber-600" :
                          "text-red-600"
                        }`}>
                          {data.certifications.valid}/{data.certifications.total}
                        </div>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center justify-center">
                        <div className="text-sm text-muted-foreground">Access Rights</div>
                        <div className={`text-xl font-bold ${
                          data.accessRights.reviewedPercent >= 90 ? "text-green-600" :
                          data.accessRights.reviewedPercent >= 70 ? "text-amber-600" :
                          "text-red-600"
                        }`}>
                          {data.accessRights.reviewedPercent}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Compliance issues */}
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted p-3 flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          Compliance Actions Required
                        </h3>
                        <Badge variant="secondary">{data.issues.length}</Badge>
                      </div>
                      {data.issues.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-green-500 opacity-80" />
                          <p>No compliance issues found</p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {data.issues.map((issue, index) => (
                            <div key={index} className="p-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">{issue.title}</h4>
                                <Badge 
                                  className={
                                    issue.severity === "Critical" ? "bg-red-100 text-red-800" :
                                    issue.severity === "High" ? "bg-orange-100 text-orange-800" :
                                    issue.severity === "Medium" ? "bg-amber-100 text-amber-800" :
                                    "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {issue.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Due by {formatDate(issue.dueDate)}
                                </div>
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  Take Action
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Recent compliance activity */}
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted p-3">
                        <h3 className="text-sm font-medium">Recent Compliance Activity</h3>
                      </div>
                      <div className="divide-y">
                        {data.recentActivity.map((activity, index) => (
                          <div key={index} className="p-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm">{activity.description}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="training" className="mt-4 space-y-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-sm font-medium flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Training Status
                      </h3>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Assign New Training
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {data.training.courses.map((course, index) => (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <button
                            className="w-full text-left p-3 hover:bg-muted/30 transition-colors"
                            onClick={() => toggleSection(`training-${index}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-2 h-full rounded-full mr-2 ${
                                  course.status === "Completed" ? "bg-green-500" :
                                  course.status === "In Progress" ? "bg-blue-500" :
                                  course.status === "Not Started" && course.dueDate && new Date(course.dueDate) < new Date() ? "bg-red-500" :
                                  "bg-slate-300"
                                }`} />
                                <div>
                                  <h4 className="text-sm font-medium">{course.title}</h4>
                                  <p className="text-xs text-muted-foreground">{course.category}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  {getStatusBadge(course.status)}
                                  {course.dueDate && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Due: {formatDate(course.dueDate)}
                                    </p>
                                  )}
                                </div>
                                {expandedSections[`training-${index}`] ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </button>
                          
                          {expandedSections[`training-${index}`] && (
                            <div className="p-3 pt-0 border-t bg-muted/20">
                              <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Assigned Date:</span>
                                  <span className="ml-1">{formatDate(course.assignedDate)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Completion Date:</span>
                                  <span className="ml-1">{course.completionDate ? formatDate(course.completionDate) : "Not completed"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Duration:</span>
                                  <span className="ml-1">{course.duration} minutes</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Score:</span>
                                  <span className="ml-1">{course.score ? `${course.score}%` : "N/A"}</span>
                                </div>
                              </div>
                              
                              {course.status !== "Completed" && (
                                <div className="flex justify-end mt-3">
                                  <Button variant="outline" size="sm" className="text-xs" asChild>
                                    <Link href={`/training/${course.id}`}>
                                      {course.status === "In Progress" ? "Continue Training" : "Start Training"}
                                    </Link>
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documentation" className="mt-4 space-y-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-sm font-medium flex items-center">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Required Documentation
                      </h3>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Upload Document
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {data.documentation.documents.map((doc, index) => (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <button
                            className="w-full text-left p-3 hover:bg-muted/30 transition-colors"
                            onClick={() => toggleSection(`doc-${index}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium">{doc.title}</h4>
                                <p className="text-xs text-muted-foreground">{doc.category}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  {getStatusBadge(doc.status)}
                                  {doc.expiryDate && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Expires: {formatDate(doc.expiryDate)}
                                    </p>
                                  )}
                                </div>
                                {expandedSections[`doc-${index}`] ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </button>
                          
                          {expandedSections[`doc-${index}`] && (
                            <div className="p-3 pt-0 border-t bg-muted/20">
                              <p className="text-sm text-muted-foreground mt-2">{doc.description}</p>
                              
                              {doc.status === "Compliant" && (
                                <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">Submitted Date:</span>
                                    <span className="ml-1">{formatDate(doc.submittedDate || '')}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Approved Date:</span>
                                    <span className="ml-1">{formatDate(doc.approvedDate || '')}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Approved By:</span>
                                    <span className="ml-1">{doc.approvedBy || 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Document ID:</span>
                                    <span className="ml-1">{doc.documentId || 'N/A'}</span>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex justify-end space-x-2 mt-3">
                                {doc.status === "Compliant" && doc.fileUrl && (
                                  <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
                                    </a>
                                  </Button>
                                )}
                                
                                {doc.status !== "Compliant" && (
                                  <Button variant="default" size="sm" className="text-xs">
                                    Upload Document
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="access" className="mt-4 space-y-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-sm font-medium flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        System Access Rights
                      </h3>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Request Access Change
                      </Button>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted p-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium">Access Rights Overview</h4>
                        <Badge variant="secondary">Last reviewed: {formatDate(data.accessRights.lastReviewDate)}</Badge>
                      </div>
                      
                      <div className="p-3">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Access Rights Review Status</span>
                              <span>{data.accessRights.reviewedPercent}%</span>
                            </div>
                            <Progress 
                              value={data.accessRights.reviewedPercent} 
                              className="h-2"
                              indicatorClassName={
                                data.accessRights.reviewedPercent >= 90 ? "bg-green-600" :
                                data.accessRights.reviewedPercent >= 70 ? "bg-amber-500" :
                                "bg-red-500"
                                              }
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Next Scheduled Review</p>
                              <p>{formatDate(data.accessRights.nextReviewDate)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Reviewer</p>
                              <p>{data.accessRights.reviewer || 'Not assigned'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {data.accessRights.systems.map((system, index) => (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <button
                            className="w-full text-left p-3 hover:bg-muted/30 transition-colors"
                            onClick={() => toggleSection(`access-${index}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium">{system.name}</h4>
                                <p className="text-xs text-muted-foreground">{system.category}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  {getStatusBadge(system.status)}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Last reviewed: {formatDate(system.lastReviewDate)}
                                  </p>
                                </div>
                                {expandedSections[`access-${index}`] ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </button>
                          
                          {expandedSections[`access-${index}`] && (
                            <div className="p-3 pt-0 border-t bg-muted/20">
                              <div className="mt-3 space-y-3">
                                <div>
                                  <h5 className="text-xs font-medium">Access Level</h5>
                                  <p className="text-sm">{system.accessLevel}</p>
                                </div>
                                
                                {system.permissions && system.permissions.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium">Permissions</h5>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {system.permissions.map((permission, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {permission}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">Grant Date:</span>
                                    <span className="ml-1">{formatDate(system.grantDate)}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Expiry Date:</span>
                                    <span className="ml-1">{system.expiryDate ? formatDate(system.expiryDate) : 'No expiration'}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Approved By:</span>
                                    <span className="ml-1">{system.approvedBy}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Last Access:</span>
                                    <span className="ml-1">{formatDate(system.lastAccessDate)}</span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-end mt-2">
                                  <Button variant="outline" size="sm" className="text-xs">
                                    Review Access
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {data.accessRights.pendingRequests && data.accessRights.pendingRequests.length > 0 && (
                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-muted p-3">
                          <h4 className="text-sm font-medium">Pending Access Requests</h4>
                        </div>
                        <div className="divide-y">
                          {data.accessRights.pendingRequests.map((request, index) => (
                            <div key={index} className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-sm font-medium">{request.system}</h5>
                                  <p className="text-xs text-muted-foreground mt-1">{request.accessLevel}</p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
                              </div>
                              <div className="flex items-center justify-between mt-2 text-xs">
                                <div className="text-muted-foreground">
                                  Requested: {formatDate(request.requestDate)}
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50">
        <div className="w-full flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Last updated: March 5, 2025 at 08:07:36 UTC
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Export Profile
            </Button>
            <Button variant="default" size="sm" className="text-xs">
              Generate Compliance Report
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
