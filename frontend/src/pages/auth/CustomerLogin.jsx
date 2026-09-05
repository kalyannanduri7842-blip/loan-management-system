import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Landmark, User, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export function CustomerLogin() {
  const [email, setEmail] = useState('customer@demo.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password, 'CUSTOMER');
      addToast('Customer Sign In Successful', `Welcome back, ${res.user?.fullName}!`, 'success');
      navigate('/customer/dashboard');
    } catch (err) {
      addToast('Login Failed', err.message || 'Invalid email address or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail || 'customer@demo.com');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-white">
            <Landmark className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-base tracking-wider uppercase text-slate-900">
            Loan Management System
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-mono">
          Customer & Borrower Gateway
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-300 p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Customer Sign In</span>
              </h2>
              <p className="text-[11px] text-slate-500">Apply for loans, track status & view EMI schedule</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-200">
              CUSTOMER
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="customer@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-9 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Account Password</label>
                <Link to="/forgot-password" className="text-slate-500 hover:text-slate-900 text-[11px] underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-9 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-500 border-emerald-600"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Customer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* DEMO CREDENTIAL QUICK FILL */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Demo Customer Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => handleQuickFill('customer@demo.com')}
                className="p-1.5 border border-slate-200 hover:border-emerald-500 text-left bg-slate-50"
              >
                <span className="font-bold block text-slate-800">Rahul Kumar</span>
                <span className="text-slate-500">customer@demo.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('anita.sharma@demo.com')}
                className="p-1.5 border border-slate-200 hover:border-emerald-500 text-left bg-slate-50"
              >
                <span className="font-bold block text-slate-800">Anita Sharma</span>
                <span className="text-slate-500">anita.sharma@demo.com</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 text-center text-[11px] text-slate-600">
            Don't have a customer account?{' '}
            <Link to="/customer/register" className="font-bold text-slate-900 hover:underline">
              Register New Account
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Portal Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
