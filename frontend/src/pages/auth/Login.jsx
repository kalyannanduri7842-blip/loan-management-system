import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Landmark, User, Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Login() {
 const [searchParams] = useSearchParams();
 const [selectedRole, setSelectedRole] = useState(
 searchParams.get('role') === 'admin' ? 'ADMIN' : 'CUSTOMER'
 );

 const [email, setEmail] = useState('customer@loan.com');
 const [password, setPassword] = useState('customer123');
 const [loading, setLoading] = useState(false);

 const { login } = useAuth();
 const { addToast } = useToast();
 const navigate = useNavigate();

 useEffect(() => {
 if (selectedRole === 'ADMIN') {
 setEmail('admin@loan.com');
 setPassword('admin123');
 } else {
 setEmail('customer@loan.com');
 setPassword('customer123');
 }
 }, [selectedRole]);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);

 try {
 const res = await login(email, password);
 addToast(
 'Authentication Successful',
 `Welcome, ${res.user?.fullName}! Logged in as ${res.user?.role}.`,
 'success'
 );

 if (res.user?.role === 'ADMIN') {
 navigate('/admin/dashboard');
 } else {
 navigate('/dashboard');
 }
 } catch (err) {
 addToast('Login Failed', err.message || 'Invalid email address or password', 'error');
 } finally {
 setLoading(false);
 }
 };

 const handleQuickFill = (role, em, pw) => {
 setSelectedRole(role);
 setEmail(em);
 setPassword(pw);
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
 Unified Access Portal • Exactly 2 Roles: Customer & Admin
 </p>
 </div>

 <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
 <div className="bg-white border border-slate-300 p-8 space-y-6 shadow-sm">
 {/* Role Switcher Tabs */}
 <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-4">
 <button
 type="button"
 onClick={() => setSelectedRole('CUSTOMER')}
 className={`py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
 selectedRole === 'CUSTOMER'
 ? 'bg-slate-900 text-white border-slate-900'
 : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
 }`}
 >
 <User className="w-3.5 h-3.5" />
 <span>Customer Login</span>
 </button>

 <button
 type="button"
 onClick={() => setSelectedRole('ADMIN')}
 className={`py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
 selectedRole === 'ADMIN'
 ? 'bg-slate-900 text-white border-slate-900'
 : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
 }`}
 >
 <Shield className="w-3.5 h-3.5" />
 <span>Admin Underwriter</span>
 </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4 text-xs">
 <div>
 <label className="block font-semibold text-slate-700 mb-1">
 {selectedRole === 'ADMIN' ? 'Admin Email Address' : 'Customer Email Address'}
 </label>
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
 className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
 >
 <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole === 'ADMIN' ? 'Admin' : 'Customer'} →`}</span>
 </button>
 </form>

 {/* Quick Demo Test Credentials Helper */}
 <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
 <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
 1-Click Demo Credentials:
 </span>
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => handleQuickFill('CUSTOMER', 'customer@loan.com', 'customer123')}
 className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left cursor-pointer"
 >
 <strong className="block text-slate-900 font-bold"> Customer</strong>
 <span className="text-[10px] text-slate-500 font-mono block truncate">customer@loan.com</span>
 <span className="text-[10px] text-slate-400 font-mono">customer123</span>
 </button>

 <button
 type="button"
 onClick={() => handleQuickFill('ADMIN', 'admin@loan.com', 'admin123')}
 className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left cursor-pointer"
 >
 <strong className="block text-slate-900 font-bold">️ Admin</strong>
 <span className="text-[10px] text-slate-500 font-mono block truncate">admin@loan.com</span>
 <span className="text-[10px] text-slate-400 font-mono">admin123</span>
 </button>
 </div>
 </div>

 <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
 Don't have a customer account?{' '}
 <Link to="/register" className="font-bold text-slate-900 underline">
 Register New Customer
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
