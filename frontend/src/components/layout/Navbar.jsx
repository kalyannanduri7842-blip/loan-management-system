import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Landmark,
  Bell,
  User,
  Shield,
  Menu,
  X,
  ArrowRight,
  LogOut
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Loan Types', path: '/#loans' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Contact', path: '/#contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 font-mono">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Fast, transparent loan approvals with competitive interest rates starting at 8.5% p.a.</span>
          <div className="hidden sm:flex items-center space-x-4">
            <span>Customer Support: 1800-456-7890</span>
            <span>•</span>
            <Link to="/login?role=admin" className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-white">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider uppercase text-slate-900 block leading-tight">
              Loan Management System
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              Apex Capital & Lending
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="hover:text-black transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                <span>{isAdmin ? 'Admin Console' : 'My Dashboard'}</span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 text-slate-600 hover:text-rose-600"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary py-1.5 px-3 text-xs hidden sm:inline-flex"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-700 hover:text-black"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 text-xs font-semibold uppercase tracking-wider">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-slate-700 hover:text-black"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-center py-2 text-xs"
                >
                  Customer Login
                </Link>
                <Link
                  to="/login?role=admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center py-2 text-xs"
                >
                  Admin Login
                </Link>
              </>
            ) : (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary text-center py-2 text-xs"
              >
                Open Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
