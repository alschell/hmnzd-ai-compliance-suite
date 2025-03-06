/**
 * Main Dashboard
 * Current date: 2025-03-06 10:44:07
 * Current user: alschell
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AssignmentTurnedIn,
  AssignmentLate,
  Event,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  ArrowForward,
  TrendingUp,
  Assignment,
  Policy,
  BarChart,
  Security,
  KeyboardArrowRight,
} from '@mui/icons-material';

import { AppDispatch } from '../../store';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { CHART_COLORS } from '../../theme';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// Mock data for dashboard
const mockData = {
  compliance: {
    overallScore: 78,
    frameworks: [
      { name: 'SOC 2', score: 85 },
      { name: 'GDPR', score: 72 },
      { name: 'ISO 27001', score: 81 },
      { name: 'HIPAA', score: 76 },
    ],
    findings: {
      total: 42,
      byStatus: {
        open: 12,
        inProgress: 15,
        resolved: 10,
        closed: 5
      },
      bySeverity: {
        critical: 3,
        high: 9,
        medium: 18,
        low: 12
      }
    }
  },
  assessments: {
    completed: 8,
    inProgress: 3,
    upcoming: 2,
    upcoming_list: [
      { id: 'ass-001', name: 'Annual SOC 2 Assessment', dueDate: '2025-03-15' },
      { id: 'ass-002', name: 'Q1 Security Controls Review', dueDate: '2025-03-30' }
    ]
  },
  policies: {
    total: 28,
    needingReview: 4,
    recentlyUpdated: 6
  },
  tasks: {
    upcoming: [
      { id: 'task-001', title: 'Review firewall configurations', dueDate: '2025-03-10', priority: 'High' },
      { id: 'task-002', title: 'Update data processing agreement', dueDate: '2025-03-12', priority: 'Medium' },
      { id: 'task-003', title: 'Implement MFA for admin accounts', dueDate: '2025-03-15', priority: 'High' },
      { id: 'task-004', title: 'Review vendor security assessments', dueDate: '2025-03-18', priority: 'Medium' },
    ]
  },
  activities: [
    { id: 'act-001', user: 'David Thompson', action: 'resolved finding', target: 'FIN-2025-038', time: '2 hours ago' },
    { id: 'act-002', user: 'Sarah Johnson', action: 'commented on', target: 'Annual Risk Assessment', time: '4 hours ago' },
    { id: 'act-003', user: 'Emma Rodriguez', action: 'updated policy', target: 'Data Retention Policy', time: '1 day ago' },
    { id: 'act-004', user: 'Robert Chen', action: 'completed task', target: 'Security Training', time: '1 day ago' },
    { id: 'act-005', user: 'Michael Wilson', action: 'created finding', target: 'FIN-2025-042', time: '2 days ago' },
  ],
  riskMetrics: {
    highRisks: 6,
    mediumRisks: 14,
    lowRisks: 9,
    acceptedRisks: 5,
    mitigatedRisks: 18,
    trendData: [8, 9, 12, 14, 10, 6]
  }
};

// Circular progress with label component
function CircularProgressWithLabel(props: { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

// Component
const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // State for chart data
  const [loadingCharts, setLoadingCharts] = useState(true);
  
  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
    
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoadingCharts(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Chart data
  const findingsStatusChart = {
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [
      {
        label: 'Findings by Status',
        data: [
          mockData.compliance.findings.byStatus.open,
          mockData.compliance.findings.byStatus.inProgress,
          mockData.compliance.findings.byStatus.resolved,
          mockData.compliance.findings.byStatus.closed,
        ],
        backgroundColor: [
          CHART_COLORS.error,
          CHART_COLORS.warning,
          CHART_COLORS.success,
          CHART_COLORS.grey,
        ],
      },
    ],
  };

  const findingsSeverityChart = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Findings by Severity',
        data: [
          mockData.compliance.findings.bySeverity.critical,
          mockData.compliance.findings.bySeverity.high,
          mockData.compliance.findings.bySeverity.medium,
          mockData.compliance.findings.bySeverity.low,
        ],
        backgroundColor: [
          '#d32f2f', // darker red for critical
          CHART_COLORS.error,
          CHART_COLORS.warning,
          CHART_COLORS.info,
        ],
      },
    ],
  };

  const frameworkComplianceChart = {
    labels: mockData.compliance.frameworks.map(f => f.name),
    datasets: [
      {
        label: 'Compliance Score (%)',
        data: mockData.compliance.frameworks.map(f => f.score),
        backgroundColor: CHART_COLORS.primary,
      },
    ],
  };

  const complianceTrendChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Compliance Score',
        data: [65, 68, 72, 75, 76, 78],
        borderColor: CHART_COLORS.primary,
        backgroundColor: 'rgba(63, 81, 181, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const riskTrendChart = {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'High Risk Items',
        data: mockData.riskMetrics.trendData,
        borderColor: CHART_COLORS.error,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <MainLayout title="Dashboard">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome back, Alex. Here's your compliance overview for March 6, 2025.
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="contained"
            startIcon={<Security />}
            onClick={() => navigate('/compliance/assessments/new')}
          >
            Start New Assessment
          </Button>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Overall Compliance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1, mb: 1 }}>
                  <Typography variant="h4" sx={{ mr: 1 }}>
                    {mockData.compliance.overallScore}%
                  </Typography>
                  <TrendingUp color="success" fontSize="small" />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={mockData.compliance.overallScore} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color={mockData.compliance.overallScore > 80 ? 'success' : 
                        mockData.compliance.overallScore > 60 ? 'primary' : 'warning'}
                />
              </Box>
              <AssignmentTurnedIn sx={{ fontSize: 48, color: 'primary.main', opacity: 0.6 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Open Findings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="h4">
                    {mockData.compliance.findings.byStatus.open + mockData.compliance.findings.byStatus.inProgress}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    / {mockData.compliance.findings.total}
                  </Typography>
                </Box>
                <Typography variant="body2" color="error">
                  {mockData.compliance.findings.bySeverity.critical + mockData.compliance.findings.bySeverity.high} high priority
                </Typography>
              </Box>
              <AssignmentLate sx={{ fontSize: 48, color: 'error.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Assessments
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="h4">
                    {mockData.assessments.upcoming}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    upcoming
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {mockData.assessments.completed} completed this quarter
                </Typography>
              </Box>
              <Event sx={{ fontSize: 48, color: 'warning.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Policies
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="h4">
                    {mockData.policies.needingReview}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    need review
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {mockData.policies.total} total policies
                </Typography>
              </Box>
              <Policy sx={{ fontSize: 48, color: 'info.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Compliance Trends Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Compliance Trends</Typography>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/compliance')}
                >
                  View Details
                </Button>
              </Box>
              <Box height={300} display="flex" alignItems="center" justifyContent="center">
                {loadingCharts ? (
                  <CircularProgressWithLabel value={75} />
                ) : (
                  <Line 
                    data={complianceTrendChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          align: 'end',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          min: 50,
                          max: 100,
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Framework Scores */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Framework Status</Typography>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/compliance/frameworks')}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ mb: 2 }}>
                {mockData.compliance.frameworks.map((framework, index) => (
                  <Box key={framework.name} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{framework.name}</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {framework.score}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={framework.score} 
                      sx={{ height: 8, borderRadius: 4 }}
                      color={framework.score > 80 ? 'success' : 
                            framework.score > 60 ? 'primary' : 'warning'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Findings Charts */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Findings by Status
              </Typography>
              <Box height={220} display="flex" alignItems="center" justifyContent="center">
                {loadingCharts ? (
                  <CircularProgressWithLabel value={35} />
                ) : (
                  <Pie 
                    data={findingsStatusChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Findings by Severity
              </Typography>
              <Box height={220} display="flex" alignItems="center" justifyContent="center">
                {loadingCharts ? (
                  <CircularProgressWithLabel value={65} />
                ) : (
                  <Pie 
                    data={findingsSeverityChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Risk Trend Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Risk Trends</Typography>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/compliance')}
                >
                  View Details
                </Button>
              </Box>
              <Box height={220} display="flex" alignItems="center" justifyContent="center">
                {loadingCharts ? (
                  <CircularProgressWithLabel value={45} />
                ) : (
                  <Line 
                    data={riskTrendChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Tasks */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Upcoming Tasks</Typography>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/tasks')}
                >
                  View All
                </Button>
              </Box>
              <List disablePadding>
                {mockData.tasks.upcoming.map((task) => (
                  <ListItem 
                    key={task.id} 
                    divider 
                    dense
                    sx={{ px: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {task.priority === 'High' ? 
                        <ErrorIcon color="error" fontSize="small" /> : 
                        <Warning color="warning" fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Assessments */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Upcoming Assessments</Typography>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/compliance/assessments')}
                >
                  View All
                </Button>
              </Box>
              {mockData.assessments.upcoming_list.length > 0 ? (
                <List disablePadding>
                  {mockData.assessments.upcoming_list.map((assessment) => (
                    <ListItem 
                      key={assessment.id} 
                      divider
                      dense
                      sx={{ px: 0 }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Assignment color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={assessment.name}
                        secondary={`Due: ${new Date(assessment.dueDate).toLocaleDateString()}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Button
                        variant="text"
                        size="small"
                        endIcon={<KeyboardArrowRight />}
                        onClick={() => navigate(`/compliance/assessments/${assessment.id}`)}
                      >
                        Start
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    No upcoming assessments scheduled.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Recent Activity</Typography>
              </Box>
              <List disablePadding>
                {mockData.activities.map((activity) => (
                  <ListItem 
                    key={activity.id} 
                    divider 
                    dense
                    sx={{ px: 0 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <Typography component="span" fontWeight="medium" variant="body2">
                            {activity.user}
                          </Typography> {activity.action} {' '}
                          <Typography component="span" color="primary" variant="body2">
                            {activity.target}
                          </Typography>
                        </Typography>
                      }
                      secondary={activity.time}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Risk Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Risk Overview</Typography>
                <Button 
                  variant="text" 
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/risk')}
                >
                  View Risk Register
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="error.main">
                      {mockData.riskMetrics.highRisks}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      High Risks
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="warning.main">
                      {mockData.riskMetrics.mediumRisks}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Medium Risks
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="info.main">
                      {mockData.riskMetrics.lowRisks}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Low Risks
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">
                      {mockData.riskMetrics.acceptedRisks}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Accepted
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                      {mockData.riskMetrics.mitigatedRisks}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Mitigated Risks
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard;
