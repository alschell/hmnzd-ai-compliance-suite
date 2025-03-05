"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Bell, Clock, ExternalLink, Filter, HelpCircle, MoreHorizontal, Pencil, PlusCircle, Shield, Siren } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { useComplianceIncidents } from "@/hooks/use-compliance-incidents";
import { IncidentDetails } from "@/types/incidents";

export function ComplianceIncidentsTracker() {
  const { data, isLoading, error } = useComplianceIncidents();
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetails | null>(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [activeTab, setActiveTab] = useState("open");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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

  // Get CSS classes for severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Get CSS classes for status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Open</Badge>;
      case 'in progress':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">In Progress</Badge>;
      case 'pending review':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending Review</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Toggle incident details expansion
  const toggleExpand = (incidentId: string) => {
    setExpanded(prev => ({
      ...prev,
      [incidentId]: !prev[incidentId]
    }));
  };

  // Handle opening incident details
  const openIncidentDetails = (incident: IncidentDetails) => {
    setSelectedIncident(incident);
    setShowDetailsSheet(true);
  };

  // Filter incidents based on active tab
  const filteredIncidents = data?.incidents?.filter(incident => {
    if (activeTab === 'open') {
      return incident.status.toLowerCase() !== 'closed' && incident.status.toLowerCase() !== 'resolved';
    } else if (activeTab === 'resolved') {
      return incident.status.toLowerCase() === 'resolved' || incident.status.toLowerCase() === 'closed';
    }
    return true; // 'all' tab
  }) || [];

  // Get the initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Siren className="h-5 w-5" />
              <CardTitle>Compliance Incidents</CardTitle>
            </div>
          </div>
          <CardDescription>Track and manage compliance-related incidents</CardDescription>
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
      <Card className="col-span-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Siren className="h-5 w-5" />
            <span>Compliance Incidents</span>
          </CardTitle>
          <CardDescription>Track and manage compliance-related incidents</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center text-destructive py-6">
            Error loading compliance incidents
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
            <Siren className="h-5 w-5" />
            <CardTitle>Compliance Incidents</CardTitle>
            <Badge variant="outline" className="ml-2">
              {data.openIncidents} open
            </Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Track compliance incidents that may impact your regulatory obligations. Manage investigations and remediation steps.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>View and manage compliance incidents</span>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Filter className="h-3 w-3" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" asChild>
              <Link href="/incidents/new">
                <PlusCircle className="h-3 w-3" />
                New Incident
              </Link>
            </Button>
          </div>
        </CardDescription>

        <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="open" className="text-xs">Open Incidents</TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs">Resolved</TabsTrigger>
            <TabsTrigger value="all" className="text-xs">All Incidents</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-2">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="mx-auto h-10 w-10 mb-2 opacity-50" />
            <p>No incidents found for the selected filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIncidents.slice(0, 5).map((incident) => (
              <div key={incident.id} className="border rounded-md overflow-hidden">
                <div 
                  className="p-3 flex items-start justify-between cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(incident.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className={`w-1 self-stretch rounded-full ${
                        incident.severity === 'Critical' ? 'bg-red-500' :
                        incident.severity === 'High' ? 'bg-orange-500' :
                        incident.severity === 'Medium' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                    />
                    <div>
                      <h3 className="font-medium text-sm">{incident.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getRelativeTime(incident.reportedAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {incident.referenceId}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(incident.severity)}
                    {getStatusBadge(incident.status)}
                  </div>
                </div>

                {expanded[incident.id] && (
                  <div className="px-4 pb-3 pt-0 bg-muted/30 border-t">
                    <div className="text-sm my-2 text-muted-foreground">
                      {incident.description}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Reported By:</span>
                        <div className="flex items-center mt-1">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarImage src={incident.reportedBy.avatarUrl} alt={incident.reportedBy.name} />
                            <AvatarFallback>{getInitials(incident.reportedBy.name)}</AvatarFallback>
                          </Avatar>
                          <span>{incident.reportedBy.name}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Assigned To:</span>
                        <div className="flex items-center mt-1">
                          {incident.assignedTo ? (
                            <>
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarImage src={incident.assignedTo.avatarUrl} alt={incident.assignedTo.name} />
                                <AvatarFallback>{getInitials(incident.assignedTo.name)}</AvatarFallback>
                              </Avatar>
                              <span>{incident.assignedTo.name}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground italic">Unassigned</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Related Frameworks:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {incident.relatedFrameworks?.map((framework, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] h-5">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Due By:</span>
                        <div className="mt-1">
                          {incident.dueDate ? formatDate(incident.dueDate) : 'Not set'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3 pt-2 border-t">
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => openIncidentDetails(incident)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full text-xs" asChild>
          <Link href="/incidents">
            View All Incidents
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>

      {/* Incident Details Sheet */}
      <Sheet open={showDetailsSheet} onOpenChange={setShowDetailsSheet}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Incident Details</SheetTitle>
            <SheetDescription>
              {selectedIncident?.referenceId} • {getRelativeTime(selectedIncident?.reportedAt || '')}
            </SheetDescription>
          </SheetHeader>
          
          {selectedIncident && (
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{selectedIncident.title}</h3>
                <div className="flex items-center space-x-2">
                  {getSeverityBadge(selectedIncident.severity)}
                  {getStatusBadge(selectedIncident.status)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedIncident.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-sm font-medium mb-1">Reported By</h4>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={selectedIncident.reportedBy.avatarUrl} alt={selectedIncident.reportedBy.name} />
                      <AvatarFallback>{getInitials(selectedIncident.reportedBy.name)}</AvatarFallback>
                    </Avatar>
                    <span>{selectedIncident.reportedBy.name}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Assigned To</h4>
                  <div className="flex items-center">
                    {selectedIncident.assignedTo ? (
                      <>
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={selectedIncident.assignedTo.avatarUrl} alt={selectedIncident.assignedTo.name} />
                          <AvatarFallback>{getInitials(selectedIncident.assignedTo.name)}</AvatarFallback>
                        </Avatar>
                        <span>{selectedIncident.assignedTo.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Date Reported</h4>
                  <p className="text-muted-foreground">{formatDate(selectedIncident.reportedAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Due Date</h4>
                  <p className="text-muted-foreground">
                    {selectedIncident.dueDate ? formatDate(selectedIncident.dueDate) : 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Incident Type</h4>
                  <p className="text-muted-foreground">{selectedIncident.type}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Impact</h4>
                  <p className="text-muted-foreground">{selectedIncident.impact || 'Not assessed'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Related Frameworks</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedIncident.relatedFrameworks?.map((framework, i) => (
                    <Badge key={i} variant="secondary">
                      {framework}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedIncident.timeline && selectedIncident.timeline.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Activity Timeline</h4>
                  <div className="space-y-3 pl-2">
                    {selectedIncident.timeline.map((event, i) => (
                      <div key={i} className="relative pl-6 pb-3 border-l border-muted">
                        <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-background bg-muted" />
                        <p className="text-sm">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(event.timestamp)} • {event.user}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedIncident.actions && selectedIncident.actions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Required Actions</h4>
                  <div className="space-y-2">
                    {selectedIncident.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                        <input
                          type="checkbox"
                          checked={action.completed}
                          className="mt-1"
                          readOnly
                        />
                        <div>
                          <p className="text-sm font-medium">{action.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              Due: {formatDate(action.dueDate)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Assigned to: {action.assignedTo}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <SheetFooter className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" size="sm" className="sm:flex-1">
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit Incident
            </Button>
            <Button size="sm" className="sm:flex-1" asChild>
              <Link href={`/incidents/${selectedIncident?.id}`}>
                View Full Details
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
