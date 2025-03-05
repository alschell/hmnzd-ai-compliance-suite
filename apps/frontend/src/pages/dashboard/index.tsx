import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ComplianceScoreCard } from '@/components/dashboard/compliance-score-card';
import { RiskAssessmentSummary } from '@/components/dashboard/risk-assessment-summary';
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines';
import { ComplianceTasks } from '@/components/dashboard/compliance-tasks';
import { RegulatoryUpdates } from '@/components/dashboard/regulatory-updates';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { AiInsights } from '@/components/dashboard/ai-insights';
import { ActivityLog } from '@/components/dashboard/activity-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ChevronDown, Download, Plus, RefreshCw, Search } from 'lucide-react';
import Head from 'next/head';
import { useUser } from '@/hooks/use-user';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

export default function Dashboard() {
  const { user } = useUser();
  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle dashboard data refresh
  const refreshDashboard = () => {
    setIsRefreshing(true);
    // In a real implementation, this would trigger refetching of all dashboard data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <Head>
        <title>Dashboard | ComplianceGuard</title>
      </Head>

      <DashboardLayout>
        {/* Dashboard header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {getGreeting()}, {user?.name}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your compliance status
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshDashboard}
              disabled={isRefreshing}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add New
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span>New Assessment</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>New Task</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>New Document</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>New Policy</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Key metrics row */}
        <div className="grid gap-4 grid-cols-12 mb-4">
          <div className="col-span-12 md:col-span-4">
            <ComplianceScoreCard />
          </div>
          <div className="col-span-12 md:col-span-4">
            <RiskAssessmentSummary />
          </div>
          <div className="col-span-12 md:col-span-4">
            <UpcomingDeadlines />
          </div>
        </div>

        {/* Main dashboard content */}
        <div className="grid gap-4 grid-cols-12">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* Compliance Tasks */}
            <ComplianceTasks />
            
            {/* Activity log */}
            <ActivityLog />
          </div>
          
          {/* Right column */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Recent alerts */}
            <RecentAlerts />
            
            {/* Regulatory updates */}
            <RegulatoryUpdates />
            
            {/* AI Insights */}
            <AiInsights />
            
            {/* Quick actions */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common compliance tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-1">
                  <Search className="h-5 w-5" />
                  <span className="text-xs">Run Gap Analysis</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-1">
                  <Download className="h-5 w-5" />
                  <span className="text-xs">Export Reports</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-1">
                  <ArrowUpRight className="h-5 w-5" />
                  <span className="text-xs">View Compliance Status</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-1">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Add Control</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
