import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  BadgeIndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  FilePlus2,
  ArrowRight,
  Receipt,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.loans.getDashboardMetrics();
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

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Customer ID: {user?.id} • CIBIL Score: <strong>{user?.creditScore || 780}</strong> (Eligible)
          </p>
        </div>

        <Link
          to="/apply-loan"
          className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto bg-emerald-700 hover:bg-emerald-800 border-emerald-700"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>Apply for New Loan</span>
        </Link>
      </div>

      {/* Dashboard KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-xs">
        <div className="metric-card">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Active Loans</span>
          <div className="text-2xl font-bold font-mono text-slate-900">{metrics.activeLoansCount || 0}</div>
          <span className="text-[11px] text-slate-500">Currently disbursed</span>
        </div>

        <div className="metric-card">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Pending Applications</span>
          <div className="text-2xl font-bold font-mono text-amber-700">{metrics.pendingApplicationsCount || 0}</div>
          <span className="text-[11px] text-slate-500">Under credit review</span>
        </div>

        <div className="metric-card">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Approved Loans</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">{metrics.approvedLoansCount || 0}</div>
          <span className="text-[11px] text-slate-500">Ready / Disbursed</span>
        </div>

        <div className="metric-card">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Outstanding Principal</span>
          <div className="text-2xl font-bold font-mono text-slate-900">₹{(metrics.outstandingAmount || 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500">Remaining to repay</span>
        </div>

        <div className="metric-card">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Next Monthly EMI</span>
          <div className="text-2xl font-bold font-mono text-slate-900">₹{(metrics.nextEmiAmount || 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500 font-mono">Due: {metrics.nextEmiDueDate || 'N/A'}</span>
        </div>

        <div className="metric-card">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Amount Repaid</span>
          <div className="text-2xl font-bold font-mono text-emerald-700">₹{(metrics.totalPaid || 0).toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500">Lifetime EMI payments</span>
        </div>
      </div>

      {/* Next EMI Payment Alert Banner */}
      {data?.nextEmi && (
        <div className="border border-slate-900 bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase bg-emerald-900 text-emerald-300 px-2 py-0.5 border border-emerald-700 font-bold">
              Upcoming Installment Notice
            </span>
            <h3 className="font-bold text-sm text-white">
              EMI #{data.nextEmi.emiNumber} Due on {data.nextEmi.dueDate}
            </h3>
            <p className="text-xs text-slate-300 font-mono">
              Amount Due: <strong>₹{data.nextEmi.emiAmount.toLocaleString('en-IN')}</strong> (Principal: ₹{data.nextEmi.principalComponent.toLocaleString('en-IN')} + Interest: ₹{data.nextEmi.interestComponent.toLocaleString('en-IN')})
            </p>
          </div>

          <Link
            to="/emi-schedule"
            className="btn-primary py-2 px-4 text-xs uppercase tracking-wider bg-emerald-500 text-slate-950 border-emerald-500 hover:bg-emerald-400 font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>Pay EMI Online</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Active Loans Overview */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-wider text-slate-900">
            My Active Loans ({data?.activeLoans?.length || 0})
          </h3>
          <Link to="/my-loans" className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Loan ID</th>
                <th className="table-header">Type</th>
                <th className="table-header text-right">Principal</th>
                <th className="table-header text-right">Interest</th>
                <th className="table-header text-right">Monthly EMI</th>
                <th className="table-header text-right">Remaining Principal</th>
                <th className="table-header text-center">Repayment Progress</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data?.activeLoans?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No active loans currently. Click "Apply for New Loan" to get started.
                  </td>
                </tr>
              ) : (
                data?.activeLoans?.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">{loan.loanNumber}</td>
                    <td className="table-cell font-semibold">{loan.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold">₹{loan.principalAmount?.toLocaleString('en-IN')}</td>
                    <td className="table-cell text-right font-mono">{loan.annualInterestRate}%</td>
                    <td className="table-cell text-right font-mono font-bold text-slate-900">₹{loan.emiAmount?.toLocaleString('en-IN')}</td>
                    <td className="table-cell text-right font-mono text-emerald-800 font-bold">₹{loan.remainingPrincipal?.toLocaleString('en-IN')}</td>
                    <td className="table-cell text-center font-mono">
                      {loan.paidEmisCount || 0} / {loan.totalEmisCount} EMIs
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/emi-schedule?loanId=${loan.id}`}
                        className="btn-secondary py-1 px-2.5 text-[11px] inline-flex items-center gap-1"
                      >
                        <span>Schedule</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-wider text-slate-900">
            Recent Loan Applications
          </h3>
          <Link to="/my-applications" className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1">
            <span>View All Applications</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Requested Amount</th>
                <th className="table-header text-center">Tenure</th>
                <th className="table-header">Date</th>
                <th className="table-header">Status</th>
                <th className="table-header">Admin Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data?.recentApplications?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No loan applications submitted yet.
                  </td>
                </tr>
              ) : (
                data?.recentApplications?.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">{app.applicationNumber}</td>
                    <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold">₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}</td>
                    <td className="table-cell text-center font-mono">{app.loanDetails?.tenureMonths} Mos</td>
                    <td className="table-cell font-mono text-slate-500">{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell text-slate-500 font-mono text-[11px] truncate max-w-[200px]">
                      {app.adminRemarks || (app.status === 'PENDING_REVIEW' ? 'Under review by underwriting team' : '—')}
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
