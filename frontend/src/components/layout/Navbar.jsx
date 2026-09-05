import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Landmark,
  User,
  Shield,
  Briefcase,
  UserCheck,
  LogOut,
  ArrowRight,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'MANAGER': return '/manager/dashboard';
      case 'EMPLOYEE': return '/employee/dashboard';
      case 'CUSTOMER':
      default:
        return '/customer/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition-colors">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase text-slate-900 block leading-tight">
              Loan Management System
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              Secure & Transparent Digital Lending
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <a href="#loan-types" className="hover:text-slate-900 transition-colors">Loan Products</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#calculator" className="hover:text-slate-900 transition-colors">EMI Calculator</a>
        </nav>

        {/* 4 Clearly Visible Login Options */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                to={getDashboardPath()}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800"
              >
                <span>{user?.role} Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login/customer"
                className="py-1.5 px-2.5 text-xs font-bold border border-emerald-600 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 transition-colors"
                title="Customer Portal"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </Link>

              <Link
                to="/login/employee"
                className="py-1.5 px-2.5 text-xs font-bold border border-blue-600 text-blue-700 hover:bg-blue-50 flex items-center gap-1 transition-colors"
                title="Employee Verification Portal"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Employee</span>
              </Link>

              <Link
                to="/login/manager"
                className="py-1.5 px-2.5 text-xs font-bold border border-purple-600 text-purple-700 hover:bg-purple-50 flex items-center gap-1 transition-colors"
                title="Manager Approval Portal"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Manager</span>
              </Link>

              <Link
                to="/login/admin"
                className="py-1.5 px-2.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1 transition-colors"
                title="Administrator Console"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <Link
              to="/login/customer"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 border border-emerald-600 text-emerald-700 font-bold flex items-center gap-2 justify-center"
            >
              <User className="w-4 h-4" /> Customer Login
            </Link>
            <Link
              to="/login/employee"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 border border-blue-600 text-blue-700 font-bold flex items-center gap-2 justify-center"
            >
              <UserCheck className="w-4 h-4" /> Employee Login
            </Link>
            <Link
              to="/login/manager"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 border border-purple-600 text-purple-700 font-bold flex items-center gap-2 justify-center"
            >
              <Briefcase className="w-4 h-4" /> Manager Login
            </Link>
            <Link
              to="/login/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-900 text-white font-bold flex items-center gap-2 justify-center"
            >
              <Shield className="w-4 h-4 text-emerald-400" /> Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
