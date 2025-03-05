"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CalendarClock,
  HelpCircle,
  Plus,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { useComplianceCalendar } from "@/hooks/use-compliance-calendar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ComplianceCalendarCard() {
  const { data, isLoading, error } = useComplianceCalendar();
  const [currentDate, setCurrentDate] = useState(new Date("2025-03-05T11:54:14Z"));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar");
  
  // Calendar navigation
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Get days in month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });
  
  // Filter events for the selected date or for upcoming (if no date is selected)
  const getEventsForDate = (date: Date | null) => {
    if (!data?.events) return [];
    
    if (!date) {
      // Get upcoming events sorted by date
      const upcomingEvents = [...data.events]
        .filter(event => new Date(event.date) >= new Date("2025-03-05T11:54:14Z"))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return upcomingEvents.slice(0, 10); // Return top 10 upcoming events
    }
    
    return data.events.filter(event => isSameDay(new Date(event.date), date));
  };
  
  // Get event count for a specific date
  const getEventCountForDate = (date: Date) => {
    if (!data?.events) return 0;
    return data.events.filter(event => isSameDay(new Date(event.date), date)).length;
  };
  
  // Check if a date has high-priority events
  const hasHighPriorityEvents = (date: Date) => {
    if (!data?.events) return false;
    return data.events.some(event => 
      isSameDay(new Date(event.date), date) && 
      (event.priority === 'high' || event.priority === 'critical')
    );
  };
  
  // Get color class for event type
  const getEventTypeColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'audit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'renewal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'report':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'assessment':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };
  
  // Get appropriate icon for event type
  const getEventTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deadline':
        return <Clock className="h-3.5 w-3.5" />;
      case 'audit':
        return <Calendar className="h-3.5 w-3.5" />;
      case 'review':
        return <CalendarClock className="h-3.5 w-3.5" />;
      case 'renewal':
        return <CalendarDays className="h-3.5 w-3.5" />;
      case 'report':
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'assessment':
        return <CalendarDays className="h-3.5 w-3.5" />;
      default:
        return <Calendar className="h-3.5 w-3.5" />;
    }
  };
  
  // Get days between now and event date
  const getDaysDifference = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date("2025-03-05T11:54:14Z");
    
    // Reset time portion for accurate day calculation
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const differenceInTime = eventDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    return differenceInDays;
  };
  
  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (selectedDate && isSameDay(selectedDate, date)) {
      setSelectedDate(null); // Unselect if same date is clicked
    } else {
      setSelectedDate(date);
    }
  };
  
  // Grouped events by month
  const getUpcomingEventsByMonth = () => {
    if (!data?.events) return {};
    
    const today = new Date("2025-03-05T11:54:14Z");
    const upcomingEvents = [...data.events]
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const eventsByMonth: Record<string, any[]> = {};
    
    upcomingEvents.forEach(event => {
      const date = new Date(event.date);
      const monthYear = format(date, "MMMM yyyy");
      
      if (!eventsByMonth[monthYear]) {
        eventsByMonth[monthYear] = [];
      }
      
      eventsByMonth[monthYear].push(event);
    });
    
    return eventsByMonth;
  };
  
  const displayedEvents = getEventsForDate(selectedDate);
  const eventsByMonth = getUpcomingEventsByMonth();
  
  if (isLoading) {
    return (
      <Card className="col-span-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            Compliance Calendar
          </CardTitle>
          <CardDescription>Upcoming compliance dates and deadlines</CardDescription>
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
            <CalendarDays className="h-5 w-5 mr-2" />
            Compliance Calendar
          </CardTitle>
          <CardDescription>Upcoming compliance dates and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive py-6">
            Error loading compliance calendar data
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
            <CalendarDays className="h-5 w-5" />
            <CardTitle>Compliance Calendar</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
              <Link href="/calendar">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Full Calendar
              </Link>
            </Button>
            <Button variant="default" size="sm" className="h-8 gap-1" asChild>
              <Link href="/calendar/new-event">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Event
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
                  <p>Track important compliance deadlines, audits, certifications, and regulatory filing dates.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>Track upcoming compliance dates and deadlines</CardDescription>
        
        <Tabs defaultValue="calendar" value={activeView} onValueChange={(value) => setActiveView(value as "calendar" | "list")} className="mt-2">
          <TabsList className="grid w-[240px] grid-cols-2">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-2">
        <TabsContent value="calendar" className="mt-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{format(currentDate, 'MMMM yyyy')}</h3>
            <div className="flex space-x-1">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-4 text-center text-xs font-medium">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="h-20 p-1 border rounded-md bg-slate-50 opacity-50"></div>
            ))}
            
            {daysInMonth.map((day) => {
              const eventCount = getEventCountForDate(day);
              const hasHighPriority = hasHighPriorityEvents(day);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const dayCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "h-20 p-1 border rounded-md relative cursor-pointer transition-colors",
                    !dayCurrentMonth && "opacity-50 bg-slate-50",
                    isToday(day) && "border-primary",
                    isSelected && "ring-2 ring-primary ring-offset-1"
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div className={cn(
                    "flex items-center justify-center h-5 w-5 rounded-full text-xs",
                    isToday(day) && "bg-primary text-primary-foreground font-medium"
                  )}>
                    {format(day, 'd')}
                  </div>
                  
                  {eventCount > 0 && (
                    <div className="mt-1 text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[0.65rem] py-0 px-1 h-4",
                          hasHighPriority ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        {eventCount} {eventCount === 1 ? 'event' : 'events'}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Events list for selected date */}
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">
              {selectedDate 
                ? `Events for ${format(selectedDate, 'MMMM d, yyyy')}` 
                : 'Upcoming events'}
            </h3>
            
            <ScrollArea className="h-[220px] pr-4">
              {displayedEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No events {selectedDate ? 'for this date' : 'upcoming'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedEvents.map((event) => {
                    const daysUntil = getDaysDifference(event.date);
                    
                    return (
                      <Link 
                        key={event.id}
                        href={`/calendar/events/${event.id}`}
                        className="block border rounded-md p-2 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{formatEventDate(event.date)}</div>
                            
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs gap-1", getEventTypeColorClass(event.type))}
                              >
                                {getEventTypeIcon(event.type)}
                                {event.type}
                              </Badge>
                              
                              {event.framework && (
                                <Badge variant="secondary" className="text-xs">
                                  {event.framework}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {!selectedDate && daysUntil >= 0 && (
                            <div className={cn(
                              "text-xs font-medium",
                              daysUntil === 0 ? "text-red-600" :
                              daysUntil <= 7 ? "text-amber-600" : 
                              "text-muted-foreground"
                            )}>
                              {daysUntil === 0 ? (
                                <span className="flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Today
                                </span>
                              ) : daysUntil === 1 ? (
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Tomorrow
                                </span>
                              ) : (
                                <span>
                                  In {daysUntil} days
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                            {event.description}
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <ScrollArea className="h-[480px] pr-4">
            {Object.keys(eventsByMonth).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No upcoming events found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(eventsByMonth).map(([month, events]) => (
                  <div key={month} className="space-y-2">
                    <h3 className="font-medium text-sm sticky top-0 bg-background pt-2 pb-1">
                      {month}
                    </h3>
                    
                    <div className="space-y-2 pl-2">
                      {events.map((event) => {
                        const daysUntil = getDaysDifference(event.date);
                        
                        return (
                          <Link 
                            key={event.id}
                            href={`/calendar/events/${event.id}`}
                            className="block border rounded-md p-2 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className={cn("text-xs gap-1", getEventTypeColorClass(event.type))}
                                  >
                                    {getEventTypeIcon(event.type)}
                                    {event.type}
                                  </Badge>
                                  
                                  {event.framework && (
                                    <Badge variant="secondary" className="text-xs">
                                      {event.framework}
                                    </Badge>
                                  )}
                                  
                                  {event.priority === 'high' && (
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                                      High Priority
                                    </Badge>
                                  )}
                                  
                                  {event.priority === 'critical' && (
                                    <Badge className="bg-red-100 text-red-800 text-xs">
                                      Critical
                                    </Badge>
                                  )}
                                </div>
                                
                                {event.description && (
                                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              
                              <div className={cn(
                                "text-xs font-medium whitespace-nowrap",
                                daysUntil === 0 ? "text-red-600" :
                                daysUntil <= 7 ? "text-amber-600" : 
                                "text-muted-foreground"
                              )}>
                                {daysUntil === 0 ? (
                                  <span className="flex items-center">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Today
                                  </span>
                                ) : daysUntil === 1 ? (
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Tomorrow
                                  </span>
                                ) : (
                                  <span>
                                    In {daysUntil} days
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {event.owner && (
                              <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
                                Owner: {event.owner}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date("2025-03-05T11:54:14Z"), "MMM d, yyyy HH:mm:ss")}
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1" asChild>
          <Link href="/calendar/export">
            Export Calendar
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
