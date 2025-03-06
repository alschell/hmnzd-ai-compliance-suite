/**
 * Application Routes Configuration
 * Current date: 2025-03-06 10:24:59
 * Current user: alschell
 */

import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated } from './store/slices/authSlice';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthLayout from './components/layout/AuthLayout';
import NotFound from './pages/NotFound';

// Lazy-loaded components for better performance
// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Main application pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const UserProfile = lazy(() => import('./pages/user/Profile'));

// Compliance pages
const ComplianceDashboard = lazy(() => import('./pages/compliance/Dashboard'));
const FrameworkList = lazy(() => import('./pages/compliance/FrameworkList'));
const FrameworkDetail = lazy(() => import('./pages/compliance/FrameworkDetail'));
const CreateFramework = lazy(() => import('./pages/compliance/CreateFramework'));
const FindingsList = lazy(() => import('./pages/compliance/FindingsList'));
const FindingDetail = lazy(() => import('./pages/compliance/FindingDetail'));
const CreateFinding = lazy(() => import('./pages/compliance/CreateFinding'));
const AssessmentsList = lazy(() => import('./pages/compliance/AssessmentsList'));
const AssessmentDetail = lazy(() => import('./pages/compliance/AssessmentDetail'));
const CreateAssessment = lazy(() => import('./pages/compliance/CreateAssessment'));

// Policy pages
const PolicyList = lazy(() => import('./pages/policy/PolicyList'));
const PolicyDetail = lazy(() => import('./pages/policy/PolicyDetail'));
const CreatePolicy = lazy(() => import('./pages/policy/CreatePolicy'));
const PolicyCategories = lazy(() => import('./pages/policy/CategoryList'));

// Organization pages
const OrganizationDashboard = lazy(() => import('./pages/organization/Dashboard'));
const OrganizationSettings = lazy(() => import('./pages/organization/Settings'));

// User management
const UsersList = lazy(() => import('./pages/user/UsersList'));
const UserDetail = lazy(() => import('./pages/user/UserDetail'));
const CreateUser = lazy(() => import('./pages/user/CreateUser'));

// Settings
const Settings = lazy(() => import('./pages/settings/Settings'));

// Protected route guard component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        {/* Compliance routes */}
        <Route path="/compliance" element={
          <ProtectedRoute>
            <ComplianceDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/frameworks" element={
          <ProtectedRoute>
            <FrameworkList />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/frameworks/new" element={
          <ProtectedRoute>
            <CreateFramework />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/frameworks/:id" element={
          <ProtectedRoute>
            <FrameworkDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/frameworks/:id/edit" element={
          <ProtectedRoute>
            <CreateFramework />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/findings" element={
          <ProtectedRoute>
            <FindingsList />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/findings/new" element={
          <ProtectedRoute>
            <CreateFinding />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/findings/:id" element={
          <ProtectedRoute>
            <FindingDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/findings/:id/edit" element={
          <ProtectedRoute>
            <CreateFinding />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/assessments" element={
          <ProtectedRoute>
            <AssessmentsList />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/assessments/new" element={
          <ProtectedRoute>
            <CreateAssessment />
          </ProtectedRoute>
        } />
        
        <Route path="/compliance/assessments/:id" element={
          <ProtectedRoute>
            <AssessmentDetail />
          </ProtectedRoute>
        } />
        
        {/* Policy routes */}
        <Route path="/policies" element={
          <ProtectedRoute>
            <PolicyList />
          </ProtectedRoute>
        } />
        
        <Route path="/policies/new" element={
          <ProtectedRoute>
            <CreatePolicy />
          </ProtectedRoute>
        } />
        
        <Route path="/policies/:id" element={
          <ProtectedRoute>
            <PolicyDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/policies/:id/edit" element={
          <ProtectedRoute>
            <CreatePolicy />
          </ProtectedRoute>
        } />
        
        <Route path="/policies/categories" element={
          <ProtectedRoute>
            <PolicyCategories />
          </ProtectedRoute>
        } />
        
        {/* Organization routes */}
        <Route path="/organization" element={
          <ProtectedRoute>
            <OrganizationDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/organization/settings" element={
          <ProtectedRoute>
            <OrganizationSettings />
          </ProtectedRoute>
        } />
        
        {/* User management routes */}
        <Route path="/users" element={
          <ProtectedRoute>
            <UsersList />
          </ProtectedRoute>
        } />
        
        <Route path="/users/new" element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        } />
        
        <Route path="/users/:id" element={
          <ProtectedRoute>
            <UserDetail />
          </ProtectedRoute>
        } />
        
        {/* Settings */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Not found page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
