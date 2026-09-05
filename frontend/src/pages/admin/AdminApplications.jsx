import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileSpreadsheet,
  Search,
  Eye,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  UserCheck,
  Briefcase,
  Banknote,
  User,
  Shield
} from 'lucide-react';

export function AdminApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [loanTypeFilter, setLoanTypeFilter] = useState('ALL');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getApplications({
        search,
        status: statusFilter,
        loanType: loanTypeFilter
      });
      setApplications(res.applications || []);

      const appIdParam = searchParams.get('appId');
      if (appIdParam && res.applications) {
        const target = res.applications.find(a => a.id === appIdParam || a.applicationNumber === appIdParam);
        if (target) setSelectedApp(target);
      }
    } catch (err) {
      console.warn('Error fetching applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setStatusFilter(s);
  }, [searchParams]);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, loanTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (loanTypeFilter !== 'ALL' && app.loanDetails?.loanType !== loanTypeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        app.applicationNumber.toLowerCase().includes(q) ||
        app.customerName.toLowerCase().includes(q) ||
        app.customerEmail?.toLowerCase().includes(q) ||
        app.loanDetails?.loanType?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Master Loan Applications Governance Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete institutional view of customer loan requests, verification officer audits, and management sanctions
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1 self-start sm:self-auto">
          Applications: {filteredApps.length}
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 space-y-3 text-xs shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Application ID, Customer Name, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 font-mono"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field cursor-pointer font-semibold"
            >
              <option value="ALL">All Application Stages</option>
              <option value="SUBMITTED">Submitted (New)</option>
              <option value="EMPLOYEE_REVIEW">Employee Review</option>
              <option value="EMPLOYEE_RECOMMENDED">Employee Recommended</option>
              <option value="MANAGER_APPROVED">Manager Approved</option>
              <option value="DISBURSEMENT_PENDING">Disbursement Pending</option>
              <option value="ACTIVE">Active & Disbursed</option>
              <option value="EMPLOYEE_REJECTED">Employee Rejected</option>
              <option value="MANAGER_REJECTED">Manager Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={loanTypeFilter}
              onChange={(e) => setLoanTypeFilter(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="ALL">All Loan Products</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
              <option value="Education Loan">Education Loan</option>
              <option value="Business Loan">Business Loan</option>
            </select>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="border border-slate-200 bg-white shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Requested</th>
                <th className="table-header text-right">Sanctioned</th>
                <th className="table-header text-center">CIBIL</th>
                <th className="table-header">Verification Officer</th>
                <th className="table-header">Workflow Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-sans">
                    No applications found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">{app.applicationNumber}</td>
                    <td className="table-cell font-bold text-slate-900">
                      <div>{app.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">{app.customerEmail}</div>
                    </td>
                    <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
                    <td className="table-cell text-right font-mono text-slate-900 font-bold">
                      ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-right font-mono text-emerald-800 font-bold">
                      {app.managerDecision?.approvedAmount
                        ? `₹${app.managerDecision.approvedAmount.toLocaleString('en-IN')}`
                        : app.employeeVerification?.recommendedAmount
                        ? `₹${app.employeeVerification.recommendedAmount.toLocaleString('en-IN')} (Rec)`
                        : '—'}
                    </td>
                    <td className="table-cell text-center font-mono font-bold text-emerald-800">
                      {app.creditScore || 750}
                    </td>
                    <td className="table-cell font-mono text-[11px] text-slate-600">
                      {app.employeeVerification?.employeeName || '—'}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn-secondary py-1 px-2.5 text-[11px] inline-flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Audit Trail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL AUDIT TRAIL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full border border-slate-300 p-6 space-y-6 max-h-[92vh] overflow-y-auto text-xs shadow-2xl font-sans">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-emerald-700 uppercase font-bold">Administrator Application Audit Overview</span>
                <h3 className="font-bold text-lg text-slate-900">{selectedApp.applicationNumber} — {selectedApp.loanDetails?.loanType}</h3>
                <p className="text-[11px] text-slate-500">Applicant: <strong>{selectedApp.customerName}</strong> ({selectedApp.customerEmail})</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & KPI Banner */}
            <div className="p-4 border border-slate-200 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Lifecycle Status</span>
                <StatusBadge status={selectedApp.status} className="mt-1" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Requested Amount</span>
                <strong className="text-sm text-slate-900">₹{selectedApp.loanDetails?.requestedAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Sanctioned Amount</span>
                <strong className="text-sm text-emerald-800">
                  {selectedApp.managerDecision?.approvedAmount ? `₹${selectedApp.managerDecision.approvedAmount.toLocaleString('en-IN')}` : '—'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">CIBIL Bureau Score</span>
                <strong className="text-sm text-emerald-700">{selectedApp.creditScore || 750}</strong>
              </div>
            </div>

            {/* Multi-Role Audit Timeline Trail */}
            <div className="space-y-4">
              <span className="font-bold text-slate-900 uppercase text-xs block border-b pb-2">
                End-to-End Governance Audit Trail
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Customer Submission */}
                <div className="border border-slate-200 p-3 space-y-1 bg-slate-50">
                  <span className="font-bold text-slate-800 text-[10px] uppercase block">1. Customer Submission</span>
                  <p>Customer: <strong>{selectedApp.customerName}</strong></p>
                  <p>Date: {new Date(selectedApp.createdAt).toLocaleString('en-IN')}</p>
                  <p>Income: <strong>₹{selectedApp.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')}</strong></p>
                  <p>Bank: {selectedApp.bankDetails?.bankName}</p>
                </div>

                {/* 2. Employee Audit */}
                <div className="border border-blue-200 p-3 space-y-1 bg-blue-50/60">
                  <span className="font-bold text-blue-900 text-[10px] uppercase block">2. Verification Officer Audit</span>
                  {selectedApp.employeeVerification ? (
                    <>
                      <p>Officer: <strong>{selectedApp.employeeVerification.employeeName}</strong></p>
                      <p>Recommended: <strong>₹{selectedApp.employeeVerification.recommendedAmount?.toLocaleString('en-IN')}</strong></p>
                      <p>Date: {new Date(selectedApp.employeeVerification.verifiedAt).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-600 truncate">{selectedApp.employeeVerification.verificationNotes}</p>
                    </>
                  ) : (
                    <p className="text-slate-400 italic">Pending officer audit</p>
                  )}
                </div>

                {/* 3. Manager Sanction */}
                <div className="border border-purple-200 p-3 space-y-1 bg-purple-50/60">
                  <span className="font-bold text-purple-900 text-[10px] uppercase block">3. Manager Sanction & Decision</span>
                  {selectedApp.managerDecision ? (
                    <>
                      <p>Manager: <strong>{selectedApp.managerDecision.managerName}</strong></p>
                      <p>Sanction: <strong>₹{selectedApp.managerDecision.approvedAmount?.toLocaleString('en-IN')}</strong> @ {selectedApp.managerDecision.interestRate}%</p>
                      <p>Date: {new Date(selectedApp.managerDecision.decidedAt).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-600 truncate">{selectedApp.managerDecision.managerRemarks}</p>
                    </>
                  ) : (
                    <p className="text-slate-400 italic">Pending manager sanction</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="btn-secondary py-1.5 px-4 text-xs font-bold cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
