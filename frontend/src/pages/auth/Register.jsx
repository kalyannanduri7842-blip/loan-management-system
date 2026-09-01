import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Landmark, User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

export function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    monthlyIncome: 75000,
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      addToast('Registration Successful', 'Welcome to Loan Management System! You can now apply for loans.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Registration Error', err.message || 'Could not create account', 'error');
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
        <p className="text-xs text-slate-500 font-mono">
          Customer Account Onboarding & Registration
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-300 p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Create New Customer Account
            </h2>
            <p className="text-[11px] text-slate-500">Apply for retail loans, track applications, and manage EMIs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Kumar"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly In-Hand Income (₹) *</label>
              <input
                type="number"
                required
                min={10000}
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) || 0 })}
                className="input-field font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Residential Address</label>
              <input
                type="text"
                placeholder="e.g. Flat 302, Green Glen Heights, Bengaluru"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Register Customer Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-slate-900 underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
