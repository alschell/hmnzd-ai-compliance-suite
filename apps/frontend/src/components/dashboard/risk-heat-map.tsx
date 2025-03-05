"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, AlertTriangle, BarChart4, Download } from "lucide-react";
import { useRiskAssessment } from "@/hooks/use-risk-assessment";
import { useState } from "react";

interface RiskCell {
  count: number;
  risks: {
    id: string;
    name: string;
    category: string;
    score: number;
  }[];
}

export function RiskHeatMap() {
  const { data, isLoading } = useRiskAssessment();
  const [selectedTab, setSelectedTab] = useState<string>("heatmap");
  const [selectedCell, setSelectedCell] = useState<RiskCell | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  // Impact and likelihood labels
  const impacts = ["Negligible", "Minor", "Moderate", "Major", "Severe"];
  const likelihoods = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
  
  // Get color for risk level based on combined score (impact × likelihood)
  const getRiskColor = (impact: number, likelihood: number) => {
    const score = impact * likelihood;
    if (score >= 20) return "bg-red-100 border-red-300 text-red-700 hover:bg-red-200";
    if (score >= 12) return "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200";
    if (score >= 6) return "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200";
    if (score >= 3) return "bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200";
    return "bg-green-100 border-green-300 text-green-700 hover:bg-green-200";
  };

  // Get severity level text based on combined score
  const getRiskSeverity = (impact: number, likelihood: number) => {
    const score = impact * likelihood;
    if (score >= 20) return "Critical";
    if (score >= 12) return "High";
    if (score >= 6) return "Medium";
    if (score >= 3) return "Low";
    return "Minimal";
  };

  // Get cell data if available
  const getCellData = (impact: number, likelihood: number) => {
    if (!data?.heatMap) return { count: 0, risks: [] };
    
    const key = `${impact}-${likelihood}`;
    if (data.heatMap[key]) {
      return data.heatMap[key];
    }
    return { count: 0, risks: [] };
  };

  // Handle cell click to show risks in that cell
  const handleCellClick = (impact: number, likelihood: number) => {
    const cellData = getCellData(impact, likelihood);
    if (cellData.count > 0) {
      setSelectedCell(cellData);
      setShowModal(true);
    }
  };
  
  // Format date for easy reading
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="col-span-full shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Risk Assessment</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
        </div>
        <CardDescription className="flex items-center">
          Compliance risk distribution across impact and likelihood dimensions
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>This heat map shows the distribution of compliance risks based on their potential impact and likelihood of occurrence.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
        
        <Tabs defaultValue="heatmap" value={selectedTab} onValueChange={setSelectedTab} className="w-full mt-2">
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="heatmap" className="text-xs">Risk Heat Map</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs">Risk Categories</TabsTrigger>
            <TabsTrigger value="trend" className="text-xs">Risk Trend</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <TabsContent value="heatmap" className="mt-0">
            <div className="border rounded-md overflow-hidden">
              <div className="flex">
                {/* Y-axis label */}
                <div className="flex flex-col items-center justify-center p-2 bg-muted/50 text-xs font-medium w-24">
                  <span className="transform -rotate-90 whitespace-nowrap">Likelihood</span>
                </div>
                
                {/* Heat map grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-5 gap-px">
                    {/* Top header row with impact labels */}
                    {impacts.map((label, index) => (
                      <div 
                        key={`header-${index}`}
                        className="p-2 bg-muted/50 text-center text-xs font-medium"
                      >
                        {label}
                      </div>
                    ))}
                    
                    {/* Heat map cells */}
                    {likelihoods.map((likelihoodLabel, likelihoodIndex) => (
                      // For each likelihood (row)
                      <>
                        {impacts.map((impactLabel, impactIndex) => {
                          // For each impact (column)
                          const impact = impactIndex + 1;
                          const likelihood = 5 - likelihoodIndex; // Reverse order (5 at top)
                          const cellData = getCellData(impact, likelihood);
                          return (
                            <button
                              key={`cell-${impact}-${likelihood}`}
                              className={`p-4 flex items-center justify-center border ${getRiskColor(impact, likelihood)} ${
                                cellData.count > 0 ? 'cursor-pointer' : 'cursor-default'
                              }`}
                              onClick={() => handleCellClick(impact, likelihood)}
                              disabled={cellData.count === 0}
                            >
                              {cellData.count > 0 ? (
                                <div className="text-center">
                                  <div className="text-xl font-bold">{cellData.count}</div>
                                  <div className="text-xs mt-1">{getRiskSeverity(impact, likelihood)}</div>
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">0</div>
                              )}
                            </button>
                          );
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Bottom row with x-axis label */}
              <div className="flex">
                <div className="w-24 bg-muted/50"></div>
                <div className="flex-1 p-2 bg-muted/50 text-center text-xs font-medium">
                  Impact
                </div>
              </div>
            </div>
            
            {/* Risk summary statistics */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Total Risks</div>
                <div className="text-2xl font-bold">{data?.totalRisks || 0}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Critical Risks</div>
                <div className="text-2xl font-bold text-red-600">{data?.criticalRisks || 0}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">High Risks</div>
                <div className="text-2xl font-bold text-orange-500">{data?.highRisks || 0}</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-sm text-muted-foreground">Last Assessment</div>
                <div className="text-lg font-semibold">{data?.lastAssessmentDate ? formatDate(data.lastAssessmentDate) : 'N/A'}</div>
              </div>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="categories" className="mt-0">
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              {data?.riskCategories?.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-36 text-sm font-medium truncate">{category.name}</div>
                  <div className="flex-1 mx-3">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={
                          category.riskLevel === "Critical" ? "bg-red-500 h-full" :
                          category.riskLevel === "High" ? "bg-orange-500 h-full" :
                          category.riskLevel === "Medium" ? "bg-amber-500 h-full" :
                          category.riskLevel === "Low" ? "bg-yellow-500 h-full" : 
                          "bg-green-500 h-full"
                        }
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium">{category.count}</div>
                  <div className="w-24 text-right">
                    <Badge 
                      className={
                        category.riskLevel === "Critical" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                        category.riskLevel === "High" ? "bg-orange-100 text-orange-700 hover:bg-orange-100" :
                        category.riskLevel === "Medium" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                        category.riskLevel === "Low" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" : 
                        "bg-green-100 text-green-700 hover:bg-green-100"
                      }
                    >
                      {category.riskLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center">
                <BarChart4 className="h-4 w-4 mr-1" />
                Top Risk Insights
              </h4>
              <ul className="space-y-2">
                {data?.riskInsights?.map((insight, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-muted-foreground mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trend" className="mt-0">
          <div className="h-[250px] flex items-center justify-center border rounded-md bg-muted/30">
            {/* In a real implementation, this would be a chart component */}
            <div className="text-center text-muted-foreground">
              <BarChart4 className="h-10 w-10 mx-auto mb-2 opacity-60" />
              <p>Risk trend visualization would appear here</p>
              <p className="text-xs mt-1">(Requires implementation of chart component)</p>
            </div>
          </div>
          
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Key Observations</h4>
            <ul className="space-y-1 text-sm">
              {data?.trendObservations?.map((observation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-muted-foreground mr-2">•</span>
                  <span>{observation}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </CardContent>
      
      {/* Risk Cell Details Modal */}
      {showModal && selectedCell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">
                {`${getRiskSeverity(5, 5)} Risk Items (${selectedCell.count})`}
              </h3>
              <p className="text-sm text-muted-foreground">
                The following risks require attention based on their impact and likelihood.
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {selectedCell.risks.map((risk) => (
                  <div key={risk.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{risk.name}</h4>
                      <Badge 
                        className={
                          risk.score >= 20 ? "bg-red-100 text-red-700" :
                          risk.score >= 12 ? "bg-orange-100 text-orange-700" :
                          risk.score >= 6 ? "bg-amber-100 text-amber-700" :
                          risk.score >= 3 ? "bg-yellow-100 text-yellow-700" : 
                          "bg-green-100 text-green-700"
                        }
                      >
                        Score: {risk.score}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Category: {risk.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
              <Button>View All Risks</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
