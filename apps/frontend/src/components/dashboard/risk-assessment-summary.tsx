## File 16: apps/frontend/src/components/dashboard/risk-assessment-summary.tsx

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, HelpCircle } from 'lucide-react';
import { useRiskAssessment } from '@/hooks/use-risk-assessment';

export function RiskAssessmentSummary() {
  const { data, isLoading, error } = useRiskAssessment();
  
  // Function to determine badge color based on risk level
  const getRiskBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return <Badge className="risk-badge-critical">Critical</Badge>;
      case 'high':
        return <Badge className="risk-badge-high">High</Badge>;
      case 'medium':
        return <Badge className="risk-badge-medium">Medium</Badge>;
      case 'low':
        return <Badge className="risk-badge-low">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Risk Assessment
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="advanced-tooltip">
                  <p>Current risk profile based on your latest risk assessments across multiple domains.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Current identified risks</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Risk Assessment</CardTitle>
          <CardDescription>Current identified risks</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center text-destructive py-6">
            Error loading risk assessment data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Risk Assessment
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="advanced-tooltip">
                <p>Current risk profile based on your latest risk assessments across multiple domains.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Current identified risks</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Risk Level</span>
            {getRiskBadge(data.overallRiskLevel)}
          </div>
          
          <div className="space-y-3">
            {data.categories.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{category.name}</span>
                  <span className={`font-medium ${category.level === 'Critical' 
                    ? 'text-[hsl(var(--risk-critical))]' 
                    : category.level === 'High' 
                      ? 'text-[hsl(var(--risk-high))]' 
                      : category.level === 'Medium'
                        ? 'text-[hsl(var(--risk-medium))]'
                        : 'text-[hsl(var(--risk-low))]'}`}>
                    {category.level}
                  </span>
                </div>
                <Progress 
                  value={category.score} 
                  max={100} 
                  className={`h-2 ${
                    category.level === 'Critical' 
                      ? 'bg-[hsl(var(--risk-critical)/0.2)] [&>div]:bg-[hsl(var(--risk-critical))]' 
                      : category.level === 'High' 
                        ? 'bg-[hsl(var(--risk-high)/0.2)] [&>div]:bg-[hsl(var(--risk-high))]' 
                        : category.level === 'Medium'
                          ? 'bg-[hsl(var(--risk-medium)/0.2)] [&>div]:bg-[hsl(var(--risk-medium))]'
                          : 'bg-[hsl(var(--risk-low)/0.2)] [&>div]:bg-[hsl(var(--risk-low))]'
                  }`}
                />
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span>Total Identified Risks</span>
              <span className="font-medium">{data.totalRisks}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Requiring Immediate Action</span>
              <span className="font-medium text-[hsl(var(--risk-high))]">{data.urgentRisks}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <a href="/dashboard/risk/assessment">
            View Risk Assessment
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
```
