/**
 * Main Dashboard Page
 * Current date: 2025-03-05 14:49:46
 * Current user: alschell
 */

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Box, 
  Grid, 
  Typography, 
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Warning,
  AssessmentOutlined,
  BusinessOutlined,
  SecurityOutlined,
  DescriptionOutlined
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { format } from 'date-fns';

import { setPageTitle } from '../store/slices/uiSlice';
import MainLayout from '../components/layout/MainLayout';
import DataCard from '../components/common/DataCard';
import StatusChip from '../components/common/StatusChip';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CHART_COLORS } from '../config';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [complianceScore, setComplianceScore] = useState(78);
  const [loading, setLoading] = useState(true);
  
  // Update page title
  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
    
    // Simulate API call to fetch dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);
  
  // Mock data for charts
  const complianceData = {
    labels: ['ISO 27001', 'SOC 2', 'GDPR', 'HIPAA', 'PCI DSS'],
    datasets: [
      {
        label: 'Compliance Score (%)',
        data: [85, 72, 90, 65, 78],
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1
      }
    ]
  };
  
  const incidentTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Incidents',
        data: [5, 8, 3, 10, 6, 4],
        borderColor: CHART_COLORS.error,
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Resolved',
        data: [3, 7, 2, 8, 5, 3],
        borderColor: CHART_COLORS.success,
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
  
  const riskScoreData = {
    labels: [
      'Security',
      'Privacy',
      'Data Protection',
      'Physical Security',
      'Business Continuity',
      'Access Control'
    ],
    datasets: [
      {
        label: 'Current Score',
        data: [80, 65, 72, 85, 60, 75],
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderColor: CHART_COLORS.primary,
        pointBackgroundColor: CHART_COLORS.primary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: CHART_COLORS.primary
      },
      {
        label: 'Previous Month',
        data: [75, 60, 65, 80, 55, 70],
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        borderColor: CHART_COLORS.secondary,
        pointBackgroundColor: CHART_COLORS.secondary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: CHART_COLORS.secondary
      }
    ]
  };
  
  const vendorDistributionData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [15, 25, 40, 20],
        backgroundColor: [
          CHART_COLORS.error,
          CHART_COLORS.warning,
          CHART_COLORS.info,
          CHART_COLORS.success
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };
  
  // Summary cards data
  const summaryCards = [
    {
      title: 'Compliance Score',
      value: `${complianceScore}%`,
      icon: <AssessmentOutlined fontSize="large" />,
      change: '+5%',
      trend: 'up',
      color: complianceScore >= 70 ? 'success' : complianceScore >= 50 ? 'warning' : 'error'
    },
    {
      title: 'Active Frameworks',
      value: '5',
      icon: <SecurityOutlined fontSize="large" />,
      change: '0',
      trend: 'neutral',
      color: 'info'
    },
    {
      title: 'Vendors Monitored',
      value: '32',
      icon: <BusinessOutlined fontSize="large" />,
      change: '+3',
      trend: 'up',
      color: 'primary'
    },
    {
      title: 'Open Incidents',
      value: '7',
      icon: <Warning fontSize="large" />,
      change: '-2',
      trend: 'down',
      color: 'warning'
    },
    {
      title: 'Policy Documents',
      value: '24',
      icon: <DescriptionOutlined fontSize="large" />,
      change: '+4',
      trend: 'up',
      color: 'secondary'
    }
  ];
  
  // Incidents that require attention
  const incidents = [
    {
      id: 'INC-2025-004',
      title: 'Potential Data Breach',
      severity: 'Critical',
      status: 'Open',
      created: '2025-03-03'
    },
    {
      id: 'INC-2025-003',
      title: 'Data Center Temperature Alert',
      severity: 'Medium',
      status: 'Investigating',
      created: '2025-03-01'
    },
    {
      id: 'INC-2025-005',
      title: 'Suspicious Login Attempts',
      severity: 'High',
      status: 'Open',
      created: '2025-03-04'
    }
  ];
  
  // Tasks that require attention
  const tasks = [
    {
      id: 'TSK-2025-012',
      title: 'Annual SOC 2 Audit',
      dueDate: '2025-03-15',
      status: 'Pending'
    },
    {
      id: 'TSK-2025-010',
      title: 'Vendor Risk Assessment - Cloud Provider Inc.',
      dueDate: '2025-03-08',
      status: 'In Progress'
    },
    {
      id: 'TSK-2025-011',
      title: 'Update Data Protection Policy',
      dueDate: '2025-03-12',
      status: 'Pending'
    }
  ];
  
  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <LoadingSpinner message="Loading dashboard data..." />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Dashboard">
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Compliance Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Overview of your organization's compliance posture. 
            Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </Typography>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {summaryCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
              <DataCard
                title={card.title}
                content={
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                      {card.value}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: card.trend === 'up' ? 'success.main' : card.trend === 'down' ? 'error.main' : 'text.secondary'
                      }}
                    >
                      {card.trend === 'up' ? <TrendingUp fontSize="small" /> : 
                       card.trend === 'down' ? <TrendingDown fontSize="small" /> : null}
                      <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
                        {card.change}
                      </Typography>
                    </Box>
                  </Box>
                }
                icon={card.icon}
                color={card.color}
              />
            </Grid>
          ))}
        </Grid>
        
        {/* Main Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Compliance by Framework" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }} 
                    data={complianceData} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Incident Trends" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Line 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }} 
                    data={incidentTrendData} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Secondary Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Risk Assessment Radar" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Radar 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          min: 0,
                          max: 100,
                          beginAtZero: true
                        }
                      }
                    }} 
                    data={riskScoreData} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Vendor Risk Distribution" />
              <CardContent>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: '80%', maxWidth: 300 }}>
                    <Doughnut 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right'
                          }
                        }
                      }} 
                      data={vendorDistributionData} 
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Incidents & Tasks */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Incidents Requiring Attention" 
                action={
                  <Button color="primary" size="small" href="/incidents">
                    View All
                  </Button>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {incidents.map((incident) => (
                  <Box 
                    key={incident.id} 
                    sx={{ 
                      p: 2, 
                      '&:not(:last-child)': { borderBottom: 1, borderColor: 'divider' },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" component="div">
                          {incident.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="textSecondary"
                          component="span"
                          sx={{ ml: 1 }}
                        >
                          ({incident.id})
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                      >
                        Created on {format(new Date(incident.created), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <StatusChip status={incident.status} />
                      <StatusChip status={incident.severity} />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Upcoming Tasks" 
                action={
                  <Button color="primary" size="small" href="/tasks">
                    View All
                  </Button>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {tasks.map((task) => (
                  <Box 
                    key={task.id} 
                    sx={{ 
                      p: 2, 
                      '&:not(:last-child)': { borderBottom: 1, borderColor: 'divider' },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" component="div">
                          {task.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="textSecondary"
                          component="span"
                          sx={{ ml: 1 }}
                        >
                          ({task.id})
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                      >
                        Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <StatusChip status={task.status} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
