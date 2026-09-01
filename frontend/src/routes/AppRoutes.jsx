import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Unified All-In-One Master Page (All Dashboards, Forms, Portals & Notifications in 1 View)
import { MasterSinglePage } from '../pages/MasterSinglePage';

// Public & Layouts
import { Home } from '../pages/Home';
import { CustomerLogin } from '../pages/auth/CustomerLogin';
import { AdminLogin } from '../pages/auth/AdminLogin';
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
  if (!isAuthenticated) return <Navigate to="/customer-login" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin-login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. PRIMARY ALL-IN-ONE MASTER PAGE WITH ALL DASHBOARDS MERGED */}
      <Route path="/" element={<MasterSinglePage />} />
      <Route path="/all-in-one" element={<MasterSinglePage />} />
      <Route path="/console" element={<MasterSinglePage />} />

      {/* 2. DEDICATED AUTHENTICATION SCREENS */}
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/customer-register" element={<Register />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/landing" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* 3. INDEPENDENT CUSTOMER PORTAL */}
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

      {/* 4. INDEPENDENT ADMIN PORTAL */}
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
