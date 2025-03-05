/**
 * Incident Dashboard
 * Current date: 2025-03-05 14:55:53
 * Current user: alschell
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
} from '@mui/material';
import {
  WarningAmber,
  Security,
  CheckCircle,
  Schedule,
  Error,
  Add
} from '@mui/icons-material';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { format, parseISO, subDays } from 'date-fns';

import { AppDispatch, RootState } from '../../store';
import {
  fetchIncidentStats,
  fetchIncidentCategories,
  selectIncidentStats,
  selectIncidentLoading
} from '../../store/slices/incidentSlice';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import DataCard from '../../components/common/DataCard';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';
import { CHART_COLORS } from '../../config';

const IncidentDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const stats = useSelector(selectIncidentStats);
  const loading = useSelector(selectIncidentLoading);
  
  useEffect(() => {
    // Set page title
    dispatch(setPageTitle('Incident Management'));
    
    // Fetch incident stats and categories
    dispatch(fetchIncidentStats());
    dispatch(fetchIncidentCategories());
  }, [dispatch]);
  
  // Handle create new incident
  const handleCreateIncident = () => {
    navigate('/incidents/new');
  };
  
  // Format data for status distribution chart
  const statusChartData = {
    labels: ['Open', 'Investigating', 'Mitigated', 'Resolved', 'Closed'],
    datasets: [
      {
        data: stats ? [
          stats.open || 0,
          stats.investigating || 0,
          stats.mitigated || 0,
          stats.resolved || 0,
          stats.closed || 0
        ] : [0, 0, 0, 0, 0],
        backgroundColor: [
          CHART_COLORS.error,
          CHART_COLORS.warning,
          CHART_COLORS.info,
          CHART_COLORS.success,
          CHART_COLORS.grey
        ]
      }
    ]
  };
  
  // Format data for severity distribution chart
  const severityChartData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: stats?.bySeverity ? [
          stats.bySeverity.Critical || 0,
          stats.bySeverity.High || 0,
          stats.bySeverity.Medium || 0,
          stats.bySeverity.Low || 0
        ] : [0, 0, 0, 0],
        backgroundColor: [
          CHART_COLORS.error,
          CHART_COLORS.warning,
          CHART_COLORS.info,
          CHART_COLORS.success
        ]
      }
    ]
  };
  
  // Format data for recent trends chart
  const getTrendChartData = () => {
    // Generate dates for last 14 days
    const dates = Array.from({ length: 14 }).map((_, i) => {
      const date = subDays(new Date(), 13 - i);
      return format(date, 'yyyy-MM-dd');
    });
    
    // Map incident counts to dates
    const counts = dates.map(date => {
      if (!stats?.recentTrend) return 0;
      const found = stats.recentTrend.find(item => item._id === date);
      return found ? found.count : 0;
    });
    
    return {
      labels: dates.map(date => format(parseISO(date), 'MMM dd')),
      datasets: [
        {
          label: 'New Incidents',
          data: counts,
          borderColor: CHART_COLORS.primary,
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }
      ]
    };
  };
  
  // Summary cards
  const summaryCards = stats ? [
    {
      title: 'Total Incidents',
      value: stats.total.toString(),
      icon: <WarningAmber />,
      color: 'primary'
    },
    {
      title: 'Open',
      value: stats.open.toString(),
      icon: <Error />,
      color: 'error'
    },
    {
      title: 'Investigating',
      value: stats.investigating.toString(),
      icon: <Security />,
      color: 'warning'
    },
    {
      title: 'Resolved',
      value: stats.resolved.toString(),
      icon: <CheckCircle />,
      color: 'success'
    },
    {
      title: 'SLA at Risk',
      value: stats.sla.atRisk.toString(),
      icon: <Schedule />,
      color: stats.sla.atRisk > 0 ? 'warning' : 'info'
    }
  ] : [];
  
  if (loading && !stats) {
    return (
      <MainLayout title="Incident Management">
        <LoadingSpinner message="Loading incident statistics..." />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Incident Management">
      <PageHeader
        title="Incident Management"
        subtitle="Monitor and respond to security incidents"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreateIncident}
          >
            New Incident
          </Button>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Incidents' }
        ]}
      />
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={15/5} key={card.title}>
            <DataCard
              title={card.title}
              content={
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                    {card.value}
                  </Typography>
                </Box>
              }
              icon={card.icon}
              color={card.color}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3}>
        {/* Incident Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Incident Trend (Last 14 Days)" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Line
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                  data={getTrendChartData()}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* SLA Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="SLA Status" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <Typography variant="h3" color="error.main">
                      {stats?.sla.missed || 0}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      SLA Missed
                    </Typography>
                  </div>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <Typography variant="h3" color="warning.main">
                      {stats?.sla.atRisk || 0}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      At Risk (Next 24h)
                    </Typography>
                  </div>
                </Box>
                
                <Box sx={{ pt: 2 }}>
                  <Typography variant="body2" textAlign="center">
                    Average resolution time: {stats?.avgResolutionTimeHours.toFixed(1) || 0} hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Incidents by Status" />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '80%', maxWidth: 400 }}>
                  <Doughnut
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      },
                      cutout: '60%'
                    }}
                    data={statusChartData}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Severity Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Incidents by Severity" />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                  data={severityChartData}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Category Distribution */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Recent Incidents" 
              action={
                <Button color="primary" onClick={() => navigate('/incidents/list')}>
                  View All
                </Button>
              }
            />
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 800, p: 2 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
                    gap: 2,
                    py: 1,
                    px: 2,
                    fontWeight: 'bold'
                  }}
                >
                  <Typography variant="subtitle2">ID</Typography>
                  <Typography variant="subtitle2">Title</Typography>
                  <Typography variant="subtitle2">Status</Typography>
                  <Typography variant="subtitle2">Severity</Typography>
                  <Typography variant="subtitle2">Created</Typography>
                </Box>
                
                <Divider />
                
                {/* Recent incidents - mock data until we have API */}
                {[
                  {
                    id: 'INC-2025-005',
                    title: 'Suspicious Login Attempts',
                    status: 'Open',
                    severity: 'High',
                    created: '2025-03-04'
                  },
                  {
                    id: 'INC-2025-004',
                    title: 'Potential Data Breach',
                    status: 'Open',
                    severity: 'Critical',
                    created: '2025-03-03'
                  },
                  {
                    id: 'INC-2025-003',
                    title: 'Data Center Temperature Alert',
                    status: 'Investigating',
                    severity: 'Medium',
                    created: '2025-03-01'
                  },
                  {
                    id: 'INC-2025-002',
                    title: 'Phishing Attempt',
                    status: 'Closed',
                    severity: 'Medium',
                    created: '2025-02-28'
                  },
                  {
                    id: 'INC-2025-001',
                    title: 'Website Outage',
                    status: 'Resolved',
                    severity: 'High',
                    created: '2025-02-25'
                  }
                ].map((incident) => (
                  <Box key={incident.id}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
                        gap: 2,
                        py: 2,
                        px: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                    >
                      <Typography variant="body2">{incident.id}</Typography>
                      <Typography variant="body2">{incident.title}</Typography>
                      <Box>
                        <StatusChip status={incident.status} />
                      </Box>
                      <Box>
                        <StatusChip status={incident.severity} />
                      </Box>
                      <Typography variant="body2">
                        {format(new Date(incident.created), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        
