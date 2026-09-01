import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public & Layouts
import { Home } from '../pages/Home';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { ApplyLoan } from '../pages/customer/ApplyLoan';
import { MyApplications } from '../pages/customer/MyApplications';
import { MyLoans } from '../pages/customer/MyLoans';
import { EmiSchedule } from '../pages/customer/EmiSchedule';
import { CustomerPayments } from '../pages/customer/CustomerPayments';
import { CustomerNotifications } from '../pages/customer/CustomerNotifications';
import { CustomerProfile } from '../pages/customer/CustomerProfile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminApplications } from '../pages/admin/AdminApplications';
import { ApplicationReview } from '../pages/admin/ApplicationReview';
import { AdminDisbursements } from '../pages/admin/AdminDisbursements';
import { AdminLoans } from '../pages/admin/AdminLoans';
import { AdminEmiManagement } from '../pages/admin/AdminEmiManagement';
import { AdminCustomers } from '../pages/admin/AdminCustomers';
import { AdminNotifications } from '../pages/admin/AdminNotifications';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminSettings } from '../pages/admin/AdminSettings';

function ProtectedCustomerRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login?role=admin" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Customer Workspace Routes */}
      <Route
        element={
          <ProtectedCustomerRoute>
            <CustomerLayout />
          </ProtectedCustomerRoute>
        }
      >
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/apply-loan" element={<ApplyLoan />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/my-loans" element={<MyLoans />} />
        <Route path="/emi-schedule" element={<EmiSchedule />} />
        <Route path="/payments" element={<CustomerPayments />} />
        <Route path="/documents" element={<MyApplications />} />
        <Route path="/notifications" element={<CustomerNotifications />} />
        <Route path="/profile" element={<CustomerProfile />} />
      </Route>

      {/* Admin Operations Console Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="applications/:id" element={<ApplicationReview />} />
        <Route path="disbursements" element={<AdminDisbursements />} />
        <Route path="loans" element={<AdminLoans />} />
        <Route path="emi-management" element={<AdminEmiManagement />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
