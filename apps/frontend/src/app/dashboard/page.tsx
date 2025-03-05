Current Date and Time: 2025-03-05 04:04:15 UTC
Current User's Login: alschell

## File 11: apps/frontend/src/app/dashboard/page.tsx

```tsx
import { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ComplianceScoreCard } from '@/components/dashboard/compliance-score-card';
import { RegulatoryUpdates } from '@/components/dashboard/regulatory-updates';
import { ComplianceTasks } from '@/components/dashboard/compliance-tasks';
import { RiskAssessmentSummary } from '@/components/dashboard/risk-assessment-summary';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { AiInsights } from '@/components/dashboard/ai-insights';
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines';
import { ComplianceTrendChart } from '@/components/dashboard/compliance-trend-chart';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'HMNZD AI Compliance Suite Dashboard',
};

export default async function DashboardPage() {
  // In a real implementation, this data would come from API calls
  // For now, we'll mock the data but structure it as if it came from real APIs
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Compliance Dashboard"
        text="Your enterprise compliance overview and key metrics"
      />
      
      {/* Top row: Cards with important metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ComplianceScoreCard />
        <RiskAssessmentSummary />
        <UpcomingDeadlines />
      </div>

      {/* Middle section: Detailed content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <ComplianceTrendChart />
        </div>
        <div className="col-span-1">
          <AiInsights />
        </div>
      </div>

      {/* Bottom section: Lists and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ComplianceTasks />
        </div>
        <div className="lg:col-span-1">
          <RegulatoryUpdates />
        </div>
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-6">
            <RecentAlerts />
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
```
