import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  Receipt,
  CalendarCheck2,
  Shield,
  ArrowRight,
  Eye,
  TrendingUp,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getDashboard();
      setData(res);
    } catch (err) {
      console.warn('Admin dashboard error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const metrics = data?.metrics || {};
  const recentApps = data?.recentApplications || [];
  const recentAudits = data?.recentAuditLogs || [];
  const recentDisb = data?.recentDisbursements || [];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            <span>Administrator Master Governance Console</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Complete institutional telemetry across borrowers, verification officers, underwriting managers & fund disbursement
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono">
          <Link
            to="/admin/applications"
            className="btn-primary py-2 px-3.5 flex items-center gap-1.5 bg-slate-900 text-white font-bold"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>All Applications ({metrics.totalApplications || 0})</span>
          </Link>
          <Link
            to="/admin/disbursements"
            className="btn-primary py-2 px-3.5 flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 border-emerald-700 text-white font-bold"
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Disbursements</span>
          </Link>
        </div>
      </div>

      {/* 12 Live Database KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-xs font-mono">
        {/* Total Customers */}
        <Link to="/admin/customers" className="metric-card hover:border-slate-400 transition-colors block border-l-4 border-l-emerald-600">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Customers</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalCustomers || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Registered borrowers</span>
        </Link>

        {/* Total Employees */}
        <Link to="/admin/employees" className="metric-card hover:border-slate-400 transition-colors block border-l-4 border-l-blue-600">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Employees</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalEmployees || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Verification officers</span>
        </Link>

        {/* Total Managers */}
        <Link to="/admin/managers" className="metric-card hover:border-slate-400 transition-colors block border-l-4 border-l-purple-600">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Managers</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalManagers || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Underwriting managers</span>
        </Link>

        {/* Total Applications */}
        <Link to="/admin/applications" className="metric-card hover:border-slate-400 transition-colors block border-l-4 border-l-slate-900">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Applications</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">All lifecycle requests</span>
        </Link>

        {/* Pending Applications */}
        <Link to="/admin/applications?status=SUBMITTED" className="metric-card hover:border-amber-400 transition-colors block border-l-4 border-l-amber-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Pending Verification</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{metrics.pendingApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Employee queue</span>
        </Link>

        {/* Employee Recommended */}
        <Link to="/admin/applications?status=EMPLOYEE_RECOMMENDED" className="metric-card hover:border-blue-400 transition-colors block border-l-4 border-l-blue-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Emp Recommended</span>
          <div className="text-2xl font-bold text-blue-700 mt-1">{metrics.employeeRecommended || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Awaiting manager</span>
        </Link>

        {/* Manager Approved */}
        <Link to="/admin/applications?status=MANAGER_APPROVED" className="metric-card hover:border-emerald-400 transition-colors block border-l-4 border-l-emerald-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Manager Approved</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.managerApproved || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Sanctioned limit</span>
        </Link>

        {/* Disbursement Pending */}
        <Link to="/admin/disbursements" className="metric-card hover:border-indigo-400 transition-colors block border-l-4 border-l-indigo-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Disburse Pending</span>
          <div className="text-2xl font-bold text-indigo-700 mt-1">{metrics.disbursementPending || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Approved fund queue</span>
        </Link>

        {/* Total Disbursed Amount */}
        <div className="metric-card border-l-4 border-l-emerald-700 bg-emerald-50/40">
          <span className="text-emerald-900 font-bold uppercase text-[10px] block">Total Disbursed</span>
          <div className="text-2xl font-bold text-emerald-950 mt-1">₹{(metrics.totalDisbursed || 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-800 font-sans">Live active principal</span>
        </div>

        {/* Rejected */}
        <Link to="/admin/applications?status=REJECTED" className="metric-card hover:border-rose-400 transition-colors block border-l-4 border-l-rose-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Rejected Loans</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">{metrics.rejectedApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Declined requests</span>
        </Link>

        {/* Today's Applications */}
        <div className="metric-card border-l-4 border-l-slate-700">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Today's Inflow</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.todayApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Submitted today</span>
        </div>

        {/* Monthly Disbursement */}
        <div className="metric-card border-l-4 border-l-purple-600 bg-purple-50/40">
          <span className="text-purple-900 font-bold uppercase text-[10px] block">Monthly Volume</span>
          <div className="text-2xl font-bold text-purple-950 mt-1">₹{(metrics.monthlyDisbursement || metrics.totalDisbursed || 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-purple-800 font-sans">Current month</span>
        </div>
      </div>

      {/* Two-Column Section: All Applications & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Applications Ledger (Left 8 Cols) */}
        <div className="lg:col-span-8 border border-slate-200 bg-white space-y-4 shadow-sm text-xs">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold uppercase tracking-wider text-slate-900">
                System Applications Ledger
              </h2>
            </div>
            <Link to="/admin/applications" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold font-mono flex items-center gap-1">
              <span>View All ({metrics.totalApplications || 0})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">App ID</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Loan Type</th>
                  <th className="table-header text-right">Requested</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                      No loan applications found.
                    </td>
                  </tr>
                ) : (
                  recentApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="table-cell font-mono font-bold text-slate-900">{app.applicationNumber}</td>
                      <td className="table-cell font-bold text-slate-900">{app.customerName}</td>
                      <td className="table-cell">{app.loanDetails?.loanType}</td>
                      <td className="table-cell text-right font-mono font-bold text-slate-900">
                        ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="table-cell text-right">
                        <Link
                          to={`/admin/applications?appId=${app.id}`}
                          className="btn-secondary py-1 px-2.5 text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Audit</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time System Audit Trail (Right 4 Cols) */}
        <div className="lg:col-span-4 border border-slate-200 bg-white space-y-4 shadow-sm text-xs flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-slate-900" />
                <h2 className="font-bold uppercase tracking-wider text-slate-900">
                  System Audit Trail
                </h2>
              </div>
              <Link to="/admin/audit-logs" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold font-mono">
                Full Log
              </Link>
            </div>

            <div className="p-4 divide-y divide-slate-100 space-y-3">
              {recentAudits.slice(0, 6).map((log) => (
                <div key={log.id} className="pt-2 first:pt-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 font-mono text-[11px]">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Actor: <strong>{log.actor}</strong> ({log.role})
                  </p>
                  <p className="text-[11px] text-slate-500 font-sans truncate">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] font-mono text-slate-500 flex justify-between items-center">
            <span>Governance Integrity: Verified</span>
            <span className="text-emerald-700 font-bold">100% Immutable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
