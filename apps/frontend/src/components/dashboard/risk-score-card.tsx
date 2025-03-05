"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertTriangle,
  BarChart4,
  HelpCircle,
  Info,
  RefreshCcw,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  AlertOctagon
} from "lucide-react";
import Link from "next/link";
import { useRiskAssessment } from "@/hooks/use-risk-assessment";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function RiskScoreCard() {
  const { data, isLoading, error } = useRiskAssessment();
  const [scoreTrend, setScoreTrend] = useState<"up" | "down" | "none">("none");
  const [animateScore, setAnimateScore] = useState(false);
  
  // Calculate relative score positioning on a scale from 0 to 100%
  const getScorePosition = (score: number, min: number = 0, max: number = 100) => {
    const percentage = ((score - min) / (max - min)) * 100;
    return Math.max(Math.min(percentage, 100), 0);
  };
  
  // Determine risk level from score
  const getRiskLevel = (score: number) => {
    if (score >= 85) return { level: "Critical", color: "text-red-500", bgColor: "bg-red-100" };
    if (score >= 70) return { level: "High", color: "text-orange-500", bgColor: "bg-orange-100" };
    if (score >= 50) return { level: "Medium", color: "text-amber-500", bgColor: "bg-amber-100" };
    if (score >= 30) return { level: "Low", color: "text-yellow-500", bgColor: "bg-yellow-100" };
    return { level: "Minimal", color: "text-green-500", bgColor: "bg-green-100" };
  };
  
  // Determine the trend direction based on the previous score
  useEffect(() => {
    if (data?.overallScore && data?.previousScore) {
      if (data.overallScore > data.previousScore) {
        setScoreTrend("up");
      } else if (data.overallScore < data.previousScore) {
        setScoreTrend("down");
      } else {
        setScoreTrend("none");
      }
      
      // Trigger animation when score is loaded
      setAnimateScore(true);
      const timer = setTimeout(() => setAnimateScore(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [data?.overallScore, data?.previousScore]);
  
  if (isLoading) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Risk Assessment
          </CardTitle>
          <CardDescription>Compliance risk exposure</CardDescription>
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
          <CardTitle className="text-lg flex items-center">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Risk Assessment
          </CardTitle>
          <CardDescription>Compliance risk exposure</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load risk assessment data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const { level, color, bgColor } = getRiskLevel(data.overallScore);
  const scorePosition = getScorePosition(data.overallScore);
  
  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Risk Assessment
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Assessment of potential compliance risks that could impact your organization. Lower scores are better.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Refresh risk assessment">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Compliance risk exposure</span>
          <span className="text-xs text-muted-foreground">Last updated: 2025-03-05 09:41:23</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        {/* Risk Level Badge */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Current Risk Level:</div>
          <Badge className={`${bgColor} ${color.replace('text-', 'text-')}`}>
            {level} Risk Exposure
          </Badge>
        </div>
        
        {/* Risk Visualization */}
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-center mb-2">
            <div className={`text-2xl font-bold ${color}`}>
              {data.overallScore}
              <span className="text-sm font-normal text-muted-foreground ml-1">/ 100</span>
            </div>
            
            {scoreTrend !== "none" && (
              <div className={`flex items-center justify-center text-xs ${
                scoreTrend === "up" ? "text-red-500" : "text-green-500"
              }`}>
                {scoreTrend === "up" ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>{Math.abs(data.overallScore - data.previousScore).toFixed(1)} points (worse)</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>{Math.abs(data.overallScore - data.previousScore).toFixed(1)} points (better)</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Risk gauge with segments */}
          <div className="w-full mt-1 mb-1">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: "20%" }}></div>
              <div className="bg-yellow-500 h-full" style={{ width: "20%" }}></div>
              <div className="bg-amber-500 h-full" style={{ width: "20%" }}></div>
              <div className="bg-orange-500 h-full" style={{ width: "20%" }}></div>
              <div className="bg-red-500 h-full" style={{ width: "20%" }}></div>
            </div>
            <div className="relative h-0">
              <div 
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-700 ease-in-out"
                style={{ left: `${scorePosition}%` }}
              >
                <div className="border-8 border-transparent border-t-slate-800"></div>
                <AlertOctagon className={`h-4 w-4 -mt-1 ${color}`} />
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
            <span>Minimal</span>
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
            <span>Critical</span>
          </div>
        </div>
        
        {/* Risk Breakdown */}
        <div className="space-y-3">
          <div className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            Critical Risk Areas
          </div>
          
          {data.categories.slice(0, 3).map((category, i) => (
            <div key={i} className="flex items-center justify-between text-sm border-l-4 pl-2 py-1.5"
              style={{
                borderLeftColor: 
                  category.level === 'Critical' ? 'rgb(239, 68, 68)' :
                  category.level === 'High' ? 'rgb(249, 115, 22)' :
                  category.level === 'Medium' ? 'rgb(245, 158, 11)' :
                  'rgb(234, 179, 8)'
              }}
            >
              <div>
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground">{category.description}</div>
              </div>
              <div className="text-right">
                <div className={
                  category.level === 'Critical' ? 'text-red-500' :
                  category.level === 'High' ? 'text-orange-500' :
                  category.level === 'Medium' ? 'text-amber-500' :
                  'text-yellow-500'
                }>
                  {category.score}
                </div>
                <div className="text-xs text-muted-foreground">{category.level}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Risk Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Critical Risks</div>
            <div className="text-lg font-bold text-red-500">{data.criticalRisks}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">High Risks</div>
            <div className="text-lg font-bold text-orange-500">{data.highRisks}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Total Gaps</div>
            <div className="text-lg font-bold">{data.totalRisks}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs">
          Remediation Plan
        </Button>
        <Button variant="default" size="sm" className="text-xs" asChild>
          <Link href="/risk/assessment">
            Full Risk Analysis
            <BarChart4 className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
