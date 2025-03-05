import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight, Brain, HelpCircle, Lightbulb, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useAiInsights } from '@/hooks/use-ai-insights';

export function AiInsights() {
  const { data, isLoading, error, refreshInsights } = useAiInsights();
  const [visibleInsights, setVisibleInsights] = useState(3);
  
  // Function to get insight type icon
  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case 'improvement':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'risk':
        return <TrendingDown className="h-4 w-4 text-rose-500" />;
      case 'pattern':
        return <Brain className="h-4 w-4 text-purple-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Function to get insight category badge
  const getInsightBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case 'consent':
        return <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-500">Consent</Badge>;
      case 'data protection':
        return <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-500">Data Protection</Badge>;
      case 'risk management':
        return <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-500">Risk Management</Badge>;
      case 'documentation':
        return <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-500">Documentation</Badge>;
      case 'governance':
        return <Badge variant="outline" className="border-indigo-500/50 bg-indigo-500/10 text-indigo-500">Governance</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            AI Insights
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="advanced-tooltip">
                  <p>AI-generated insights and recommendations to improve your compliance posture.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>AI compliance analysis</CardDescription>
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
          <CardTitle className="text-lg">AI Insights</CardTitle>
          <CardDescription>AI compliance analysis</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center text-destructive py-6">
            Error loading AI insights
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => refreshInsights()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hasMoreInsights = data.insights?.length > visibleInsights;

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          AI Insights
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="advanced-tooltip">
                <p>AI-generated insights and recommendations to improve your compliance posture.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>AI compliance analysis</span>
          <span className="text-xs text-muted-foreground">
            Updated {new Date(data.lastUpdated).toLocaleDateString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {data.insights?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No insights available</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => refreshInsights()}
              >
                Generate Insights
              </Button>
            </div>
          ) : (
            data.insights?.slice(0, visibleInsights).map((insight, index) => (
              <div 
                key={index} 
                className="p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <span className="text-sm font-medium">{insight.type}</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    {getInsightBadge(insight.category)}
                  </div>
                </div>
                <p className="text-sm">{insight.content}</p>
                {insight.recommendation && (
                  <div className="mt-2 p-2 rounded bg-muted text-xs">
                    <span className="font-medium">Recommendation:</span> {insight.recommendation}
                  </div>
                )}
                {insight.action && (
                  <div className="mt-2 text-right">
                    <Button size="sm" variant="outline" className="text-xs">
                      {insight.action}
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
          
          {hasMoreInsights && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs mt-2"
              onClick={() => setVisibleInsights(prev => prev + 3)}
            >
              Show more insights
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <a href="/dashboard/ai-insights">
            View All Insights
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
