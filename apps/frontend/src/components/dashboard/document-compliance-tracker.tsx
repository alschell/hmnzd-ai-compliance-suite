"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  FileText, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Info, 
  FileWarning,
  FilePlus2,
  ExternalLink,
  Calendar
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow, isBefore } from "date-fns";
import { useDocumentCompliance } from "@/hooks/use-document-compliance";

export function DocumentComplianceTracker() {
  const { data, isLoading, error } = useDocumentCompliance();
  const [searchQuery, setSearchQuery] = useState("");
  
  const currentDate = new Date("2025-03-05T07:38:25Z"); // Using the current timestamp provided
  
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
  
  // Check if document is expired
  const isExpired = (expiryDate: string) => {
    return isBefore(new Date(expiryDate), currentDate);
  };
  
  // Check if document is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(currentDate);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return isBefore(expiry, thirtyDaysFromNow) && !isBefore(expiry, currentDate);
  };
  
  // Get status badge for document
  const getStatusBadge = (status: string, expiryDate?: string) => {
    if (expiryDate && isExpired(expiryDate)) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>
      );
    }
    
    if (expiryDate && isExpiringSoon(expiryDate)) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
          <Clock className="h-3 w-3" />
          Expiring Soon
        </Badge>
      );
    }
    
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <Info className="h-3 w-3" />
            Draft
          </Badge>
        );
      case 'review':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
            <FileText className="h-3 w-3" />
            Under Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <FileWarning className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter documents based on search
  const filteredDocuments = data?.documents?.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.framework?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Sort documents: expired first, then expiring soon, then by last updated
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (a.expiryDate && isExpired(a.expiryDate)) {
      if (b.expiryDate && isExpired(b.expiryDate)) {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      return -1;
    }
    
    if (b.expiryDate && isExpired(b.expiryDate)) {
      return 1;
    }
    
    if (a.expiryDate && isExpiringSoon(a.expiryDate)) {
      if (b.expiryDate && isExpiringSoon(b.expiryDate)) {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      return -1;
    }
    
    if (b.expiryDate && isExpiringSoon(b.expiryDate)) {
      return 1;
    }
    
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });
  
  // Get compliance documents stats
  const totalDocuments = data?.documents?.length || 0;
  const approvedDocuments = data?.documents?.filter(doc => 
    doc.status.toLowerCase() === 'approved' && (!doc.expiryDate || !isExpired(doc.expiryDate))
  ).length || 0;
  const expiredDocuments = data?.documents?.filter(doc => 
    doc.expiryDate && isExpired(doc.expiryDate)
  ).length || 0;
  const expiringSoonDocuments = data?.documents?.filter(doc => 
    doc.expiryDate && isExpiringSoon(doc.expiryDate)
  ).length || 0;
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Document Compliance Tracker
          </CardTitle>
          <CardDescription>Track and manage compliance documentation</CardDescription>
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
            <FileText className="h-5 w-5 mr-2" />
            Document Compliance Tracker
          </CardTitle>
          <CardDescription>Track and manage compliance documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading document compliance data
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
            <FileText className="h-5 w-5" />
            <CardTitle>Document Compliance Tracker</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="h-8" asChild>
            <Link href="/documents/new">
              <FilePlus2 className="h-3.5 w-3.5 mr-1" />
              New Document
            </Link>
          </Button>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Track and manage compliance documentation</span>
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
            placeholder="Search documents..."
            className="w-full pl-8 pr-4 py-2 text-sm border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Document stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Total Documents</div>
            <div className="text-2xl font-bold">{totalDocuments}</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Approved & Valid</div>
            <div className="text-2xl font-bold text-green-600">{approvedDocuments}</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Expired</div>
            <div className="text-2xl font-bold text-red-500">{expiredDocuments}</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Expiring Soon</div>
            <div className="text-2xl font-bold text-amber-500">{expiringSoonDocuments}</div>
          </div>
        </div>
        
        {/* Document completion status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Documentation Completion</h3>
            <span className="text-sm font-medium">{data.completionPercentage}%</span>
          </div>
          <Progress value={data.completionPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{data.completedDocuments} completed</span>
            <span>{data.requiredDocuments} required</span>
          </div>
        </div>
        
        {/* Document list */}
        {sortedDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-10 w-10 mb-2 opacity-50" />
            <p>No documents found matching your search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDocuments.slice(0, 5).map((document) => (
              <div key={document.id} className="border rounded-md overflow-hidden">
                <Link 
                  href={`/documents/${document.id}`}
                  className="block p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${
                        document.status.toLowerCase() === 'approved' ? 'text-green-500' : 
                        document.status.toLowerCase() === 'review' ? 'text-amber-500' : 
                        document.status.toLowerCase() === 'rejected' ? 'text-red-500' : 
                        'text-blue-500'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{document.title}</h3>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {document.category}
                          </Badge>
                          {document.framework && (
                            <Badge variant="outline" className="text-xs">
                              {document.framework}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Updated {getRelativeTime(document.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(document.status, document.expiryDate)}
                      {document.expiryDate && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`flex items-center text-xs ${
                                isExpired(document.expiryDate) ? 'text-red-600' : 
                                isExpiringSoon(document.expiryDate) ? 'text-amber-600' : 
                                'text-muted-foreground'
                              }`}>
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(document.expiryDate)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isExpired(document.expiryDate) ? 'Expired' : 'Expires'} on {format(new Date(document.expiryDate), "MMMM d, yyyy")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  
                  {document.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {document.description}
                    </p>
                  )}
                  
                  {document.owners && document.owners.length > 0 && (
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <span className="mr-1">Owner:</span>
                      {document.owners.map((owner, index) => (
                        <span key={owner.id}>
                          {owner.name}{index < document.owners.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="outline" size="sm" className="w-full text-xs" asChild>
          <Link href="/documents">
            View All Documents
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
