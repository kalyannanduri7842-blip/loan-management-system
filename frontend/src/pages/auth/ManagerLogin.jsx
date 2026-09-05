import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Landmark, Briefcase, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export function ManagerLogin() {
  const [email, setEmail] = useState('manager@demo.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password, 'MANAGER');
      addToast('Manager Sign In Successful', `Welcome, ${res.user?.fullName}!`, 'success');
      navigate('/manager/dashboard');
    } catch (err) {
      addToast('Login Failed', err.message || 'Invalid manager credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail || 'manager@demo.com');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 flex items-center justify-center text-white">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-wider uppercase text-white">
            Loan Management System
          </span>
        </Link>
        <p className="text-xs text-purple-400 font-mono">
          Credit Sanctions & Approvals Management Gateway
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-700 p-8 space-y-6 shadow-md">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Manager Sign In</span>
              </h2>
              <p className="text-[11px] text-slate-500">Review recommendations, sanction loans & disburse funds</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-800 px-2 py-0.5 border border-purple-200">
              MANAGER
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Manager Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="manager@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-9 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Security Password</label>
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
              className="btn-primary w-full py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-500 border-purple-600 text-white font-bold"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Sign In as Manager'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* DEMO QUICK FILL */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Demo Manager Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => handleQuickFill('manager@demo.com')}
                className="p-1.5 border border-slate-200 hover:border-purple-500 text-left bg-slate-50"
              >
                <span className="font-bold block text-slate-800">Priya Sharma</span>
                <span className="text-slate-500">manager@demo.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('priya.manager@demo.com')}
                className="p-1.5 border border-slate-200 hover:border-purple-500 text-left bg-slate-50"
              >
                <span className="font-bold block text-slate-800">Siddharth Sen</span>
                <span className="text-slate-500">priya.manager@demo.com</span>
              </button>
            </div>
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
