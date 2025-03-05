/**
 * Main App Component
 * Current date: 2025-03-05 14:25:37
 * Current user: alschell
 */

import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { RootState, AppDispatch } from './store';
import { refreshToken } from './store/slices/authSlice';
import { API_URL } from './config';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected pages
import Dashboard from './pages/Dashboard';
import ComplianceDashboard from './pages/compliance/ComplianceDashboard';
import FrameworksList from './pages/compliance/FrameworksList';
import FrameworkDetail from './pages/compliance/FrameworkDetail';
import PolicyDashboard from './pages/policy/PolicyDashboard';
import PolicyList from './pages/policy/PolicyList';
import PolicyDetail from './pages/policy/PolicyDetail';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorList from './pages/vendor/VendorList';
import VendorDetail from './pages/vendor/VendorDetail';
import IncidentDashboard from './pages/incident/IncidentDashboard';
import IncidentList from './pages/incident/IncidentList';
import IncidentDetail from './pages/incident/IncidentDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserManagement from './pages/admin/UserManagement';

// Other components
import NotFound from './pages/NotFound';

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRoles = [] }: { children: JSX.Element; requiredRoles?: string[] }) => {
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen message="Authenticating..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access if specified
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Set up axios defaults
  useEffect(() => {
    // Set base URL
    axios.defaults.baseURL = API_URL;
    
    // Set auth header if token exists
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    
    // Add response interceptor for 401 errors (token expired)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry && isAuthenticated) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const refreshResult = await dispatch(refreshToken());
            
            if (refreshToken.fulfilled.match(refreshResult)) {
              // Set new token in header and retry request
              const newToken = refreshResult.payload.token;
              axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, proceed with error
            console.error('Token refresh failed', refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token, dispatch, isAuthenticated]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* Protected routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
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
          <FrameworksList />
        </ProtectedRoute>
      } />
      
      <Route path="/compliance/frameworks/:id" element={
        <ProtectedRoute>
          <FrameworkDetail />
        </ProtectedRoute>
      } />
      
      {/* Policy routes */}
      <Route path="/policies" element={
        <ProtectedRoute>
          <PolicyDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/policies/list" element={
        <ProtectedRoute>
          <PolicyList />
        </ProtectedRoute>
      } />
      
      <Route path="/policies/:id" element={
        <ProtectedRoute>
          <PolicyDetail />
        </ProtectedRoute>
      } />
      
      {/* Vendor routes */}
      <Route path="/vendors" element={
        <ProtectedRoute>
          <VendorDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/vendors/list" element={
        <ProtectedRoute>
          <VendorList />
        </ProtectedRoute>
      } />
      
      <Route path="/vendors/:id" element={
        <ProtectedRoute>
          <VendorDetail />
        </ProtectedRoute>
      } />
      
      {/* Incident routes */}
      <Route path="/incidents" element={
        <ProtectedRoute>
          <IncidentDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/incidents/list" element={
        <ProtectedRoute>
          <IncidentList />
        </ProtectedRoute>
      } />
      
      <Route path="/incidents/:id" element={
        <ProtectedRoute>
          <IncidentDetail />
        </ProtectedRoute>
      } />
      
      {/* User profile */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/settings" element={
        <ProtectedRoute requiredRoles={['admin']}>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRoles={['admin']}>
          <UserManagement />
        </ProtectedRoute>
      } />
      
      {/* 404 Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
