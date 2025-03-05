"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Brain, CheckCircle2, ExternalLink, Info, Search, Settings } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAIModelCompliance } from "@/hooks/use-ai-model-compliance";

export function AIModelCompliance() {
  const { data, isLoading } = useAIModelCompliance();
  const [searchQuery, setSearchQuery] = useState("");

  const getComplianceColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getComplianceStatus = (score: number) => {
    if (score >= 80) return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Compliant
      </Badge>
    );
    if (score >= 60) return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
        <AlertTriangle className="h-3 w-3" />
        Needs Review
      </Badge>
    );
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
        <AlertTriangle className="h-3 w-3" />
        Non-Compliant
      </Badge>
    );
  };

  const filteredModels = data?.models?.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Card className="col-span-full shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <CardTitle>AI Model Compliance</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8" asChild>
            <Link href="/ai-governance">
              <Settings className="h-3.5 w-3.5 mr-1" />
              Governance Settings
            </Link>
          </Button>
        </div>
        <CardDescription className="flex items-center">
          Compliance status and risks of AI models across your organization
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>This dashboard shows the compliance status of AI models based on relevant regulations like EU AI Act, NIST AI RMF, and your organization's AI governance framework.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search models..."
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Summary metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Total Models</div>
                <div className="text-2xl font-bold">{data?.totalModels || 0}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Compliant Models</div>
                <div className="text-2xl font-bold text-green-600">{data?.compliantModels || 0}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">At Risk Models</div>
                <div className="text-2xl font-bold text-amber-500">{data?.atRiskModels || 0}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Non-Compliant</div>
                <div className="text-2xl font-bold text-red-500">{data?.nonCompliantModels || 0}</div>
              </div>
            </div>

            {/* Model list with compliance status */}
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">All Models</TabsTrigger>
                <TabsTrigger value="high-risk">High Risk</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="third-party">Third-Party</TabsTrigger>
              </TabsList>
            
              <TabsContent value="all" className="space-y-4">
                {filteredModels.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Brain className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">No AI models found matching your search</p>
                  </div>
                ) : (
                  filteredModels.map((model) => (
                    <div key={model.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{model.name}</h3>
                            <Badge variant="outline" className="ml-2 bg-slate-50">{model.type}</Badge>
                            {model.highRisk && (
                              <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                                High Risk
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{model.purpose}</p>
                        </div>
                        <div className="text-right">
                          {getComplianceStatus(model.complianceScore)}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Compliance Score</span>
                          <span className={getComplianceColor(model.complianceScore)}>
                            {model.complianceScore}%
                          </span>
                        </div>
                        <Progress 
                          value={model.complianceScore} 
                          className="h-2" 
                          indicatorClassName={
                            model.complianceScore >= 80 ? "bg-green-600" : 
                            model.complianceScore >= 60 ? "bg-amber-500" : 
                            "bg-red-500"
                          }
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {model.complianceFactors.map((factor, index) => (
                          <div key={index} className="text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-muted-foreground">{factor.name}</span>
                              <span className={
                                factor.score >= 80 ? "text-green-600" : 
                                factor.score >= 60 ? "text-amber-500" : 
                                "text-red-500"
                              }>
                                {factor.score}%
                              </span>
                            </div>
                            <Progress 
                              value={factor.score} 
                              className="h-1" 
                              indicatorClassName={
                                factor.score >= 80 ? "bg-green-600" : 
                                factor.score >= 60 ? "bg-amber-500" : 
                                "bg-red-500"
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          asChild
                        >
                          <Link href={`/ai-governance/models/${model.id}`}>
                            View Details
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              
              {/* Other tab contents would follow similar pattern */}
              <TabsContent value="high-risk" className="space-y-4">
                {filteredModels
                  .filter(model => model.highRisk)
                  .map((model) => (
                    <div key={model.id} className="border rounded-lg p-4">
                      {/* Same content structure as "all" tab */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{model.name}</h3>
                            <Badge variant="outline" className="ml-2 bg-slate-50">{model.type}</Badge>
                            <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                              High Risk
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{model.purpose}</p>
                        </div>
                        <div className="text-right">
                          {getComplianceStatus(model.complianceScore)}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Compliance Score</span>
                          <span className={getComplianceColor(model.complianceScore)}>
                            {model.complianceScore}%
                          </span>
                        </div>
                        <Progress 
                          value={model.complianceScore} 
                          className="h-2" 
                          indicatorClassName={
                            model.complianceScore >= 80 ? "bg-green-600" : 
                            model.complianceScore >= 60 ? "bg-amber-500" : 
                            "bg-red-500"
                          }
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {model.complianceFactors.map((factor, index) => (
                          <div key={index} className="text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-muted-foreground">{factor.name}</span>
                              <span className={
                                factor.score >= 80 ? "text-green-600" : 
                                factor.score >= 60 ? "text-amber-500" : 
                                "text-red-500"
                              }>
                                {factor.score}%
                              </span>
                            </div>
                            <Progress 
                              value={factor.score} 
                              className="h-1" 
                              indicatorClassName={
                                factor.score >= 80 ? "bg-green-600" : 
                                factor.score >= 60 ? "bg-amber-500" : 
                                "bg-red-500"
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          asChild
                        >
                          <Link href={`/ai-governance/models/${model.id}`}>
                            View Details
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/ai-governance/compliance">
            View All AI Models
            <ExternalLink className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
