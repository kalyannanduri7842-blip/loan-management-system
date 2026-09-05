import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Eye
} from 'lucide-react';

export function ManagerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.manager.getDashboard();
      setData(res);
    } catch (err) {
      console.warn('Manager dashboard error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const metrics = data?.metrics || {};
  const reviewQueue = data?.reviewQueue || [];
  const pendingDisbursements = data?.pendingDisbursementsQueue || [];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span>Credit Approvals & Sanctions Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Manager: <strong>{user?.fullName}</strong> ({user?.employeeId || 'MGR-2001'}) • {user?.department || 'Credit Approvals & Disbursement'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/manager/disbursements"
            className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Banknote className="w-4 h-4 text-emerald-700" />
            <span>Disbursements ({metrics.pendingDisbursements || 0})</span>
          </Link>
          <Link
            to="/manager/applications"
            className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-700 border-purple-600 text-white font-bold uppercase tracking-wider"
          >
            <FileCheck className="w-4 h-4" />
            <span>Review Queue</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-xs font-mono">
        <Link to="/manager/applications?status=EMPLOYEE_RECOMMENDED" className="metric-card hover:border-purple-400 transition-colors block border-l-4 border-l-purple-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Awaiting Review</span>
          <div className="text-2xl font-bold text-purple-700 mt-1">{metrics.awaitingReview || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Officer recommended</span>
        </Link>

        <Link to="/manager/applications?status=MANAGER_APPROVED" className="metric-card hover:border-emerald-400 transition-colors block border-l-4 border-l-emerald-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Approved Loans</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.approvedLoans || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Sanctioned limits</span>
        </Link>

        <Link to="/manager/disbursements" className="metric-card hover:border-indigo-400 transition-colors block border-l-4 border-l-indigo-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Pending Disburse</span>
          <div className="text-2xl font-bold text-indigo-700 mt-1">{metrics.pendingDisbursements || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Ready for fund transfer</span>
        </Link>

        <div className="metric-card border-l-4 border-l-emerald-600">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Disbursed</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{(metrics.totalDisbursedAmount || 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500 font-sans">Live portfolio volume</span>
        </div>

        <Link to="/manager/applications?status=MANAGER_REJECTED" className="metric-card hover:border-rose-400 transition-colors block border-l-4 border-l-rose-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Rejected Loans</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">{metrics.rejectedLoans || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Committee declined</span>
        </Link>

        <div className="metric-card border-l-4 border-l-slate-900">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Active Portfolio</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{(metrics.approvedLoans || 0) + (metrics.pendingDisbursements || 0)}</div>
          <span className="text-[11px] text-slate-500 font-sans">Under management</span>
        </div>
      </div>

      {/* Main Review Queue Table */}
      <div className="border border-slate-200 bg-white space-y-4 shadow-sm text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h2 className="font-bold uppercase tracking-wider text-slate-900">
              Applications Awaiting Manager Sanction ({reviewQueue.length})
            </h2>
          </div>
          <Link to="/manager/applications" className="text-xs text-purple-700 hover:text-purple-800 font-bold font-mono flex items-center gap-1">
            <span>Full Approval Queue</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header text-right">Requested</th>
                <th className="table-header text-right">Employee Recommendation</th>
                <th className="table-header text-center">CIBIL Score</th>
                <th className="table-header">Auditing Officer</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {reviewQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No applications currently awaiting manager sanction.
                  </td>
                </tr>
              ) : (
                reviewQueue.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell font-bold text-slate-900">{app.customerName}</td>
                    <td className="table-cell text-right font-mono text-slate-900">
                      ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-right font-mono font-bold text-emerald-800">
                      ₹{app.employeeVerification?.recommendedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-center font-mono font-bold text-emerald-800">
                      {app.creditScore || app.employeeVerification?.creditScore || 750}
                    </td>
                    <td className="table-cell font-mono text-[11px] text-slate-600">
                      {app.employeeVerification?.employeeName || 'Staff Officer'}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/manager/applications?appId=${app.id}`}
                        className="btn-primary py-1 px-3 text-[11px] bg-purple-600 hover:bg-purple-500 border-purple-600 text-white font-bold inline-flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Review & Sanction</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
