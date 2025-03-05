"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  AlertCircle,
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  BarChart3,
  UserPlus,
  Users,
  BookOpen,
  ChevronRight,
  ArrowUpRight,
  HelpCircle,
  CalendarDays,
  Award
} from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { format, formatDistanceToNow, addDays, isAfter, isBefore } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrainingManagement } from "@/hooks/use-training-management";
import { cn } from "@/lib/utils";

export function TrainingManagementCard() {
  const { data, isLoading, error } = useTrainingManagement();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"courses" | "assignments" | "reports">("courses");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const currentDate = new Date("2025-03-05T09:59:39Z");
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
  
  // Get status badge for training/course
  const getTrainingStatusBadge = (status: string) => {
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
            <BookOpen className="h-3 w-3" />
            Draft
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 gap-1">
            <BookOpen className="h-3 w-3" />
            Archived
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
            <Calendar className="h-3 w-3" />
            Upcoming
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get status badge for assignment
  const getAssignmentStatusBadge = (status: string, dueDate?: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'assigned':
        if (dueDate && isBefore(new Date(dueDate), currentDate)) {
          return (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
              <AlertCircle className="h-3 w-3" />
              Overdue
            </Badge>
          );
        }
        if (dueDate && isBefore(new Date(dueDate), addDays(currentDate, 5))) {
          return (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
              <Clock className="h-3 w-3" />
              Due Soon
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 gap-1">
            <Calendar className="h-3 w-3" />
            Assigned
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <XCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter courses based on search and category
  const filteredCourses = data?.courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  // Filter assignments based on search and status
  const filteredAssignments = data?.assignments?.filter(assignment => {
    const matchesSearch = assignment.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.courseId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) || [];
  
  // Sort courses - active first, then by requiredByDate (soonest first)
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    // First sort by status (active first)
    if (a.status.toLowerCase() === 'active' && b.status.toLowerCase() !== 'active') return -1;
    if (a.status.toLowerCase() !== 'active' && b.status.toLowerCase() === 'active') return 1;
    
    // Then sort by requiredByDate (if applicable)
    if (a.requiredByDate && b.requiredByDate) {
      return new Date(a.requiredByDate).getTime() - new Date(b.requiredByDate).getTime();
    }
    
    // Then sort by training with highest completion rate
    return (b.stats?.completionRate || 0) - (a.stats?.completionRate || 0);
  });
  
  // Sort assignments - overdue first, then due soon, then by dueDate
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    // First sort by completion status
    if (a.status.toLowerCase() === 'completed' && b.status.toLowerCase() !== 'completed') return 1;
    if (a.status.toLowerCase() !== 'completed' && b.status.toLowerCase() === 'completed') return -1;
    
    // Then sort overdue items first
    const aOverdue = a.dueDate && isBefore(new Date(a.dueDate), currentDate);
    const bOverdue = b.dueDate && isBefore(new Date(b.dueDate), currentDate);
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Then sort by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    return 0;
  });
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Training Management
          </CardTitle>
          <CardDescription>Manage compliance training and certifications</CardDescription>
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
            <GraduationCap className="h-5 w-5 mr-2" />
            Training Management
          </CardTitle>
          <CardDescription>Manage compliance training and certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading training management data
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
            <GraduationCap className="h-5 w-5" />
            <CardTitle>Training Management</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
              <Link href="/training/assign">
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Assign Training
              </Link>
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-1" asChild>
              <Link href="/training/courses/new">
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                New Course
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
                  <p>Manage compliance training programs, track completion status, and assign courses to employees.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Track compliance training programs and certifications</CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={activeTab === "courses" ? "Search courses..." : "Search assignments..."}
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Training stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              <Award className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.overallCompletionRate}%</div>
            <div className="flex items-center mt-1">
              <Progress 
                value={data.stats.overallCompletionRate} 
                className="h-1 w-24" 
              />
              <span className="ml-2 text-xs text-muted-foreground">Overall</span>
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Overdue</div>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{data.stats.overdueAssignments}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Users: {data.stats.usersWithOverdueAssignments}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Due This Month</div>
              <CalendarDays className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{data.stats.dueThisMonth}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Users: {data.stats.usersWithUpcomingDeadlines}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Active Courses</div>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.activeCourses}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Required: {data.stats.requiredCourses}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="courses" value={activeTab} onValueChange={(value) => setActiveTab(value as "courses" | "assignments" | "reports")}>
          <TabsList className="grid w-[360px] grid-cols-3 mb-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-0">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button 
                variant={selectedCategory === "all" ? "secondary" : "outline"} 
                size="sm" 
                className="text-xs h-7"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              {data.categories.map((category) => (
                <Button 
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "outline"} 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <ScrollArea className="h-[340px] pr-4">
              {sortedCourses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No courses found matching your search</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedCourses.map((course) => (
                    <div key={course.id} className="border rounded-md overflow-hidden">
                      <Link 
                        href={`/training/courses/${course.id}`}
                        className="block hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{course.title}</h3>
                                {getTrainingStatusBadge(course.status)}
                                {course.isRequired && (
                                  <Badge variant="secondary" className="text-xs">Required</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{course.id}</span>
                                <Badge variant="outline" className="text-xs">
                                  {course.category}
                                </Badge>
                                {course.duration && (
                                  <span className="text-xs text-muted-foreground">
                                    {course.duration} minutes
                                  </span>
                                )}
                              </div>
                              
                              {course.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {course.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="text-right">
                              {course.requiredByDate && (
                                <div className="text-xs text-muted-foreground">
                                  Required by: {formatDate(course.requiredByDate)}
                                </div>
                              )}
                              {course.recurrencePeriod && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Recurrence: {course.recurrencePeriod}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Completion stats */}
                          {course.stats && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center justify-between mb-1 text-xs">
                                <span className="font-medium">Completion rate</span>
                                <span>{course.stats.completionRate}%</span>
                              </div>
                              <Progress value={course.stats.completionRate || 0} className="h-1.5" />
                              
                              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                                <div>
                                  <div className="text-muted-foreground">Completed</div>
                                  <div className="text-green-600 font-medium">{course.stats.completed}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">In Progress</div>
                                  <div className="text-blue-600 font-medium">{course.stats.inProgress}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">Not Started</div>
                                  <div className="text-slate-600 font-medium">{course.stats.notStarted}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-0">
            <ScrollArea className="h-[375px] pr-4">
              {sortedAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No assignments found matching your search</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedAssignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-md overflow-hidden">
                      <Link 
                        href={`/training/assignments/${assignment.id}`}
                        className="block hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{assignment.courseTitle}</h3>
                                {getAssignmentStatusBadge(assignment.status, assignment.dueDate)}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{assignment.id}</span>
                                <Badge variant="outline" className="text-xs">
                                  {assignment.courseId}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm mt-2">
                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>Assigned to: <span className="font-medium">{assignment.assignee}</span></span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              {assignment.dueDate && (
                                <div className={cn(
                                  "text-xs",
                                  isBefore(new Date(assignment.dueDate), currentDate) && 
                                  assignment.status.toLowerCase() !== 'completed' ? 
                                  "text-red-600 font-medium" : "text-muted-foreground"
                                )}>
                                  Due: {formatDate(assignment.dueDate)}
                                </div>
                              )}
                              {assignment.assignedDate && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Assigned: {formatDate(assignment.assignedDate)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Progress */}
                          {assignment.status === 'In Progress' && assignment.progress !== undefined && (
                            <div className="mt-3 pt-1">
                              <div className="flex items-center justify-between mb-1 text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span>{assignment.progress}%</span>
                              </div>
                              <Progress value={assignment.progress || 0} className="h-1.5" />
                            </div>
                          )}
                          
                          {/* Assignment details */}
                          <div className="mt-3 pt-3 border-t flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                              {assignment.completedDate ? (
                                <span>Completed {getRelativeTime(assignment.completedDate)}</span>
                              ) : (
                                <span>Last activity: {assignment.lastActivity ? getRelativeTime(assignment.lastActivity) : "None"}</span>
                              )}
                            </div>
                            {assignment.status !== 'Completed' && (
                              <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                <Link href={`/training/courses/${assignment.courseId}/launch`}>
                                  {assignment.status === 'In Progress' ? 'Continue' : 'Start'} Training
                                </Link>
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
          
          <TabsContent value="reports" className="mt-0">
            <div className="space-y-3 h-[375px] overflow-y-auto pr-2">
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Compliance Training Summary</h3>
                <div className="text-sm text-muted-foreground mt-1 mb-3">
                  Overall training compliance status for required courses
                </div>
                
                <div className="space-y-4">
                  {data.reports?.complianceSummary?.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.completionRate}%</span>
                      </div>
                      <div className="flex items-center">
                        <Progress value={item.completionRate} className="h-2 flex-1" />
                        <div className="ml-4 text-xs whitespace-nowrap">
                          {item.completed}/{item.total} complete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4 gap-1" asChild>
                  <Link href="/training/reports/compliance">
                    View Full Compliance Report
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Department Completion Rates</h3>
                <div className="text-sm text-muted-foreground mt-1 mb-3">
                  Training completion by department
                </div>
                
                <div className="space-y-4">
                  {data.reports?.departmentCompletion?.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.department}</span>
                        <span className="font-medium">{item.completionRate}%</span>
                      </div>
                      <div className="flex items-center">
                        <Progress 
                          value={item.completionRate} 
                          className={cn("h-2 flex-1", 
                            item.completionRate < 75 ? "text-red-600" : 
                            item.completionRate < 90 ? "text-amber-600" : ""
                          )} 
                        />
                        <div className="ml-4 text-xs whitespace-nowrap">
                          {item.completedAssignments}/{item.totalAssignments} complete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4 gap-1" asChild>
                  <Link href="/training/reports/departments">
                    View Department Breakdown
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Recent Activities</h3>
                <div className="text-sm text-muted-foreground mt-1 mb-3">
                  Latest training completions and assignments
                </div>
                
                <div className="space-y-2">
                  {data.reports?.recentActivities?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-1 border-b last:border-b-0 text-sm">
                      <div>
                        <div>{activity.description}</div>
                        <div className="text-xs text-muted-foreground">{activity.user}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getRelativeTime(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4 gap-1" asChild>
                  <Link href="/training/reports/activities">
                    View All Activities
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date("2025-03-05T09:59:39Z"), "MMM d, yyyy HH:mm:ss")}
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
          <Link href="/training">
            View Training Dashboard
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
