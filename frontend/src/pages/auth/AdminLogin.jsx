import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Landmark, Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password, 'ADMIN');
      addToast('Administrator Sign In Successful', `Welcome, ${res.user?.fullName}!`, 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast('Login Failed', err.message || 'Invalid admin credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@demo.com');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-wider uppercase text-white">
            Loan Management System
          </span>
        </Link>
        <p className="text-xs text-emerald-400 font-mono">
          Chief Risk & Master Administrative Gateway
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-700 p-8 space-y-6 shadow-md">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Admin Sign In</span>
              </h2>
              <p className="text-[11px] text-slate-500">Master governance, auditing, reports & system parameters</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5">
              ADMIN
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@demo.com"
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
                  className="input-field pl-9 font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold"
            >
              <span>{loading ? 'Authorizing Access...' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* DEMO QUICK FILL */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Demo Administrator Account:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full p-2 border border-slate-200 hover:border-emerald-500 text-left bg-slate-50 font-mono text-[10px]"
            >
              <span className="font-bold block text-slate-800">Rajesh Varma (Chief Administrator)</span>
              <span className="text-slate-500">admin@demo.com / Password: 123456</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Portal Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
