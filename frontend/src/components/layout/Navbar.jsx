import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Landmark, User, Shield, LogOut, ArrowRight, FilePlus2 } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-white">
            <Landmark className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-wider uppercase text-slate-900">
            Loan Management System
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <a href="#loan-types" className="hover:text-slate-900 transition-colors">Loan Types</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#calculator" className="hover:text-slate-900 transition-colors">Calculate EMI</a>
          <Link to="/all-in-one" className="text-emerald-700 hover:text-emerald-800 transition-colors">1-Page Console</Link>
        </nav>

        {/* Separate Login Buttons */}
        <div className="flex items-center space-x-2.5 text-xs font-mono">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
              >
                <span>{user?.role === 'ADMIN' ? '🛡️ Admin Console' : '👤 My Dashboard'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/customer-login"
                className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 font-bold text-slate-900"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Customer Login</span>
              </Link>

              <Link
                to="/admin-login"
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1 font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
