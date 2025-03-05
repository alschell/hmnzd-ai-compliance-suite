"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Clock,
  CalendarDays,
  CalendarClock,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  HelpCircle,
  Search,
  CheckSquare,
  Filter,
  ChevronUp,
  ChevronDown,
  Plus,
  ArrowRightLeft,
  User2,
  MoreHorizontal
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { useTaskManagement } from "@/hooks/use-task-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function TaskManagementCard() {
  const { data, isLoading, error } = useTaskManagement();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"due" | "priority">("due");
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const currentDate = new Date("2025-03-05T09:55:20Z");
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };
  
  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  // Check if a task is overdue
  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < currentDate;
  };
  
  // Check if a task is due soon (within 3 days)
  const isDueSoon = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const diff = due.getTime() - currentDate.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= 3 && days > 0;
  };
  
  // Get status badge
  const getStatusBadge = (status: string, dueDate?: string) => {
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
      case 'not started':
        if (dueDate && isOverdue(dueDate)) {
          return (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
              <AlertCircle className="h-3 w-3" />
              Overdue
            </Badge>
          );
        }
        if (dueDate && isDueSoon(dueDate)) {
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
            Not Started
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  // Get task count by category
  const getTaskCountByCategory = (category: string) => {
    if (!data?.tasks) return 0;
    return data.tasks.filter(task => 
      task.category === category && 
      (showCompleted ? true : task.status.toLowerCase() !== 'completed')
    ).length;
  };
  
  // Filter tasks based on search query and filters
  const filteredTasks = data?.tasks?.filter(task => {
    // Filter by search query
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignee && task.assignee.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by completion status
    const matchesCompletion = showCompleted ? true : task.status.toLowerCase() !== 'completed';
    
    // Filter by category
    const matchesCategory = selectedFilter === 'all' || task.category === selectedFilter;
    
    return matchesSearch && matchesCompletion && matchesCategory;
  }) || [];
  
  // Sort tasks based on sort option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "due") {
      // Sort by due date (closest due first, then by priority)
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      
      if (aDate === bDate) {
        // If due dates are the same, sort by priority
        const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
        return priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder] - 
               priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder];
      }
      
      return aDate - bDate;
    } else {
      // Sort by priority (highest first, then by due date)
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      const aPriority = priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder];
      const bPriority = priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder];
      
      if (aPriority === bPriority) {
        // If priorities are the same, sort by due date
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aDate - bDate;
      }
      
      return aPriority - bPriority;
    }
  });
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckSquare className="h-5 w-5 mr-2" />
            Task Management
          </CardTitle>
          <CardDescription>Compliance tasks and activities</CardDescription>
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
            <CheckSquare className="h-5 w-5 mr-2" />
            Task Management
          </CardTitle>
          <CardDescription>Compliance tasks and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading task management data
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
            <CheckSquare className="h-5 w-5" />
            <CardTitle>Task Management</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="default" size="sm" className="h-8 gap-1" asChild>
              <Link href="/tasks/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Task
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
                  <p>Manage compliance-related tasks, activities, and assignments.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Track and manage compliance tasks and activities</CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search tasks..."
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant={selectedFilter === "all" ? "secondary" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setSelectedFilter("all")}
            >
              All
            </Button>
            {data.categories.map((category) => (
              <Button 
                key={category}
                variant={selectedFilter === category ? "secondary" : "outline"} 
                size="sm" 
                className="text-xs h-7"
                onClick={() => setSelectedFilter(category)}
              >
                {category} ({getTaskCountByCategory(category)})
              </Button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 gap-1"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Hide Completed
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Show Completed
                </>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 gap-1"
              onClick={() => setSortBy(sortBy === "due" ? "priority" : "due")}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Sort by: {sortBy === "due" ? "Due Date" : "Priority"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Task stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Overdue</div>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{data.stats.overdue}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              High Priority: {data.stats.overdueHighPriority}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Due Today</div>
              <CalendarClock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{data.stats.dueToday}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              This Week: {data.stats.dueThisWeek}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">In Progress</div>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{data.stats.inProgress}</div>
            <div className="flex items-center mt-1 text-xs">
              <Progress 
                value={data.stats.completionRate} 
                className="h-1 w-24" 
              />
              <span className="ml-2 text-muted-foreground">{data.stats.completionRate}% complete</span>
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Completed</div>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{data.stats.completed}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Last 30 Days: {data.stats.completedLast30Days}
            </div>
          </div>
        </div>
        
        {/* Task list */}
        <ScrollArea className="h-[360px] pr-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No tasks found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "border rounded-md overflow-hidden transition-colors",
                    task.status.toLowerCase() === 'completed' ? 'bg-muted/20' : '',
                    isOverdue(task.dueDate) && task.status.toLowerCase() !== 'completed' ? 'border-red-200' : ''
                  )}
                >
                  <Link 
                    href={`/tasks/${task.id}`}
                    className="block hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={cn(
                              "font-medium",
                              task.status.toLowerCase() === 'completed' ? 'text-muted-foreground line-through' : ''
                            )}>
                              {task.title}
                            </h3>
                            {getPriorityBadge(task.priority)}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{task.id}</span>
                            <Badge variant="secondary" className="text-xs">
                              {task.category}
                            </Badge>
                            {task.complianceArea && (
                              <Badge variant="outline" className="text-xs">
                                {task.complianceArea}
                              </Badge>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className={cn(
                              "text-sm text-muted-foreground mt-2 line-clamp-2",
                              task.status.toLowerCase() === 'completed' ? 'line-through' : ''
                            )}>
                              {task.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end">
                          {getStatusBadge(task.status, task.dueDate)}
                          {task.dueDate && (
                            <div className={cn(
                              "text-right mt-2 text-xs",
                              isOverdue(task.dueDate) && task.status.toLowerCase() !== 'completed' ? 'text-red-600 font-medium' : 'text-muted-foreground',
                              isDueSoon(task.dueDate) && task.status.toLowerCase() !== 'completed' ? 'text-amber-600 font-medium' : '',
                              task.status.toLowerCase() === 'completed' ? 'text-muted-foreground' : ''
                            )}>
                              Due: {formatDate(task.dueDate)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Task details */}
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="text-xs text-muted-foreground flex items-center gap-3">
                          {task.assignee && (
                            <div className="flex items-center">
                              <User2 className="h-3 w-3 mr-1" />
                              {task.assignee}
                            </div>
                          )}
                          {task.createdAt && (
                            <div>
                              Created: {getRelativeTime(task.createdAt)}
                            </div>
                          )}
                          {task.lastUpdated && task.lastUpdated !== task.createdAt && (
                            <div>
                              Updated: {getRelativeTime(task.lastUpdated)}
                            </div>
                          )}
                        </div>
                        <div>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date("2025-03-05T09:55:20Z"), "MMM d, yyyy HH:mm:ss")}
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
          <Link href="/tasks">
            View All Tasks
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
