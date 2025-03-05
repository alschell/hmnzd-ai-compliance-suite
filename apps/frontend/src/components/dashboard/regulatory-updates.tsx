import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight, BookOpen, FileText, GlobeIcon, HelpCircle, Newspaper } from 'lucide-react';
import { useState } from 'react';
import { useRegulatoryUpdates } from '@/hooks/use-regulatory-updates';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function RegulatoryUpdates() {
  const { data, isLoading, error } = useRegulatoryUpdates();
  const [visibleUpdates, setVisibleUpdates] = useState(4);
  
  // Function to get jurisdiction badge with appropriate styling
  const getJurisdictionBadge = (jurisdiction: string) => {
    const lowerJurisdiction = jurisdiction.toLowerCase();
    
    if (lowerJurisdiction === 'global') {
      return <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-500">Global</Badge>;
    } else if (lowerJurisdiction === 'eu') {
      return <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-500">EU</Badge>;
    } else if (lowerJurisdiction === 'us') {
      return <Badge variant="outline" className="border-red-500/50 bg-red-500/10 text-red-500">US</Badge>;
    } else if (lowerJurisdiction === 'uk') {
      return <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-500">UK</Badge>;
    } else if (lowerJurisdiction === 'ca') {
      return <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-500">CA</Badge>;
    }
    
    return <Badge variant="outline">{jurisdiction}</Badge>;
  };
  
  // Function to get icon based on update type
  const getUpdateIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'news':
        return <Newspaper className="h-5 w-5 text-blue-500" />;
      case 'regulation':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'guidance':
        return <BookOpen className="h-5 w-5 text-emerald-500" />;
      default:
        return <GlobeIcon className="h-5 w-5 text-sky-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Regulatory Updates
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="advanced-tooltip">
                  <p>Latest regulatory changes, guidance, and enforcement actions relevant to your compliance program.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Latest regulatory changes</CardDescription>
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
          <CardTitle className="text-lg">Regulatory Updates</CardTitle>
          <CardDescription>Latest regulatory changes</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center text-destructive py-12">
            Error loading regulatory updates
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hasMoreUpdates = data.updates?.length > visibleUpdates;

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Regulatory Updates
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="advanced-tooltip">
                <p>Latest regulatory changes, guidance, and enforcement actions relevant to your compliance program.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Latest regulatory changes</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {data.updates?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GlobeIcon className="mx-auto h-10 w-10 mb-2 opacity-50" />
              <p>No recent regulatory updates</p>
            </div>
          ) : (
            data.updates?.slice(0, visibleUpdates).map((update, index) => (
              <div 
                key={index} 
                className="flex gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {getUpdateIcon(update.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-medium line-clamp-1">{update.title}</h4>
                    {getJurisdictionBadge(update.jurisdiction)}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {update.summary}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(update.date), 'MMM d, yyyy')}
                    </span>
                    <Button size="sm" variant="ghost" className="h-6 text-xs">
                      Read more
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {hasMoreUpdates && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs mt-2"
              onClick={() => setVisibleUpdates(prev => prev + 4)}
            >
              Show more updates
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
          <a href="/dashboard/regulatory">
            View All Updates
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
