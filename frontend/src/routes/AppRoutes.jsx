import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public & Portal Selection
import { Home } from '../pages/Home';
import { CustomerLogin } from '../pages/auth/CustomerLogin';
import { EmployeeLogin } from '../pages/auth/EmployeeLogin';
import { ManagerLogin } from '../pages/auth/ManagerLogin';
import { AdminLogin } from '../pages/auth/AdminLogin';
import { MasterLogin } from '../pages/auth/MasterLogin';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Layouts
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { EmployeeLayout } from '../components/layout/EmployeeLayout';
import { ManagerLayout } from '../components/layout/ManagerLayout';
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

// Employee Pages
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { EmployeeApplications } from '../pages/employee/EmployeeApplications';
import { EmployeeHistory } from '../pages/employee/EmployeeHistory';
import { EmployeeNotifications } from '../pages/employee/EmployeeNotifications';
import { EmployeeProfile } from '../pages/employee/EmployeeProfile';

// Manager Pages
import { ManagerDashboard } from '../pages/manager/ManagerDashboard';
import { ManagerApplications } from '../pages/manager/ManagerApplications';
import { ManagerDisbursements } from '../pages/manager/ManagerDisbursements';
import { ManagerNotifications } from '../pages/manager/ManagerNotifications';
import { ManagerProfile } from '../pages/manager/ManagerProfile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminApplications } from '../pages/admin/AdminApplications';
import { AdminCustomers } from '../pages/admin/AdminCustomers';
import { AdminEmployees } from '../pages/admin/AdminEmployees';
import { AdminManagers } from '../pages/admin/AdminManagers';
import { AdminDisbursements } from '../pages/admin/AdminDisbursements';
import { AdminLoans } from '../pages/admin/AdminLoans';
import { AdminEmiManagement } from '../pages/admin/AdminEmiManagement';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminAuditLogs } from '../pages/admin/AdminAuditLogs';
import { AdminSettings } from '../pages/admin/AdminSettings';
import { AdminNotifications } from '../pages/admin/AdminNotifications';
import { AdminProfile } from '../pages/admin/AdminProfile';

// Role-Based Route Guards
function ProtectedCustomerRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login/customer" replace />;
  if (user?.role !== 'CUSTOMER') {
    if (user?.role === 'EMPLOYEE') return <Navigate to="/employee/dashboard" replace />;
    if (user?.role === 'MANAGER') return <Navigate to="/manager/dashboard" replace />;
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function ProtectedEmployeeRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login/employee" replace />;
  if (user?.role !== 'EMPLOYEE') {
    if (user?.role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
    if (user?.role === 'MANAGER') return <Navigate to="/manager/dashboard" replace />;
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function ProtectedManagerRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login/manager" replace />;
  if (user?.role !== 'MANAGER') {
    if (user?.role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
    if (user?.role === 'EMPLOYEE') return <Navigate to="/employee/dashboard" replace />;
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login/admin" replace />;
  if (user?.role !== 'ADMIN') {
    if (user?.role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
    if (user?.role === 'EMPLOYEE') return <Navigate to="/employee/dashboard" replace />;
    if (user?.role === 'MANAGER') return <Navigate to="/manager/dashboard" replace />;
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. PUBLIC HOMEPAGE & PORTAL SELECTOR */}
      <Route path="/" element={<Home />} />
      <Route path="/portals" element={<MasterLogin />} />

      {/* 2. DEDICATED 4-ROLE AUTHENTICATION SCREENS */}
      <Route path="/login/customer" element={<CustomerLogin />} />
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/login" element={<CustomerLogin />} />

      <Route path="/login/employee" element={<EmployeeLogin />} />
      <Route path="/employee-login" element={<EmployeeLogin />} />
      <Route path="/employee/login" element={<EmployeeLogin />} />

      <Route path="/login/manager" element={<ManagerLogin />} />
      <Route path="/manager-login" element={<ManagerLogin />} />
      <Route path="/manager/login" element={<ManagerLogin />} />

      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/register" element={<Register />} />
      <Route path="/customer-register" element={<Register />} />
      <Route path="/customer/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 3. CUSTOMER PORTAL ROUTES */}
      <Route
        path="/customer"
        element={
          <ProtectedCustomerRoute>
            <CustomerLayout />
          </ProtectedCustomerRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="apply" element={<ApplyLoan />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="loans" element={<MyLoans />} />
        <Route path="emi-schedule" element={<EmiSchedule />} />
        <Route path="payments" element={<CustomerPayments />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* Direct Customer Aliases */}
      <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="/apply-loan" element={<Navigate to="/customer/apply" replace />} />
      <Route path="/my-applications" element={<Navigate to="/customer/applications" replace />} />
      <Route path="/my-loans" element={<Navigate to="/customer/loans" replace />} />
      <Route path="/emi-schedule" element={<Navigate to="/customer/emi-schedule" replace />} />
      <Route path="/payments" element={<Navigate to="/customer/payments" replace />} />
      <Route path="/notifications" element={<Navigate to="/customer/notifications" replace />} />
      <Route path="/profile" element={<Navigate to="/customer/profile" replace />} />

      {/* 4. EMPLOYEE PORTAL ROUTES */}
      <Route
        path="/employee"
        element={
          <ProtectedEmployeeRoute>
            <EmployeeLayout />
          </ProtectedEmployeeRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="applications" element={<EmployeeApplications />} />
        <Route path="history" element={<EmployeeHistory />} />
        <Route path="notifications" element={<EmployeeNotifications />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>

      {/* 5. MANAGER PORTAL ROUTES */}
      <Route
        path="/manager"
        element={
          <ProtectedManagerRoute>
            <ManagerLayout />
          </ProtectedManagerRoute>
        }
      >
        <Route index element={<Navigate to="/manager/dashboard" replace />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="applications" element={<ManagerApplications />} />
        <Route path="disbursements" element={<ManagerDisbursements />} />
        <Route path="notifications" element={<ManagerNotifications />} />
        <Route path="profile" element={<ManagerProfile />} />
      </Route>

      {/* 6. ADMIN CONSOLE ROUTES */}
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
        <Route path="applications" element={<AdminApplications />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="managers" element={<AdminManagers />} />
        <Route path="disbursements" element={<AdminDisbursements />} />
        <Route path="loans" element={<AdminLoans />} />
        <Route path="emi-management" element={<AdminEmiManagement />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
