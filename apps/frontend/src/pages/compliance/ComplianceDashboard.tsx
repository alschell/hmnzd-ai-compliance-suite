/**
 * Compliance Dashboard
 * Current date: 2025-03-06 06:17:08
 * Current user: alschell
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Divider,
  LinearProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add,
  TrendingUp,
  TrendingDown,
  Assessment,
  Assignment,
  CheckCircle,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Doughnut, Radar } from 'react-chartjs-2';

import { AppDispatch } from '../../store';
import { setPageTitle } from '../../store/slices/uiSlice';
import MainLayout from '../../components/layout/MainLayout';
import DataCard from '../../components/common/DataCard';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusChip from '../../components/common/StatusChip';
import { CHART_COLORS } from '../../config';

// Mock data for the dashboard
const mockComplianceData = {
  overallScore: 78,
  changeFromLastMonth: 5,
  frameworks: [
    { 
      id: 'ISO27001', 
      name: 'ISO 27001', 
      score: 82, 
      change: 4,
      totalControls: 114,
      implementedControls: 93,
      nonCompliantControls: 12,
      notApplicableControls: 9,
      lastAssessment: '2025-02-15',
    },
    { 
      id: 'SOC2', 
      name: 'SOC 2', 
      score: 75, 
      change: 7,
      totalControls: 64,
      implementedControls: 48,
      nonCompliantControls: 16,
      notApplicableControls: 0,
      lastAssessment: '2025-02-10',
    },
    { 
      id: 'GDPR', 
      name: 'GDPR', 
      score: 85, 
      change: 3,
      totalControls: 42,
      implementedControls: 36,
      nonCompliantControls: 6,
      notApplicableControls: 0,
      lastAssessment: '2025-01-28',
    },
    { 
      id: 'HIPAA', 
      name: 'HIPAA', 
      score: 72, 
      change: 6,
      totalControls: 48,
      implementedControls: 35,
      nonCompliantControls: 13,
      notApplicableControls: 0,
      lastAssessment: '2025-02-20',
    },
    { 
      id: 'PCIDSS', 
      name: 'PCI DSS', 
      score: 68, 
      change: 8,
      totalControls: 78,
      implementedControls: 53,
      nonCompliantControls: 25,
      notApplicableControls: 0,
      lastAssessment: '2025-01-15',
    }
  ],
  domains: [
    { name: 'Access Control', score: 82 },
    { name: 'Risk Management', score: 75 },
    { name: 'Security Operations', score: 81 },
    { name: 'Data Protection', score: 70 },
    { name: 'Governance', score: 85 },
    { name: 'Physical Security', score: 90 },
    { name: 'Incident Response', score: 65 }
  ],
  upcomingAssessments: [
    { 
      id: 'ASS-2025-001',
      frameworkId: 'PCIDSS',
      frameworkName: 'PCI DSS', 
      dueDate: '2025-03-15',
      owner: 'Sarah Johnson',
      status: 'Scheduled'
    },
    { 
      id: 'ASS-2025-002',
      frameworkId: 'HIPAA',
      frameworkName: 'HIPAA', 
      dueDate: '2025-04-01',
      owner: 'Robert Chen',
      status: 'Planned'
    },
    { 
      id: 'ASS-2025-003',
      frameworkId: 'ISO27001',
      frameworkName: 'ISO 27001', 
      dueDate: '2025-04-15',
      owner: 'Michael Wilson',
      status: 'Planned'
    }
  ],
  recentFindings: [
    {
      id: 'FIN-2025-024',
      title: 'Password Policy Non-Compliance',
      framework: 'ISO 27001',
      control: 'A.9.4.3',
      severity: 'High',
      status: 'Open',
      dateIdentified: '2025-02-28'
    },
    {
      id: 'FIN-2025-023',
      title: 'Incomplete Data Backup Verification',
      framework: 'SOC 2',
      control: 'A1.3.3',
      severity: 'Medium',
      status: 'Open',
      dateIdentified: '2025-02-25'
    },
    {
      id: 'FIN-2025-022',
      title: 'Missing Server Hardening Documentation',
      framework: 'PCI DSS',
      control: '2.2',
      severity: 'Medium',
      status: 'In Progress',
      dateIdentified: '2025-02-20'
    },
    {
      id: 'FIN-2025-021',
      title: 'Vendor Access Review Deficiency',
      framework: 'GDPR',
      control: 'Art. 28',
      severity: 'High',
      status: 'In Progress',
      dateIdentified: '2025-02-18'
    },
    {
      id: 'FIN-2025-020',
      title: 'Insufficient Access Logs Retention',
      framework: 'HIPAA',
      control: '164.312(b)',
      severity: 'Medium',
      status: 'Resolved',
      dateIdentified: '2025-02-15'
    }
  ]
};

const ComplianceDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [complianceData, setComplianceData] = useState(mockComplianceData);
  
  useEffect(() => {
    dispatch(setPageTitle('Compliance Dashboard'));
    
    // Simulate API call to load data
    const timer = setTimeout(() => {
      setComplianceData(mockComplianceData);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);
  
  const handleAddFramework = () => {
    navigate('/compliance/frameworks/new');
  };
  
  const handleViewFramework = (frameworkId: string) => {
    navigate(`/compliance/frameworks/${frameworkId}`);
  };
  
  const handleViewAllFrameworks = () => {
    navigate('/compliance/frameworks');
  };
  
  const handleViewFinding = (findingId: string) => {
    navigate(`/compliance/findings/${findingId}`);
  };
  
  const handleViewAllFindings = () => {
    navigate('/compliance/findings');
  };
  
  const handleStartAssessment = (assessmentId: string) => {
    navigate(`/compliance/assessments/${assessmentId}`);
  };
  
  const handleViewAllAssessments = () => {
    navigate('/compliance/assessments');
  };
  
  // Format data for domain strength radar chart
  const domainStrengthData = {
    labels: complianceData.domains.map(domain => domain.name),
    datasets: [
      {
        label: 'Domain Compliance Score',
        data: complianceData.domains.map(domain => domain.score),
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderColor: CHART_COLORS.primary,
        pointBackgroundColor: CHART_COLORS.primary,
        borderWidth: 2,
      }
    ]
  };
  
  // Format data for framework distribution chart
  const frameworkDistributionData = {
    labels: complianceData.frameworks.map(framework => framework.name),
    datasets: [
      {
        data: complianceData.frameworks.map(framework => framework.score),
        backgroundColor: [
          CHART_COLORS.primary,
          CHART_COLORS.secondary,
          CHART_COLORS.success,
          CHART_COLORS.error,
          CHART_COLORS.warning,
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      }
    ]
  };
  
  if (loading) {
    return (
      <MainLayout title="Compliance Dashboard">
        <LoadingSpinner message="Loading compliance data..." />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Compliance Dashboard">
      <PageHeader
        title="Compliance Dashboard"
        subtitle="Monitor and manage your compliance program performance"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddFramework}
          >
            Add Framework
          </Button>
        }
        breadcrumbs={[
          { label: 'Dashboard', link: '/dashboard' },
          { label: 'Compliance' }
        ]}
      />
      
      {/* Overall compliance score */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Overall Compliance Score
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    color: complianceData.overallScore >= 80 ? 'success.main' : 
                           complianceData.overallScore >= 60 ? 'warning.main' : 
                           'error.main',
                    fontWeight: 500
                  }}
                >
                  {complianceData.overallScore}%
                </Typography>
                {complianceData.changeFromLastMonth !== 0 && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: complianceData.changeFromLastMonth > 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    {complianceData.changeFromLastMonth > 0 ? 
                      <TrendingUp fontSize="small" /> : 
                      <TrendingDown fontSize="small" />
                    }
                    <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
                      {complianceData.changeFromLastMonth > 0 ? '+' : ''}
                      {complianceData.changeFromLastMonth}% from last month
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Framework Performance
              </Typography>
              {complianceData.frameworks.map((framework) => (
                <Box key={framework.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{framework.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">{framework.score}%</Typography>
                      <Box 
                        component="span" 
                        sx={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: framework.change > 0 ? 'success.main' : 'error.main',
                          typography: 'caption',
                          ml: 1
                        }}
                      >
                        {framework.change > 0 ? <TrendingUp fontSize="inherit" /> : <TrendingDown fontSize="inherit" />}
                        {framework.change > 0 ? '+' : ''}{framework.change}%
                      </Box>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={framework.score} 
                    color={
                      framework.score >= 80 ? "success" : 
                      framework.score >= 60 ? "warning" : 
                      "error"
                    }
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Card>
      
      {/* Framework summary cards */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Frameworks Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {complianceData.frameworks.map((framework) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={framework.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => handleViewFramework(framework.id)}
            >
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {framework.name}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Compliance Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography 
                      variant="h4" 
                      component="div" 
                      sx={{ 
                        color: framework.score >= 80 ? 'success.main' : 
                               framework.score >= 60 ? 'warning.main' : 
                               'error.main'
                      }}
                    >
                      {framework.score}%
                    </Typography>
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: framework.change > 0 ? 'success.main' : 'error.main',
                        typography: 'body2',
                        ml: 1
                      }}
                    >
                      {framework.change > 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                      {framework.change > 0 ? '+' : ''}{framework.change}%
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Controls:</Typography>
                  <Typography variant="body2">{framework.implementedControls}/{framework.totalControls}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Last assessed:</Typography>
                  <Typography variant="body2">{new Date(framework.lastAssessment).toLocaleDateString()}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button 
          variant="outlined"
          color="primary"
          onClick={handleViewAllFrameworks}
          endIcon={<Assessment />}
        >
          View All Frameworks
        </Button>
      </Box>
      
      {/* Charts and data tables */}
      <Grid container spacing={3}>
        {/* Domain strength radar */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Domain Strength Analysis" />
            <CardContent>
              <Box sx={{ height: 350 }}>
                <Radar 
                  options={{
                    scales: {
                      r: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                  data={domainStrengthData} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Framework distribution chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Framework Compliance Distribution" />
            <CardContent>
              <Box sx={{ height: 350, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ height: '100%', width: '80%', maxWidth: 400 }}>
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
                    data={frameworkDistributionData} 
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Findings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Recent Findings" 
              action={
                <Button color="primary" size="small" onClick={handleViewAllFindings}>
                  View All
                </Button>
              }
            />
            <Divider />
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complianceData.recentFindings.map((finding) => (
                    <TableRow 
                      key={finding.id} 
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleViewFinding(finding.id)}
                    >
                      <TableCell>{finding.id}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                            {finding.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {finding.framework} | Control {finding.control}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={finding.severity} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={finding.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        
        {/* Upcoming Assessments */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title="Upcoming Assessments" 
              action={
                <Button color="primary" size="small" onClick={handleViewAllAssessments}>
                  View All
                </Button>
              }
            />
            <Divider />
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Framework</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complianceData.upcomingAssessments.map((assessment) => (
                    <TableRow key={assessment.id} hover>
                      <TableCell>{assessment.id}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {assessment.frameworkName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Owner: {assessment.owner}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(assessment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleStartAssessment(assessment.id)}
                        >
                          Start
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default ComplianceDashboard;
