import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Landmark, Shield, User, Lock, Mail, ArrowRight } from 'lucide-react';

export function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'ADMIN' : 'CUSTOMER';
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedRole === 'ADMIN') {
      setEmail('admin@loan.com');
      setPassword('admin123');
    } else {
      setEmail('rahul@gmail.com');
      setPassword('customer123');
    }
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      addToast('Authentication Successful', `Welcome back, ${res.user?.fullName}!`, 'success');

      if (res.user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        const redirect = searchParams.get('redirect');
        if (redirect === 'apply') {
          const type = searchParams.get('type') || 'Personal Loan';
          navigate(`/apply-loan?type=${encodeURIComponent(type)}`);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      addToast('Login Failed', err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (role, demoEmail, demoPass) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-white">
            <Landmark className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-wider uppercase text-slate-900">
            Loan Management System
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-mono">
          Secure Multi-Role Financial Authentication
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-300 p-8 space-y-6 shadow-sm">
          {/* Role Toggle Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedRole('CUSTOMER')}
              className={`py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Login</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('ADMIN')}
              className={`py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {selectedRole === 'ADMIN' ? 'Administrator Email Address' : 'Customer Registered Email'}
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-9 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-semibold text-slate-700">Account Password</label>
                <Link to="/forgot-password" className="text-[11px] text-slate-500 hover:text-slate-900 underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick 1-Click Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              1-Click Demo Testing Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => handleFillDemo('CUSTOMER', 'rahul@gmail.com', 'customer123')}
                className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left cursor-pointer"
              >
                <strong className="text-slate-900 block font-bold">Rahul Kumar</strong>
                <span className="text-slate-500 text-[10px] block">Customer (780 CIBIL)</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('ADMIN', 'admin@loan.com', 'admin123')}
                className="p-2 border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 text-left cursor-pointer"
              >
                <strong className="text-emerald-400 block font-bold">Credit Officer</strong>
                <span className="text-slate-300 text-[10px] block">Admin Authority</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          {selectedRole === 'CUSTOMER' && (
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-slate-900 underline">
                Register as New Customer
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
