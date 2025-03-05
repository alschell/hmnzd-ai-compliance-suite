import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRiskAssessment } from "@/hooks/use-risk-assessment";
import { useComplianceScore } from "@/hooks/use-compliance-score";
import { useComplianceTasks } from "@/hooks/use-compliance-tasks";
import { ArrowDownIcon, ArrowUpIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DashboardMetrics() {
  const { data: riskData, isLoading: riskLoading } = useRiskAssessment();
  const { data: complianceData, isLoading: complianceLoading } = useComplianceScore();
  const { data: tasksData, isLoading: tasksLoading } = useComplianceTasks();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Compliance Score Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
          <CardDescription>Overall compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          {complianceLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <>
              <div className="flex items-center justify-between space-x-2">
                <div className="text-2xl font-bold">{complianceData?.overallScore || 0}%</div>
                <div className={`flex items-center text-xs ${
                  (complianceData?.changePercentage || 0) >= 0 
                    ? "text-green-500" 
                    : "text-red-500"
                }`}>
                  {(complianceData?.changePercentage || 0) >= 0 ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(complianceData?.changePercentage || 0)}%
                </div>
              </div>
              <Progress 
                value={complianceData?.overallScore || 0} 
                className="mt-2 h-1.5" 
                indicatorClassName={
                  complianceData?.overallScore && complianceData.overallScore >= 80 
                    ? "bg-green-500" 
                    : complianceData?.overallScore && complianceData.overallScore >= 50 
                    ? "bg-amber-500" 
                    : "bg-red-500"
                }
              />
              <div className="mt-1 text-xs text-muted-foreground">
                Last updated: {formatDate(complianceData?.lastUpdated)}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Risk Level Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
          <CardDescription>Current risk level</CardDescription>
        </CardHeader>
        <CardContent>
          {riskLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className={`rounded-full p-1 ${
                  riskData?.overallRiskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                  riskData?.overallRiskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                  riskData?.overallRiskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  <AlertTriangleIcon className="h-4 w-4" />
                </div>
                <div className="text-2xl font-bold">{riskData?.overallRiskLevel || "Unknown"}</div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-medium">Total Risks</span>
                <span className="text-xs font-medium">{riskData?.totalRisks || 0}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-red-500 font-medium">Urgent Attention</span>
                <span className="text-xs text-red-500 font-medium">{riskData?.urgentRisks || 0}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Assessed: {formatDate(riskData?.lastAssessmentDate)}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tasks Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Compliance Tasks</CardTitle>
          <CardDescription>Tasks and activities</CardDescription>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">{tasksData?.totalCount || 0}</div>
              <div className="mt-2 grid grid-cols-2 gap-1">
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Completed</span>
                  <div className="flex items-center mt-1 text-green-500">
                    <CheckCircleIcon className="mr-1 h-3 w-3" />
                    <span className="text-xs font-medium">{tasksData?.completedTasks || 0}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Overdue</span>
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertTriangleIcon className="mr-1 h-3 w-3" />
                    <span className="text-xs font-medium">{tasksData?.overdueTasks || 0}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Next due: {tasksData?.tasks?.filter(t => !t.completed)?.[0]?.dueDate 
                  ? formatDate(tasksData.tasks.filter(t => !t.completed)[0].dueDate) 
                  : "None"}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Frameworks Compliance Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Frameworks</CardTitle>
          <CardDescription>Active compliance frameworks</CardDescription>
        </CardHeader>
        <CardContent>
          {complianceLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <>
              <div className="text-2xl font-bold">{complianceData?.frameworks?.length || 0}</div>
              <div className="mt-2">
                {complianceData?.frameworks?.slice(0, 2).map((framework, index) => (
                  <div key={index} className="mt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">{framework.framework}</span>
                      <span className="text-xs font-medium">{framework.score}%</span>
                    </div>
                    <Progress 
                      value={framework.score} 
                      className="mt-1 h-1" 
                      indicatorClassName={
                        framework.score >= 80 ? "bg-green-500" : 
                        framework.score >= 50 ? "bg-amber-500" : "bg-red-500"
                      }
                    />
                  </div>
                ))}
                {(complianceData?.frameworks?.length || 0) > 2 && (
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    +{(complianceData?.frameworks?.length || 0) - 2} more frameworks
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
