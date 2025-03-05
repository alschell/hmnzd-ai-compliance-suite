## File 18: apps/frontend/src/components/dashboard/compliance-tasks.tsx

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight, CheckCircle2, HelpCircle, ListTodo } from 'lucide-react';
import { useState } from 'react';
import { useComplianceTasks } from '@/hooks/use-compliance-tasks';
import { formatDistanceToNow } from 'date-fns';

export function ComplianceTasks() {
  const { data, isLoading, error, markTaskComplete } = useComplianceTasks();
  const [visibleTasks, setVisibleTasks] = useState(5);
  
  // Function to get the appropriate badge for task priority
  const getTaskPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return <Badge className="risk-badge-critical">Critical</Badge>;
      case 'high':
        return <Badge className="risk-badge-high">High</Badge>;
      case 'medium':
        return <Badge className="risk-badge-medium">Medium</Badge>;
      case 'low':
        return <Badge className="risk-badge-low">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };
  
  // Handler for marking a task as complete
  const handleMarkComplete = async (taskId: string) => {
    await markTaskComplete(taskId);
  };
  
  if (isLoading) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Compliance Tasks
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="advanced-tooltip">
                  <p>Tasks that require attention to maintain compliance with various regulatory frameworks.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Tasks requiring attention</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Compliance Tasks</CardTitle>
          <CardDescription>Tasks requiring attention</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center text-destructive py-12">
            Error loading compliance tasks
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hasMoreTasks = data.tasks?.length > visibleTasks;
  const completedTasksCount = data.tasks?.filter(task => task.completed).length || 0;
  const totalTasksCount = data.tasks?.length || 0;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  
  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Compliance Tasks
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="advanced-tooltip">
                <p>Tasks that require attention to maintain compliance with various regulatory frameworks.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="flex justify-between">
          <span>Tasks requiring attention</span>
          <span className="font-medium">{completedTasksCount}/{totalTasksCount} ({completionPercentage}%)</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {data.tasks?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>All tasks completed</p>
              <p className="text-sm">Great job maintaining compliance!</p>
            </div>
          ) : (
            data.tasks?.slice(0, visibleTasks).map((task) => (
              <div 
                key={task.id} 
                className={`flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors ${task.completed ? 'opacity-60' : ''}`}
              >
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => handleMarkComplete(task.id)} 
                  className="mt-1"
                  disabled={task.completed}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </p>
                    {getTaskPriorityBadge(task.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{task.framework}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                    </span>
                    <Button size="sm" variant="ghost" className="h-6 text-xs">View</Button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {hasMoreTasks && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs mt-2"
              onClick={() => setVisibleTasks(prev => prev + 5)}
            >
              Show more tasks
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <a href="/dashboard/tasks">
            View All Tasks
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
```
