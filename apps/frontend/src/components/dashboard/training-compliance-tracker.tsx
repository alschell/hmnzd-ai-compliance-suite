"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  GraduationCap, 
  ExternalLink, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Calendar,
  Users,
  ArrowUpRight,
  BarChart,
  UserCheck,
  UserX 
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { useTrainingCompliance } from "@/hooks/use-training-compliance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TrainingComplianceTracker() {
  const { data, isLoading, error } = useTrainingCompliance();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  const currentDate = new Date("2025-03-05T07:47:01Z"); // Using the current timestamp provided
  
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

  // Check if training is overdue
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < currentDate;
  };
  
  // Get status badge for training
  const getStatusBadge = (status: string, dueDate?: string) => {
    if (status.toLowerCase() === 'completed') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );
    }
    
    if (dueDate && isOverdue(dueDate)) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
          <AlertTriangle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    }
    
    switch (status.toLowerCase()) {
      case 'in progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <BookOpen className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'not started':
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 gap-1">
            <Clock className="h-3 w-3" />
            Not Started
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
  
  // Filter trainings based on search
  const filteredTrainings = data?.trainings?.filter(training => 
    training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    training.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Training Compliance
          </CardTitle>
          <CardDescription>Track employee compliance training status</CardDescription>
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
            Training Compliance
          </CardTitle>
          <CardDescription>Track employee compliance training status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading training compliance data
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
            <CardTitle>Training Compliance</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <BarChart className="h-4 w-4" />
                  Reports
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View detailed training compliance reports</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Track employee compliance training requirements and status</span>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
            <Filter className="h-3 w-3" />
            Filter
          </Button>
        </CardDescription>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="trainings" className="text-xs">Trainings</TabsTrigger>
            <TabsTrigger value="employees" className="text-xs">Employees</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="overview" className="mt-0 space-y-6">
          {/* Training stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="border rounded-md p-3">
              <div className="text-sm text-muted-foreground">Overall Compliance</div>
              <div className={`text-2xl font-bold ${
                data.complianceRate >= 90 ? "text-green-600" : 
                data.complianceRate >= 75 ? "text-amber-600" : 
                "text-red-600"
              }`}>
                {data.complianceRate}%
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold text-green-600">{data.completedTrainings}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">{data.inProgressTrainings}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-muted-foreground">Overdue</div>
              <div className="text-2xl font-bold text-red-600">{data.overdueTrainings}</div>
            </div>
          </div>
          
          {/* Training completion by category */}
          <div>
            <h3 className="text-sm font-medium mb-3">Training Completion by Category</h3>
            <div className="space-y-3">
              {data.categories?.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <span>{category.name}</span>
                      {category.isRequired && (
                        <Badge className="ml-2 text-xs">Required</Badge>
                      )}
                    </div>
                    <span>{category.completionRate}%</span>
                  </div>
                  <Progress 
                    value={category.completionRate} 
                    className="h-2"
                    indicatorClassName={
                      category.completionRate >= 90 ? "bg-green-600" :
                      category.completionRate >= 75 ? "bg-amber-500" :
                      "bg-red-500"
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{category.completedCount} of {category.totalCount} completed</span>
                    {category.daysUntilDeadline !== null ? (
                      <span>{category.daysUntilDeadline > 0 ? `${category.daysUntilDeadline} days remaining` : 'Deadline passed'}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming deadlines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Upcoming Deadlines</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                View Calendar
                <Calendar className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            {data.upcomingDeadlines?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground border rounded-md bg-muted/20">
                <p>No upcoming training deadlines</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.upcomingDeadlines?.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="text-sm font-medium">{deadline.title}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Due: {formatDate(deadline.dueDate)} ({getRelativeTime(deadline.dueDate)})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">
                        {deadline.completedCount} of {deadline.totalCount} completed
                      </div>
                      <Progress 
                        value={(deadline.completedCount / deadline.totalCount) * 100} 
                        className="h-1.5 w-24" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="trainings" className="mt-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search trainings..."
              className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredTrainings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No trainings found matching your search</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredTrainings.map((training) => (
                <div key={training.id} className="border rounded-md overflow-hidden">
                  <Link 
                    href={`/training/${training.id}`}
                    className="block p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {training.title}
                          {training.isRequired && (
                            <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                          )}
                        </h3>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {training.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {training.duration} {training.duration === 1 ? 'minute' : 'minutes'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {training.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {training.dueDate && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Due: {formatDate(training.dueDate)}
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <div className="text-xs">
                            <span className="text-green-600 font-medium">{training.completedCount}</span>
                            <span className="text-muted-foreground"> / </span>
                            <span className="text-muted-foreground">{training.assignedCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                        <span>Completion Rate</span>
                        <span>{Math.round((training.completedCount / training.assignedCount) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(training.completedCount / training.assignedCount) * 100} 
                        className="h-1.5" 
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="employees" className="mt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-3 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Compliant Employees</div>
                <div className="text-xl font-bold text-green-600">{data.compliantEmployees}</div>
              </div>
            </div>
            <div className="border rounded-md p-3 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Non-Compliant Employees</div>
                <div className="text-xl font-bold text-red-600">{data.nonCompliantEmployees}</div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted p-3">
              <h3 className="text-sm font-medium">Top 5 Non-Compliant Employees</h3>
            </div>
            <div className="divide-y">
              {data.nonCompliantUsers?.slice(0, 5).map((user, index) => (
                <div key={index} className="p-3 flex items-center justify-between hover:bg-muted/30 transition-all">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600 font-medium">{user.overdueCount}</span> overdue trainings
                    </p>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                      <Link href={`/employees/${user.id}/trainings`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted p-3">
              <h3 className="text-sm font-medium">Department Compliance</h3>
            </div>
            <div className="p-3 space-y-3">
              {data.departmentCompliance?.map((dept, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{dept.name}</span>
                    <span>{dept.complianceRate}%</span>
                  </div>
                  <Progress 
                    value={dept.complianceRate} 
                    className="h-2"
                    indicatorClassName={
                      dept.complianceRate >= 90 ? "bg-green-600" :
                      dept.complianceRate >= 75 ? "bg-amber-500" :
                      "bg-red-500"
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{dept.compliantEmployees} of {dept.totalEmployees} employees compliant</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full text-xs" asChild>
          <Link href="/training">
            Go to Training Management
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
