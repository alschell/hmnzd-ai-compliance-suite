import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAIInsights } from "@/hooks/use-ai-insights";
import { Lightbulb, RefreshCw, CheckCircle, ArrowRight, ExternalLink, Brain } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function DashboardAIInsights() {
  const { data, isLoading, dismissInsight, refreshInsights } = useAIInsights();
  const [refreshing, setRefreshing] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshInsights();
    } catch (error) {
      console.error("Failed to refresh AI insights:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDismiss = async (insightId: string) => {
    try {
      await dismissInsight(insightId);
    } catch (error) {
      console.error("Failed to dismiss insight:", error);
    }
  };

  const toggleExpand = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return "text-red-500 bg-red-50 border-red-200";
      case 'high':
        return "text-orange-500 bg-orange-50 border-orange-200";
      case 'medium':
        return "text-amber-500 bg-amber-50 border-amber-200";
      case 'low':
        return "text-green-500 bg-green-50 border-green-200";
      default:
        return "text-blue-500 bg-blue-50 border-blue-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'optimization':
        return <Settings className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <CardTitle>AI Insights</CardTitle>
            {!isLoading && data?.newInsightsCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {data.newInsightsCount} new
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing || isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <CardDescription>
          AI-generated insights and recommendations for your compliance program
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : data?.insights && data.insights.length > 0 ? (
          <div className="space-y-4">
            {data.insights.slice(0, 3).map((insight) => (
              <div 
                key={insight.id} 
                className={`space-y-3 rounded-md border p-3 ${
                  insight.severity === 'critical' || insight.severity === 'high' 
                    ? "border-red-100 bg-red-50" 
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center rounded-full p-1.5 ${getSeverityColor(insight.severity)}`}>
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <h4 className="ml-2 font-medium">{insight.title}</h4>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getSeverityColor(insight.severity)}`}
                  >
                    {insight.severity}
                  </Badge>
                </div>
                
                <div className={`text-sm ${expandedInsight === insight.id ? '' : 'line-clamp-2'}`}>
                  {insight.description}
                </div>
                
                {insight.recommendation && expandedInsight === insight.id && (
                  <div className="rounded-md bg-muted p-3 mt-2">
                    <p className="text-sm font-medium mb-1">Recommendation:</p>
                    <p className="text-sm">{insight.recommendation}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-1 text-sm">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Generated {formatDate(insight.createdAt)}</span>
                    {insight.relatedFrameworks && insight.relatedFrameworks.length > 0 && (
                      <>
                        <span>•</span>
                        <span>
                          {insight.relatedFrameworks.slice(0, 2).join(', ')}
                          {insight.relatedFrameworks.length > 2 && ` +${insight.relatedFrameworks.length - 2} more`}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => toggleExpand(insight.id)}
                    >
                      {expandedInsight === insight.id ? "Show less" : "Show more"}
                    </Button>
                    {insight.actionLink && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-2"
                        asChild
                      >
                        <Link href={insight.actionLink}>
                          Take action
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => handleDismiss(insight.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed">
            <Brain className="h-8 w-8 text-muted-foreground/70" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No AI insights available
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={handleRefresh}
            >
              Generate insights
            </Button>
          </div>
        )}
      </CardContent>
      {!isLoading && data?.insights && data.insights.length > 3 && (
        <CardFooter>
          <Link href="/insights" className="w-full">
            <Button variant="outline" className="w-full">
              View all {data.insights.length} insights
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

// Import these icons to fix the reference errors
import { AlertTriangle, Settings, Shield, TrendingUp } from "lucide-react";
