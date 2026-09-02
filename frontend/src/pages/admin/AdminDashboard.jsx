import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
 Users,
 FileSpreadsheet,
 Clock,
 CheckCircle2,
 XCircle,
 Banknote,
 Receipt,
 CalendarCheck2,
 AlertTriangle,
 ArrowRight,
 Eye,
 TrendingUp,
 BarChart3,
 Layers
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

 return (
 <div className="space-y-8 font-sans">
 {/* Header */}
 <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
 <LayoutDashboardIcon className="w-5 h-5 text-slate-900" />
 <span>Credit Underwriting & Executive Dashboard</span>
 </h1>
 <p className="text-xs text-slate-500 font-mono mt-0.5">
 Real-time portfolio metrics, application review queues, disbursement telemetry, and risk assessment
 </p>
 </div>

 <div className="flex items-center gap-2 self-start sm:self-auto">
 <Link
 to="/admin/applications?status=PENDING_REVIEW"
 className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5 cursor-pointer bg-slate-900 text-white"
 >
 <Clock className="w-3.5 h-3.5 text-amber-400" />
 <span>Review Pending ({metrics.pendingApplications || 0})</span>
 </Link>
 <Link
 to="/admin/disbursements"
 className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5 cursor-pointer bg-emerald-800 hover:bg-emerald-900 border-emerald-800 text-white"
 >
 <Banknote className="w-3.5 h-3.5" />
 <span>Disbursements</span>
 </Link>
 </div>
 </div>

 {/* 9 Executive KPI Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-xs">
 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Customers</span>
 <div className="text-2xl font-bold font-mono text-slate-900">{metrics.totalCustomers || 0}</div>
 <span className="text-[11px] text-slate-500">Registered borrowers</span>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Applications</span>
 <div className="text-2xl font-bold font-mono text-slate-900">{metrics.totalApplications || 0}</div>
 <span className="text-[11px] text-slate-500">All submitted loans</span>
 </div>

 <div className="metric-card bg-amber-50 border-amber-300">
 <span className="text-amber-800 font-bold uppercase text-[10px] block">Pending Reviews</span>
 <div className="text-2xl font-bold font-mono text-amber-900">{metrics.pendingApplications || 0}</div>
 <span className="text-[11px] text-amber-700">Requires underwriting</span>
 </div>

 <div className="metric-card bg-emerald-50 border-emerald-300">
 <span className="text-emerald-800 font-bold uppercase text-[10px] block">Approved Loans</span>
 <div className="text-2xl font-bold font-mono text-emerald-900">{metrics.approvedLoans || 0}</div>
 <span className="text-[11px] text-emerald-700">Approved by credit officer</span>
 </div>

 <div className="metric-card bg-rose-50 border-rose-300">
 <span className="text-rose-800 font-bold uppercase text-[10px] block">Rejected Loans</span>
 <div className="text-2xl font-bold font-mono text-rose-900">{metrics.rejectedLoans || 0}</div>
 <span className="text-[11px] text-rose-700">Declined applications</span>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Active Disbursed Loans</span>
 <div className="text-2xl font-bold font-mono text-slate-900">{metrics.activeLoans || 0}</div>
 <span className="text-[11px] text-slate-500">Live repayment cycle</span>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Disbursed Volume</span>
 <div className="text-2xl font-bold font-mono text-emerald-800">₹{(metrics.totalDisbursed || 0).toLocaleString('en-IN')}</div>
 <span className="text-[11px] text-slate-500">Gross capital deployed</span>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Outstanding Balance</span>
 <div className="text-2xl font-bold font-mono text-slate-900">₹{(metrics.outstandingAmount || 0).toLocaleString('en-IN')}</div>
 <span className="text-[11px] text-slate-500">Portfolio on balance sheet</span>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Total EMI Collected</span>
 <div className="text-2xl font-bold font-mono text-emerald-700">₹{(metrics.totalCollected || 0).toLocaleString('en-IN')}</div>
 <span className="text-[11px] text-slate-500">Cumulative repayments</span>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Overdue Outstanding</span>
 <div className="text-2xl font-bold font-mono text-rose-700">₹{(metrics.overdueAmount || 0).toLocaleString('en-IN')}</div>
 <span className="text-[11px] text-slate-500 font-mono">{metrics.overdueCount || 0} Overdue EMIs</span>
 </div>
 </div>

 {/* Loan Types Distribution & Portfolio Breakdown */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center">
 <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
 <BarChart3 className="w-4 h-4 text-slate-900" />
 <span>Product Portfolio & Lending Distribution</span>
 </h3>
 <span className="text-[11px] font-mono text-slate-400">Category telemetry</span>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-2">
 {data?.loanTypeStats?.map((stat) => (
 <div key={stat.type} className="p-3.5 space-y-1.5">
 <span className="font-bold text-slate-900 text-xs block">{stat.type}</span>
 <div className="space-y-0.5 font-mono text-[11px] text-slate-600">
 <div>Applications: <strong className="text-slate-900">{stat.applicationsCount}</strong></div>
 <div>Active Loans: <strong className="text-slate-900">{stat.activeLoansCount}</strong></div>
 <div>Disbursed: <strong className="text-emerald-800 font-bold">₹{(stat.disbursedAmount || 0).toLocaleString('en-IN')}</strong></div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Pending Reviews Queue Table */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center">
 <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
 <Clock className="w-4 h-4 text-amber-600" />
 <span>Recent Loan Applications Requiring Underwriting Action</span>
 </h3>
 <Link to="/admin/applications" className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1">
 <span>View All Applications</span>
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
 <th className="table-header text-right">Requested Amount</th>
 <th className="table-header text-center">Tenure</th>
 <th className="table-header text-center">Credit Rating</th>
 <th className="table-header">Application Status</th>
 <th className="table-header text-right">Underwrite</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium">
 {data?.recentApplications?.length === 0 ? (
 <tr>
 <td colSpan={8} className="py-8 text-center text-slate-400">
 No loan applications queued.
 </td>
 </tr>
 ) : (
 data?.recentApplications?.map((app) => (
 <tr key={app.id} className="hover:bg-slate-50">
 <td className="table-cell font-mono font-bold text-slate-900">{app.applicationNumber}</td>
 <td className="table-cell font-semibold text-slate-900">
 {app.customerName}
 <span className="block text-[10px] text-slate-400 font-mono font-normal">{app.customerEmail}</span>
 </td>
 <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
 <td className="table-cell text-right font-mono font-bold text-slate-900">
 ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
 </td>
 <td className="table-cell text-center font-mono">{app.loanDetails?.tenureMonths} Mos</td>
 <td className="table-cell text-center font-mono">
 <StatusBadge status={app.creditAssessment?.eligibilityStatus || 'ELIGIBLE'} />
 </td>
 <td className="table-cell">
 <StatusBadge status={app.status} />
 </td>
 <td className="table-cell text-right">
 <Link
 to={`/admin/applications/${app.id}`}
 className="btn-primary py-1 px-3 text-[11px] inline-flex items-center gap-1 cursor-pointer"
 >
 <Eye className="w-3 h-3" />
 <span>Review & Decision →</span>
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

function LayoutDashboardIcon(props) {
 return <LayoutDashboard {...props} />;
}
import { LayoutDashboard } from 'lucide-react';
