import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  UserCheck,
  Shield,
  FileSpreadsheet,
  AlertTriangle,
  Eye
} from 'lucide-react';

export function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.employee.getDashboard();
      setData(res);
    } catch (err) {
      console.warn('Employee dashboard error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const metrics = data?.metrics || {};
  const pendingQueue = data?.pendingQueue || [];
  const recentProcessed = data?.recentProcessed || [];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Verification Officer Workspace</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Officer: <strong>{user?.fullName}</strong> ({user?.employeeId || 'EMP-3001'}) • {user?.department || 'KYC & Document Audits'}
          </p>
        </div>

        <Link
          to="/employee/applications"
          className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto bg-blue-600 hover:bg-blue-700 border-blue-600 text-white font-bold uppercase tracking-wider"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Open Verification Queue</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
        <Link to="/employee/applications?status=SUBMITTED" className="metric-card hover:border-amber-400 transition-colors block border-l-4 border-l-amber-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">New Unverified</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{metrics.newApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Awaiting initial check</span>
        </Link>

        <Link to="/employee/applications?status=EMPLOYEE_REVIEW" className="metric-card hover:border-blue-400 transition-colors block border-l-4 border-l-blue-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Under Review</span>
          <div className="text-2xl font-bold text-blue-700 mt-1">{metrics.underReview || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">In active verification</span>
        </Link>

        <Link to="/employee/applications?status=EMPLOYEE_RECOMMENDED" className="metric-card hover:border-emerald-400 transition-colors block border-l-4 border-l-emerald-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Recommended</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.recommendedApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Sent to manager</span>
        </Link>

        <Link to="/employee/applications?status=EMPLOYEE_REJECTED" className="metric-card hover:border-rose-400 transition-colors block border-l-4 border-l-rose-500">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Rejected by Staff</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">{metrics.rejectedApplications || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">KYC / DTI mismatches</span>
        </Link>

        <div className="metric-card border-l-4 border-l-slate-900">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Processed</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalProcessed || 0}</div>
          <span className="text-[11px] text-slate-500 font-sans">Lifetime audits completed</span>
        </div>
      </div>

      {/* Main Pending Verification Queue Table */}
      <div className="border border-slate-200 bg-white space-y-4 shadow-sm text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold uppercase tracking-wider text-slate-900">
              Pending Loan Verification Queue ({pendingQueue.length})
            </h2>
          </div>
          <Link to="/employee/applications" className="text-xs text-blue-700 hover:text-blue-800 font-bold font-mono flex items-center gap-1">
            <span>Full Verification Queue</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Requested</th>
                <th className="table-header text-right">Monthly Income</th>
                <th className="table-header text-center">CIBIL Score</th>
                <th className="table-header">Submission Date</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pendingQueue.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No pending applications requiring verification at this time.
                  </td>
                </tr>
              ) : (
                pendingQueue.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell font-bold">{app.customerName}</td>
                    <td className="table-cell">{app.loanDetails?.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold text-slate-900">
                      ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-right font-mono">
                      ₹{app.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-center font-mono font-bold text-emerald-800">
                      {app.creditScore || 750}
                    </td>
                    <td className="table-cell font-mono text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/employee/applications?appId=${app.id}`}
                        className="btn-primary py-1 px-3 text-[11px] bg-blue-600 hover:bg-blue-500 border-blue-600 text-white font-bold inline-flex items-center gap-1"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Verify Application</span>
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
