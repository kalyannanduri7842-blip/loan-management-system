import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  BadgeIndianRupee,
  CalendarDays,
  ReceiptText,
  FolderLock,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Landmark,
  ChevronRight
} from 'lucide-react';

export function CustomerLayout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Apply for Loan', path: '/apply-loan', icon: FilePlus2, highlight: true },
    { name: 'My Applications', path: '/my-applications', icon: FileText },
    { name: 'My Loans', path: '/my-loans', icon: BadgeIndianRupee },
    { name: 'EMI Schedule', path: '/emi-schedule', icon: CalendarDays },
    { name: 'Payments', path: '/payments', icon: ReceiptText },
    { name: 'Documents', path: '/documents', icon: FolderLock },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-slate-700 hover:text-black cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-slate-900 flex items-center justify-center text-white">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider uppercase text-slate-900 block leading-tight">
                Loan Management
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">Customer Workspace</span>
            </div>
          </Link>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center space-x-4">
          <Link
            to="/notifications"
            className="p-2 text-slate-700 hover:text-slate-900 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-900 block">{user?.fullName}</span>
              <span className="text-[10px] text-slate-500 font-mono block truncate max-w-[150px]">{user?.email}</span>
            </div>
            <div className="w-8 h-8 bg-slate-900 text-white font-bold text-xs flex items-center justify-center uppercase">
              {user?.fullName?.charAt(0) || 'C'}
            </div>
          </div>
        </div>
      </header>

      {/* Workspace Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform lg:transform-none lg:static transition-transform duration-200 flex flex-col justify-between ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Navigation Links */}
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Customer Services
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : item.highlight
                        ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
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

          {/* Bottom Profile & Sign Out */}
          <div className="p-4 border-t border-slate-200 space-y-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 font-mono block">CIBIL Credit Score</span>
              <strong className="text-sm font-mono text-emerald-800 font-bold">{user?.creditScore || 780} / 900</strong>
              <span className="text-[10px] text-slate-500 block">Pre-approved eligible</span>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
