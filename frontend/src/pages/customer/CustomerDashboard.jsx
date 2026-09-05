import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  BadgeIndianRupee,
  Clock,
  CheckCircle2,
  FilePlus2,
  ArrowRight,
  FileText,
  Bell,
  Banknote,
  XCircle,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.customer.getDashboard();
      setData(res);
    } catch (err) {
      console.warn('Dashboard error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const metrics = data?.metrics || {};
  const recentApps = data?.recentApplications || [];
  const recentNotifs = data?.recentNotifications || [];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Customer ID: {user?.id} • CIBIL Credit Score: <strong className="text-emerald-700 font-bold">{metrics.creditScore || user?.creditScore || 780}</strong> (Prime Borrower)
          </p>
        </div>

        <Link
          to="/customer/apply"
          className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto bg-emerald-700 hover:bg-emerald-800 border-emerald-700 text-white font-bold uppercase tracking-wider shadow-sm transition-colors"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Apply for New Loan</span>
        </Link>
      </div>

      {/* Dashboard KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-xs font-mono">
        {/* Total Applications */}
        <Link to="/customer/applications" className="metric-card hover:border-slate-400 transition-colors block">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Applications</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Submitted loan requests</span>
        </Link>

        {/* Pending Verification */}
        <Link to="/customer/applications?status=PENDING" className="metric-card hover:border-amber-400 transition-colors block border-l-4 border-l-amber-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Pending Review</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{metrics.pendingApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Verification queue</span>
        </Link>

        {/* Approved Loans */}
        <Link to="/customer/applications?status=APPROVED" className="metric-card hover:border-emerald-400 transition-colors block border-l-4 border-l-emerald-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Approved Loans</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.approvedLoans || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Manager sanctioned</span>
        </Link>

        {/* Disbursed Active Loans */}
        <Link to="/customer/loans" className="metric-card hover:border-purple-400 transition-colors block border-l-4 border-l-purple-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Disbursed Loans</span>
          <div className="text-2xl font-bold text-purple-700 mt-1">{metrics.disbursedLoans || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Active in bank account</span>
        </Link>

        {/* Active Loan Amount */}
        <div className="metric-card">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Active Loan Amount</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{(metrics.activeLoanAmount || 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500 font-sans">Principal borrowed</span>
        </div>

        {/* Rejected Applications */}
        <Link to="/customer/applications?status=REJECTED" className="metric-card hover:border-rose-400 transition-colors block border-l-4 border-l-rose-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Rejected Loans</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">{metrics.rejectedApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Declined requests</span>
        </Link>
      </div>

      {/* Two-Column Section: Recent Applications & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Applications (Left 8 Cols) */}
        <div className="lg:col-span-8 border border-slate-200 bg-white space-y-4 shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-900" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recent Loan Applications
              </h2>
            </div>
            <Link to="/customer/applications" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 font-mono">
              <span>View All ({metrics.totalApplications || 0})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr>
                  <th className="table-header">Application ID</th>
                  <th className="table-header">Loan Type</th>
                  <th className="table-header text-right">Requested</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Workflow Status</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No loan applications submitted yet. Click "Apply for New Loan" to get started.
                    </td>
                  </tr>
                ) : (
                  recentApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="table-cell font-mono font-bold text-slate-900">
                        {app.applicationNumber}
                      </td>
                      <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
                      <td className="table-cell text-right font-mono font-bold text-slate-900">
                        ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell font-mono text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="table-cell text-right">
                        <Link
                          to="/customer/applications"
                          className="btn-secondary py-1 px-2.5 text-[11px] inline-flex items-center gap-1"
                        >
                          <span>Track Status</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Notifications (Right 4 Cols) */}
        <div className="lg:col-span-4 border border-slate-200 bg-white space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-slate-900" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Recent Notifications
                </h2>
              </div>
              <Link to="/customer/notifications" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold font-mono">
                All Alerts
              </Link>
            </div>

            <div className="p-4 divide-y divide-slate-100 space-y-3">
              {recentNotifs.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No new notifications.</p>
              ) : (
                recentNotifs.map((n) => (
                  <div key={n.id} className="pt-2 first:pt-0 space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 leading-tight">{n.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {new Date(n.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>24/7 Lending Platform Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
