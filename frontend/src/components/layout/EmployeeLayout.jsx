import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

export function EmployeeLayout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const employeeNav = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'Pending Applications', path: '/employee/applications', icon: FileCheck2 },
    { name: 'New Applications', path: '/employee/applications?status=SUBMITTED', icon: Clock },
    { name: 'Under Review', path: '/employee/applications?status=EMPLOYEE_REVIEW', icon: Clock },
    { name: 'Recommended by Me', path: '/employee/applications?status=EMPLOYEE_RECOMMENDED', icon: CheckCircle2 },
    { name: 'Rejected Applications', path: '/employee/applications?status=EMPLOYEE_REJECTED', icon: XCircle },
    { name: 'Processed History', path: '/employee/history', icon: History },
    { name: 'Notifications', path: '/employee/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/employee/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Employee Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/employee/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider uppercase text-white block leading-tight">
                Loan Management System
              </span>
              <span className="text-[10px] text-blue-400 font-mono block">
                Employee Verification & Credit Underwriting Gateway
              </span>
            </div>
          </Link>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center space-x-4">
          <Link
            to="/employee/notifications"
            className="p-2 text-slate-300 hover:text-white relative transition-colors"
            title="Employee Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-white block">{user?.fullName}</span>
              <span className="text-[10px] text-blue-400 font-mono block">{user?.employeeId || 'Verification Officer'}</span>
            </div>
            <div className="w-8 h-8 bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase">
              EMP
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Employee Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform lg:transform-none lg:static transition-transform duration-200 flex flex-col justify-between ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Navigation Links */}
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Verification Workspace
            </div>
            {employeeNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="bg-rose-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Sign Out */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Employee</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
          />
        )}

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
