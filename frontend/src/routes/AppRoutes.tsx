import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@pages/Auth/Login';
import Register from '@pages/Auth/Register';
import VerifyEmail from '@pages/Auth/VerifyEmail';
import ForgotPassword from '@pages/Auth/ForgotPassword';
import ResetPassword from '@pages/Auth/ResetPassword';
import Dashboard from '@pages/Dashboard/Dashboard';
import ProfileEdit from '@pages/CVEditor/ProfileEdit';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '@components/layout/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profiles/:id/edit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfileEdit />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
