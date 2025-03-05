import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Info, ArrowUpRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComplianceSummary } from "@/hooks/use-compliance-summary";

export function DashboardComplianceSummary() {
  const { data, isLoading } = useComplianceSummary();
  const [selectedFramework, setSelectedFramework] = useState<string>("all");
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return "text-green-500";
      case 'at risk':
        return "text-amber-500";
      case 'non-compliant':
        return "text-red-500";
      case 'pending':
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return (
          <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-500 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Compliant
          </Badge>
        );
      case 'at risk':
        return (
          <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-500 gap-1">
            <AlertTriangle className="h-3 w-3" />
            At Risk
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge variant="outline" className="border-red-500/50 bg-red-500/10 text-red-500 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Non-Compliant
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-500 gap-1">
            <Info className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter frameworks based on selection
  const frameworksToDisplay = selectedFramework === 'all' 
    ? data?.frameworks 
    : data?.frameworks?.filter(f => f.id === selectedFramework);
  
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Compliance Summary</CardTitle>
          </div>
          <Select value={selectedFramework} onValueChange={setSelectedFramework}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frameworks</SelectItem>
              {data?.frameworks?.map(framework => (
                <SelectItem key={framework.id} value={framework.id}>
                  {framework.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          Current compliance status across regulatory frameworks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : !data?.frameworks || frameworksToDisplay?.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed">
            <Shield className="h-8 w-8 text-muted-foreground/70" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No compliance frameworks configured
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              asChild
            >
              <Link href="/settings/frameworks">
                Configure Frameworks
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall compliance score */}
            {selectedFramework === 'all' && data.overallScore && (
              <div className="pb-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Overall Compliance Score</h3>
                  <span className={`text-lg font-semibold ${getStatusColor(data.overallStatus)}`}>
                    {data.overallScore}%
                  </span>
                </div>
                <div className="space-y-2">
                  <Progress value={data.overallScore} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{getStatusBadge(data.overallStatus)}</span>
                    <span>{data.lastAssessment}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Framework specific compliance */}
            <div className="space-y-5">
              {frameworksToDisplay?.map(framework => (
                <div key={framework.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium flex items-center">
                        {framework.name}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-xs">{framework.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </h3>
                      <p className="text-xs text-muted-foreground">{framework.region}</p>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(framework.status)}`}>
                      {framework.complianceScore}%
                    </span>
                  </div>
                  
                  <Progress value={framework.complianceScore} className="h-2" />
                  
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {getStatusBadge(framework.status)}
                    
                    <div className="flex items-center gap-1 ml-auto">
                      <Badge variant="secondary" className="gap-1 h-5">
                        <CheckCircle2 className="h-3 w-3" />
                        {framework.controlsCompliant} / {framework.totalControls}
                      </Badge>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1" 
                        asChild
                      >
                        <Link href={`/compliance/${framework.id}`}>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Critical findings */}
                  {framework.criticalFindings > 0 && (
                    <div className="text-xs bg-red-50 text-red-700 px-3 py-2 rounded-md flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {framework.criticalFindings} critical compliance gaps require immediate action
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {!isLoading && data?.frameworks && data.frameworks.length > 0 && (
        <CardFooter className="pt-0">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/compliance">
              View Detailed Compliance Report
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
