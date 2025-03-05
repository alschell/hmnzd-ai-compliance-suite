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
  AlertOctagon,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useRiskAssessment } from "@/hooks/use-risk-assessment";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ComplianceRiskAnalyzer() {
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
            <Activity className="h-4 w-4 mr-2" />
            Risk Analysis
          </CardTitle>
          <CardDescription>Compliance gap assessment</CardDescription>
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
            <Activity className="h-4 w-4 mr-2" />
            Risk Analysis
          </CardTitle>
          <CardDescription>Compliance gap assessment</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load risk analysis data.
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
            <Activity className="h-4 w-4 mr-2" />
            Risk Analysis
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Analysis of compliance gaps and risk areas that need attention. Lower scores indicate better risk management.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Refresh risk analysis">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Compliance gap assessment</span>
          <span className="text-xs text-muted-foreground">Updated: 2025-03-05 09:43:36</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        {/* Risk Level Badge */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Current Exposure Level:</div>
          <Badge className={`${bgColor} ${color.replace('text-', 'text-')}`}>
            {level} Exposure
          </Badge>
        </div>
        
        {/* Risk Visualization */}
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-center mb-2">
            <div className={`text-2xl font-bold ${color}`}>
              {data.overallScore}
              <span className="text-sm font-normal text-muted-foreground ml-1">risk index</span>
            </div>
            
            {scoreTrend !== "none" && (
              <div className={`flex items-center justify-center text-xs ${
                scoreTrend === "up" ? "text-red-500" : "text-green-500"
              }`}>
                {scoreTrend === "up" ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>{Math.abs(data.overallScore - data.previousScore).toFixed(1)} points (increased risk)</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>{Math.abs(data.overallScore - data.previousScore).toFixed(1)} points (decreased risk)</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Custom risk meter/thermometer visualization */}
          <div className="w-full h-10 bg-gray-100 rounded-lg mt-2 mb-1 overflow-hidden relative">
            <div className="absolute inset-0 flex">
              <div className="bg-green-500 h-full" style={{ width: "20%" }}></div>
              <div className="bg-yellow-500 h-full" style={{ width: "20%" }}></div>
              <div className="bg-amber-500 h-full" style={{ width: "20%" }}></div>
              <div className="bg-orange-500 h-full" style={{ width: "20%" }}></div>
              <div className="bg-red-500 h-full" style={{ width: "20%" }}></div>
            </div>
            
            {/* Marker for current score */}
            <div 
              className="absolute top-0 bottom-0 flex items-center justify-center transition-all duration-700 ease-in-out"
              style={{ left: `${scorePosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className={`h-14 w-2.5 ${color.replace('text-', 'bg-')} rounded-full shadow-lg`}></div>
            </div>
          </div>
          
          <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
            <span>0-20</span>
            <span>21-40</span>
            <span>41-60</span>
            <span>61-80</span>
            <span>81-100</span>
          </div>
        </div>
        
        {/* Risk Breakdown */}
        <div className="space-y-3">
          <div className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            Key Risk Areas
          </div>
          
          {data.categories.slice(0, 3).map((category, i) => (
            <div key={i} className="flex items-center justify-between text-sm border-l-4 pl-3 py-2 bg-gray-50 rounded-r-md"
              style={{
                borderLeftColor: 
                  category.level === 'Critical' ? 'rgb(239, 68, 68)' :
                  category.level === 'High' ? 'rgb(249, 115, 22)' :
                  category.level === 'Medium' ? 'rgb(245, 158, 11)' :
                  'rgb(234, 179, 8)'
              }}
            >
              <div className="flex-1">
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{category.description}</div>
                {category.impactedFrameworks && category.impactedFrameworks.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {category.impactedFrameworks.map((framework, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] py-0 h-4">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right pl-2">
                <div className={`${
                  category.level === 'Critical' ? 'text-red-500' :
                  category.level === 'High' ? 'text-orange-500' :
                  category.level === 'Medium' ? 'text-amber-500' :
                  'text-yellow-500'
                } font-semibold`}>
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
            <div className="text-xs text-muted-foreground">Critical</div>
            <div className="text-lg font-bold text-red-500">{data.criticalRisks}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">High</div>
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
          Mitigation Plan
        </Button>
        <Button variant="default" size="sm" className="text-xs" asChild>
          <Link href="/risk/analysis">
            Full Assessment
            <BarChart4 className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
