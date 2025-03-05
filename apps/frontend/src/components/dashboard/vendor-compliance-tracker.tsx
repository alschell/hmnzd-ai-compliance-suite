"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Search, Buildings, ExternalLink, AlertTriangle, CheckCircle2, Clock, Info, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { useVendorCompliance } from "@/hooks/use-vendor-compliance";

export function VendorComplianceTracker() {
  const { data, isLoading, error } = useVendorCompliance();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };
  
  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  // Get status badge for vendor
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Compliant
          </Badge>
        );
      case 'at risk':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <AlertTriangle className="h-3 w-3" />
            At Risk
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Non-Compliant
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <Clock className="h-3 w-3" />
            Assessment Pending
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Certification Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get risk level badge
  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };
  
  // Filter vendors based on search and risk level
  const filteredVendors = data?.vendors?.filter(vendor => {
    // Filter by search
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by risk level
    const matchesRisk = riskFilter === "all" || vendor.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    
    return matchesSearch && matchesRisk;
  }) || [];

  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Buildings className="h-5 w-5 mr-2" />
            Vendor Compliance
          </CardTitle>
          <CardDescription>Monitor third-party compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Buildings className="h-5 w-5 mr-2" />
            Vendor Compliance
          </CardTitle>
          <CardDescription>Monitor third-party compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading vendor compliance data
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Buildings className="h-5 w-5" />
            <CardTitle>Vendor Compliance</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8" asChild>
            <Link href="/vendors/add">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Vendor
            </Link>
          </Button>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Monitor and manage third-party compliance status</span>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Filter className="h-3 w-3" />
              Filter
            </Button>
          </div>
        </CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search vendors..."
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <Button 
            variant={riskFilter === "all" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setRiskFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={riskFilter === "critical" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setRiskFilter("critical")}
          >
            Critical
          </Button>
          <Button 
            variant={riskFilter === "high" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setRiskFilter("high")}
          >
            High Risk
          </Button>
          <Button 
            variant={riskFilter === "medium" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setRiskFilter("medium")}
          >
            Medium Risk
          </Button>
          <Button 
            variant={riskFilter === "low" ? "secondary" : "outline"} 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setRiskFilter("low")}
          >
            Low Risk
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Vendor compliance stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Total Vendors</div>
            <div className="text-2xl font-bold">{data.totalVendors}</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Compliant</div>
            <div className="text-2xl font-bold text-green-600">{data.compliantVendors}</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">At Risk</div>
            <div className="text-2xl font-bold text-amber-500">{data.atRiskVendors}</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Non-Compliant</div>
            <div className="text-2xl font-bold text-red-500">{data.nonCompliantVendors}</div>
          </div>
        </div>
        
        {/* Overall vendor risk status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Overall Vendor Risk Status</h3>
            <span className="text-sm font-medium">{data.overallRiskScore}% Managed</span>
          </div>
          <Progress value={data.overallRiskScore} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{data.reviewedVendors} of {data.totalVendors} vendors reviewed</span>
            <span>Next due: {formatDate(data.nextAssessmentDue)}</span>
          </div>
        </div>
        
        {/* Vendor list */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Buildings className="mx-auto h-10 w-10 mb-2 opacity-50" />
            <p>No vendors found matching your search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVendors.slice(0, 5).map((vendor) => (
              <div key={vendor.id} className="border rounded-md overflow-hidden">
                <Link 
                  href={`/vendors/${vendor.id}`}
                  className="block p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {vendor.logoUrl ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={vendor.logoUrl} alt={vendor.name} />
                          <AvatarFallback>{vendor.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Buildings className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{vendor.name}</h3>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {vendor.category}
                          </Badge>
                          {getRiskBadge(vendor.riskLevel)}
                          <span className="text-xs text-muted-foreground">
                            Last assessed {getRelativeTime(vendor.lastAssessmentDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(vendor.status)}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(vendor.nextAssessmentDue)}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Next assessment due</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                      <span>Compliance Score</span>
                      <span className={
                        vendor.complianceScore >= 80 ? "text-green-600" :
                        vendor.complianceScore >= 60 ? "text-amber-600" :
                        "text-red-600"
                      }>
                        {vendor.complianceScore}%
                      </span>
                    </div>
                    <Progress 
                      value={vendor.complianceScore} 
                      className="h-1.5"
                      indicatorClassName={
                        vendor.complianceScore >= 80 ? "bg-green-600" :
                        vendor.complianceScore >= 60 ? "bg-amber-500" :
                        "bg-red-500"
                      } 
                    />
                  </div>
                  
                  {vendor.issues > 0 && (
                    <div className="mt-3 text-xs flex items-center">
                      <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                      <span className="text-muted-foreground">
                        {vendor.issues} open compliance {vendor.issues === 1 ? 'issue' : 'issues'}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {vendor.certifications?.map((cert, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="text-[10px] h-5 bg-muted/50">
                              {cert.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {cert.status === 'valid' ? 'Valid until' : 'Expired on'}: {formatDate(cert.validUntil)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full text-xs" asChild>
          <Link href="/vendors">
            View All Vendors
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
