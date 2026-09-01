import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Landmark, Shield, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('admin@loan.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.user?.role !== 'ADMIN') {
        addToast('Access Denied', 'This portal is restricted to authorized Admin Underwriters only.', 'error');
        navigate('/dashboard');
      } else {
        addToast('Admin Authentication Successful', `Welcome, Chief Underwriting Officer!`, 'success');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      addToast('Login Failed', err.message || 'Invalid admin credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@loan.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-wider uppercase text-white">
            Loan Management System
          </span>
        </Link>
        <p className="text-xs text-slate-400 font-mono">
          Chief Credit Officer & Underwriting Executive Gateway
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-700 p-8 space-y-6 shadow-2xl">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Admin Operations Access</span>
              </h2>
              <p className="text-[11px] text-slate-500">Underwriting queue, loan sanctioning, and disbursement control</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5">
              RESTRICTED
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Executive Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@loan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-9 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Administrative Security Key</label>
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
              className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 bg-slate-900 hover:bg-slate-800"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>{loading ? 'Verifying Administrative Credentials...' : 'Authenticate Admin Session →'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                Admin Demo Credentials:
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[10px] font-mono text-slate-900 underline font-bold cursor-pointer hover:text-emerald-700"
              >
                Auto-Fill
              </button>
            </div>

            <div
              onClick={handleQuickFill}
              className="p-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-center">
                <strong className="text-slate-900 font-bold">🛡️ Chief Credit Underwriter</strong>
                <span className="text-[10px] bg-slate-900 text-emerald-400 px-1.5 py-0.5 font-bold font-mono">FULL ACCESS</span>
              </div>
              <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                Email: <strong>admin@loan.com</strong> • Password: <strong>admin123</strong>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            Are you a loan applicant?{' '}
            <Link to="/customer-login" className="font-bold text-slate-900 underline">
              Switch to Customer Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
