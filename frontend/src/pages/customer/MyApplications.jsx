import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FilePlus2,
  Calendar,
  X,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Banknote,
  Search
} from 'lucide-react';

export function MyApplications() {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.customer.getMyApplications();
      setApplications(res.applications || []);
    } catch (err) {
      console.warn('Applications fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'PENDING' && !['SUBMITTED', 'EMPLOYEE_REVIEW', 'EMPLOYEE_RECOMMENDED', 'MANAGER_REVIEW'].includes(app.status)) return false;
      if (statusFilter === 'APPROVED' && !['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE', 'DISBURSED'].includes(app.status)) return false;
      if (statusFilter === 'REJECTED' && !['EMPLOYEE_REJECTED', 'MANAGER_REJECTED', 'REJECTED'].includes(app.status)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.applicationNumber.toLowerCase().includes(q) ||
        app.loanDetails?.loanType?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Timeline Step Status Evaluator
  const getTimelineSteps = (app) => {
    const isSubmitted = true;
    const isEmpVerified = ['EMPLOYEE_REVIEW', 'EMPLOYEE_RECOMMENDED', 'MANAGER_REVIEW', 'MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE', 'DISBURSED', 'EMPLOYEE_REJECTED'].includes(app.status);
    const isEmpRecommended = ['EMPLOYEE_RECOMMENDED', 'MANAGER_REVIEW', 'MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE', 'DISBURSED'].includes(app.status);
    const isManagerReviewed = ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE', 'DISBURSED', 'MANAGER_REJECTED'].includes(app.status);
    const isApproved = ['MANAGER_APPROVED', 'DISBURSEMENT_PENDING', 'ACTIVE', 'DISBURSED'].includes(app.status);
    const isDisbursed = ['ACTIVE', 'DISBURSED', 'CLOSED'].includes(app.status);
    const isRejected = ['EMPLOYEE_REJECTED', 'MANAGER_REJECTED', 'REJECTED'].includes(app.status);

    return [
      {
        title: 'Application Submitted',
        role: 'Customer',
        date: app.createdAt,
        completed: isSubmitted,
        active: app.status === 'SUBMITTED',
        remarks: `Requested ₹${app.loanDetails?.requestedAmount?.toLocaleString('en-IN')} for ${app.loanDetails?.tenureMonths} months.`
      },
      {
        title: 'Employee KYC & Document Verification',
        role: 'Verification Officer',
        date: app.employeeVerification?.verifiedAt || null,
        completed: isEmpVerified,
        active: app.status === 'EMPLOYEE_REVIEW',
        failed: app.status === 'EMPLOYEE_REJECTED',
        remarks: app.employeeVerification?.verificationNotes || (app.status === 'SUBMITTED' ? 'Waiting for officer assignment' : 'Under verification')
      },
      {
        title: 'Employee Recommendation',
        role: 'Verification Officer',
        date: app.employeeVerification?.verifiedAt || null,
        completed: isEmpRecommended,
        active: app.status === 'EMPLOYEE_RECOMMENDED',
        failed: app.status === 'EMPLOYEE_REJECTED',
        remarks: app.employeeVerification ? `Recommended ₹${app.employeeVerification.recommendedAmount?.toLocaleString('en-IN')} (${app.employeeVerification.riskLevel})` : 'Pending officer verification'
      },
      {
        title: 'Manager Sanction & Approval',
        role: 'Senior Underwriting Manager',
        date: app.managerDecision?.decidedAt || null,
        completed: isApproved,
        active: app.status === 'MANAGER_REVIEW' || app.status === 'EMPLOYEE_RECOMMENDED',
        failed: app.status === 'MANAGER_REJECTED',
        remarks: app.managerDecision?.managerRemarks || (isEmpRecommended ? 'Awaiting manager review' : 'Pending recommendation')
      },
      {
        title: 'Fund Disbursement',
        role: 'Disbursement Department',
        date: app.status === 'ACTIVE' ? app.updatedAt : null,
        completed: isDisbursed,
        active: app.status === 'DISBURSEMENT_PENDING',
        remarks: isDisbursed ? `Transferred to ${app.bankDetails?.bankName} account (${app.bankDetails?.accountNumber})` : (app.status === 'DISBURSEMENT_PENDING' ? 'Sanctioned — pending safe test transfer' : 'Awaiting loan sanction')
      }
    ];
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-900" />
            <span>My Loan Applications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time multi-stage status, underwriting verification notes, and decision milestones
          </p>
        </div>

        <Link
          to="/customer/apply"
          className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto bg-emerald-700 hover:bg-emerald-800 border-emerald-700 text-white font-bold"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>New Application</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="border border-slate-200 bg-white p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="font-semibold text-slate-700">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-1 text-xs"
          >
            <option value="ALL">All Applications</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved & Disbursed</option>
            <option value="REJECTED">Declined / Rejected</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID or Loan Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-1 text-xs font-mono"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="border border-slate-200 bg-white space-y-4 shadow-sm text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-slate-900">
            Applications Ledger ({filteredApps.length})
          </span>
          <span className="text-[11px] font-mono text-slate-400">Connected database records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Requested Amount</th>
                <th className="table-header text-center">Tenure</th>
                <th className="table-header">Submission Date</th>
                <th className="table-header">Workflow Status</th>
                <th className="table-header">Current Stage / Remarks</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No loan applications found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold text-slate-900">
                      ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-center font-mono">
                      {app.loanDetails?.tenureMonths} Months
                    </td>
                    <td className="table-cell font-mono text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell font-mono text-[11px] text-slate-600 max-w-[240px] truncate">
                      {app.status === 'SUBMITTED' && 'Waiting for employee verification'}
                      {app.status === 'EMPLOYEE_REVIEW' && 'Officer auditing KYC & documents'}
                      {app.status === 'EMPLOYEE_RECOMMENDED' && `Recommended for ₹${app.employeeVerification?.recommendedAmount?.toLocaleString('en-IN')} by Employee`}
                      {app.status === 'DISBURSEMENT_PENDING' && `Approved for ₹${app.managerDecision?.approvedAmount?.toLocaleString('en-IN')} @ ${app.managerDecision?.interestRate}%`}
                      {app.status === 'ACTIVE' && 'Loan active & disbursed in bank account'}
                      {app.status === 'EMPLOYEE_REJECTED' && `Declined: ${app.rejectionReason}`}
                      {app.status === 'MANAGER_REJECTED' && `Declined: ${app.rejectionReason}`}
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn-secondary py-1 px-3 text-[11px] inline-flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Track Status</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VIEW & TIMELINE MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full border border-slate-300 p-6 space-y-6 max-h-[90vh] overflow-y-auto text-xs shadow-xl font-sans">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Application Tracking Overview</span>
                <h3 className="font-bold text-base text-slate-900">{selectedApp.applicationNumber} — {selectedApp.loanDetails?.loanType}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Decision Banner */}
            <div className="p-4 border border-slate-200 bg-slate-50 flex justify-between items-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Current Workflow Status</span>
                <StatusBadge status={selectedApp.status} className="mt-1" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Requested Amount</span>
                <span className="font-bold text-sm text-slate-900">₹{selectedApp.loanDetails?.requestedAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* STATUS PROGRESSION TIMELINE */}
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b pb-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Underwriting & Approval Timeline</span>
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {getTimelineSteps(selectedApp).map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Dot */}
                    <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                      step.failed
                        ? 'bg-rose-600 border-rose-200'
                        : step.completed
                        ? 'bg-emerald-600 border-emerald-200'
                        : step.active
                        ? 'bg-blue-600 border-blue-200 animate-pulse'
                        : 'bg-slate-300 border-white'
                    }`} />

                    <div className="flex justify-between items-start">
                      <h5 className={`font-bold ${step.completed || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </h5>
                      <span className="font-mono text-[10px] text-slate-400">
                        {step.date ? new Date(step.date).toLocaleDateString('en-IN') : 'Pending'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-mono">
                      Role: <strong>{step.role}</strong>
                    </p>

                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 border border-slate-100 rounded">
                      {step.remarks}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Details Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4 font-mono text-[11px]">
              <div className="space-y-1 bg-slate-50 p-3 border">
                <span className="font-bold text-slate-700 block uppercase">Personal & Financial Profile</span>
                <p>Applicant: <strong>{selectedApp.customerName}</strong></p>
                <p>Income: <strong>₹{selectedApp.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')} / mo</strong></p>
                <p>Employer: <strong>{selectedApp.employmentDetails?.companyName}</strong></p>
                <p>CIBIL Score: <strong>{selectedApp.creditScore || 780}</strong></p>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 border">
                <span className="font-bold text-slate-700 block uppercase">Disbursement Bank Account</span>
                <p>Bank: <strong>{selectedApp.bankDetails?.bankName}</strong></p>
                <p>Account: <strong>{selectedApp.bankDetails?.accountNumber}</strong></p>
                <p>IFSC Code: <strong>{selectedApp.bankDetails?.ifscCode}</strong></p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 pt-3 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="btn-secondary py-1.5 px-4 text-xs font-bold cursor-pointer"
              >
                Close Tracking View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
