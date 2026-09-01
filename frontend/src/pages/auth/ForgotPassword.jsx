import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Landmark, Mail, ArrowLeft, ArrowRight } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.forgotPassword(email);
      setMessage(res.message);
      addToast('Reset Sent', res.message, 'success');
    } catch (err) {
      addToast('Error', err.message || 'Could not send reset instructions', 'error');
    } finally {
      setLoading(false);
    }
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
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-300 p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Reset Account Password
            </h2>
            <p className="text-[11px] text-slate-500">Enter your registered email address to receive recovery details</p>
          </div>

          {message ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <p className="font-semibold">{message}</p>
              <Link to="/login" className="btn-primary py-1.5 px-3 text-xs inline-flex mt-2">
                Return to Login →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-9 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Submitting...' : 'Send Password Reset Link'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-slate-100 text-xs">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
