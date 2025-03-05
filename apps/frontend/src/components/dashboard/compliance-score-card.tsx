import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircularProgressIndicator } from '@/components/ui/circular-progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, HelpCircle, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useComplianceScore } from '@/hooks/use-compliance-score';

export function ComplianceScoreCard() {
  const { data, isLoading, error } = useComplianceScore();
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Animate the score when it loads
  useEffect(() => {
    if (data?.score) {
      const targetScore = data.score;
      const duration = 1500;
      const startTime = Date.now();
      
      const animateScore = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentScore = Math.floor(progress * targetScore);
        
        setAnimatedScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animateScore);
        }
      };
      
      requestAnimationFrame(animateScore);
    }
  }, [data?.score]);

  // Determine the color and text based on the score
  const getScoreDetails = (score: number) => {
    if (score >= 90) return { color: 'text-[hsl(var(--compliance-high))]', text: 'Excellent', badgeColor: 'compliance-badge-high' };
    if (score >= 75) return { color: 'text-[hsl(var(--compliance-high))]', text: 'Good', badgeColor: 'compliance-badge-high' };
    if (score >= 60) return { color: 'text-[hsl(var(--compliance-medium))]', text: 'Adequate', badgeColor: 'compliance-badge-medium' };
    if (score >= 40) return { color: 'text-[hsl(var(--compliance-medium))]', text: 'Needs Improvement', badgeColor: 'compliance-badge-medium' };
    return { color: 'text-[hsl(var(--compliance-low))]', text: 'Critical', badgeColor: 'compliance-badge-low' };
  };
  
  const scoreDetails = data?.score ? getScoreDetails(data.score) : { color: '', text: '', badgeColor: '' };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Overall Compliance Score
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="advanced-tooltip">
                  <p>Your overall compliance score is calculated based on multiple factors including framework adherence, risk levels, and outstanding tasks.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Aggregated framework compliance</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-40 w-40 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Compliance Score</CardTitle>
          <CardDescription>Aggregated framework compliance</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-center text-destructive">
            Error loading compliance score data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Overall Compliance Score
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="advanced-tooltip">
                <p>Your overall compliance score is calculated based on multiple factors including framework adherence, risk levels, and outstanding tasks.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Aggregated framework compliance</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-6">
        <div className="relative h-40 w-40 flex items-center justify-center">
          <CircularProgressIndicator 
            size={160} 
            strokeWidth={12} 
            progress={data?.score || 0} 
            color={scoreDetails.color.replace('text-', '')}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${scoreDetails.color}`}>{animatedScore}</span>
            <Badge className={scoreDetails.badgeColor}>
              {scoreDetails.text}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full mt-4">
          {data?.frameworkBreakdown?.map((framework, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-muted-foreground">{framework.name}</p>
              <p className={`text-sm font-medium ${getScoreDetails(framework.score).color}`}>{framework.score}%</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <a href="/dashboard/reports/compliance-score">
            View Detailed Report
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
