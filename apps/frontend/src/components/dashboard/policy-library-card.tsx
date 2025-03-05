"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Search,
  Filter,
  BookOpen,
  Download,
  ExternalLink,
  Tag,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Clock,
  FileWarning,
  BarChart2,
  Plus
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { usePolicyLibrary } from "@/hooks/use-policy-library";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PolicyLibraryCard() {
  const { data, isLoading, error } = usePolicyLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const currentDate = new Date("2025-03-05T12:03:12Z");
  const currentUser = "alschell";
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };
  
  // Get status badge
  const getComplianceBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Compliant
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
            <Clock className="h-3 w-3" />
            Partial
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <FileWarning className="h-3 w-3" />
            Non-Compliant
          </Badge>
        );
      case 'not-applicable':
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 gap-1">
            Not Applicable
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter documents based on search, framework and category
  const filteredDocuments = data?.documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.frameworks && doc.frameworks.some(framework => 
        framework.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    const matchesFramework = selectedFramework === "all" || 
      (doc.frameworks && doc.frameworks.includes(selectedFramework));
    
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    
    return matchesSearch && matchesFramework && matchesCategory;
  }) || [];
  
  // Sort documents by most relevant to compliance
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    // First sort by reference count (most referenced first)
    if ((a.referenceCount || 0) !== (b.referenceCount || 0)) {
      return (b.referenceCount || 0) - (a.referenceCount || 0);
    }
    
    // Then by last updated date (most recent first)
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });
  
  // Get frameworks and categories
  const frameworks = data?.frameworks || [];
  const categories = data?.categories || [];
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Policy Library
          </CardTitle>
          <CardDescription>Access compliance documentation and resources</CardDescription>
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
            <BookOpen className="h-5 w-5 mr-2" />
            Policy Library
          </CardTitle>
          <CardDescription>Access compliance documentation and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading policy library data
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
            <BookOpen className="h-5 w-5" />
            <CardTitle>Policy Library</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
              <Link href="/policies/compliance-map">
                <BarChart2 className="h-3.5 w-3.5 mr-1" />
                Compliance Map
              </Link>
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-1" asChild>
              <Link href="/policies/upload">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Upload Document
              </Link>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Access and manage compliance documentation, policies, procedures, and evidence.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Access and manage compliance documentation and evidence</CardDescription>
        
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search documents..."
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Filter section */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-1.5">Framework:</span>
            <select
              className="text-sm border rounded-md px-2 py-1"
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
            >
              <option value="all">All Frameworks</option>
              {frameworks.map((framework) => (
                <option key={framework} value={framework}>
                  {framework}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center ml-4">
            <Filter className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-1.5">Category:</span>
            <select
              className="text-sm border rounded-md px-2 py-1"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Policy library stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Total Documents</div>
              <FileText className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.totalDocuments}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Policies: {data.stats.policies}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Mapped Controls</div>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{data.stats.mappedControls}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Coverage: {data.stats.controlCoverage}%
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Framework Coverage</div>
              <BarChart2 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{data.stats.frameworkCoverage}%</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Frameworks: {frameworks.length}
            </div>
          </div>
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Recently Added</div>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{data.stats.recentlyAdded}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Last 30 Days
            </div>
          </div>
        </div>
        
        {/* Library content */}
        <Tabs defaultValue="documents">
          <TabsList className="grid w-[360px] grid-cols-3 mb-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="mt-0">
            <ScrollArea className="h-[320px] pr-4">
              {sortedDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No documents found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedDocuments.map((doc) => (
                    <div key={doc.id} className="border rounded-md overflow-hidden">
                      <Link 
                        href={`/policies/documents/${doc.id}`}
                        className="block hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{doc.title}</h3>
                                {doc.type && (
                                  <Badge variant={doc.type === "Policy" ? "default" : "secondary"} className="text-xs">
                                    {doc.type}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{doc.id}</span>
                                <Badge variant="outline" className="text-xs">
                                  {doc.category}
                                </Badge>
                                {doc.version && (
                                  <span className="text-xs text-muted-foreground">
                                    v{doc.version}
                                  </span>
                                )}
                              </div>
                              
                              {doc.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {doc.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">
                                Updated: {formatDate(doc.lastUpdated)}
                              </div>
                              <div className="flex justify-end mt-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs mr-2">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Framework tags */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {doc.frameworks?.map((framework) => (
                              <Badge key={framework} variant="outline" className="text-xs flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {framework}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Compliance status */}
                          {doc.complianceStatus && (
                            <div className="mt-3 pt-3 border-t flex justify-between items-center">
                              <div className="text-xs text-muted-foreground">
                                Compliance Status
                              </div>
                              <div>
                                {getComplianceBadge(doc.complianceStatus)}
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-0">
            <div className="grid grid-cols-3 gap-3">
              {data.templates.map((template) => (
                <div key={template.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium truncate">{template.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{template.type}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  {template.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  
                  <div className="mt-2 pt-2 border-t flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {template.format}
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="evidence" className="mt-0">
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-3">
                {data.evidenceFolders.map((folder) => (
                  <div key={folder.id} className="border rounded-md overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <h3 className="font-medium">{folder.name}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {folder.fileCount} {folder.fileCount === 1 ? 'file' : 'files'}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        {folder.description}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          Updated: {formatDate(folder.lastUpdated)}
                        </div>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" asChild>
                          <Link href={`/policies/evidence/${folder.id}`}>
                            Browse
                            <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date("2025-03-05T12:03:12Z"), "MMM d, yyyy HH:mm:ss")}
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
          <Link href="/policies/library">
            View Full Library
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
