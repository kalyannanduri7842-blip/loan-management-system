import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  Banknote,
  Search,
  Eye,
  X,
  User,
  Shield,
  FileText,
  BadgeIndianRupee,
  ArrowRight,
  Landmark,
  UserCheck
} from 'lucide-react';

export function ManagerApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Manager Decision Form State
  const [approvedAmount, setApprovedAmount] = useState('');
  const [approvedTenure, setApprovedTenure] = useState('');
  const [interestRate, setInterestRate] = useState(12.0);
  const [managerRemarks, setManagerRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionTab, setActionTab] = useState('approve'); // 'approve' | 'reject'
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.manager.getApplications();
      setApplications(res.applications || []);

      const appIdParam = searchParams.get('appId');
      if (appIdParam && res.applications) {
        const target = res.applications.find(a => a.id === appIdParam || a.applicationNumber === appIdParam);
        if (target) openReviewModal(target);
      }
    } catch (err) {
      console.warn('Manager applications fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openReviewModal = (app) => {
    setSelectedApp(app);
    const recAmt = app.employeeVerification?.recommendedAmount || app.loanDetails?.requestedAmount || 500000;
    const recTen = app.employeeVerification?.recommendedTenure || app.loanDetails?.tenureMonths || 36;
    setApprovedAmount(app.managerDecision?.approvedAmount || recAmt);
    setApprovedTenure(app.managerDecision?.approvedTenure || recTen);
    setInterestRate(app.managerDecision?.interestRate || 12.0);
    setManagerRemarks(app.managerDecision?.managerRemarks || 'Sanctioned based on favorable employee verification and satisfactory credit assessment.');
    setRejectionReason(app.rejectionReason || '');
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (!approvedAmount || Number(approvedAmount) <= 0) {
      return addToast('Validation Error', 'Please enter a valid approved loan amount.', 'error');
    }

    setSubmitting(true);
    try {
      const res = await api.manager.approveLoan(selectedApp.id, {
        approvedAmount: Number(approvedAmount),
        tenureMonths: Number(approvedTenure),
        interestRate: Number(interestRate),
        managerRemarks
      });

      addToast(
        'Loan Approved!',
        `Application ${selectedApp.applicationNumber} approved for ₹${Number(approvedAmount).toLocaleString('en-IN')} @ ${interestRate}% p.a. Status is now Disbursement Pending.`,
        'success'
      );

      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      addToast('Approval Error', err.message || 'Could not approve loan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (!rejectionReason.trim()) {
      return addToast('Validation Error', 'Please provide a clear rejection reason.', 'error');
    }

    setSubmitting(true);
    try {
      await api.manager.rejectLoan(selectedApp.id, {
        rejectionReason,
        managerRemarks
      });

      addToast(
        'Loan Rejected',
        `Application ${selectedApp.applicationNumber} has been rejected by the underwriting committee.`,
        'info'
      );

      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      addToast('Rejection Error', err.message || 'Could not reject application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.applicationNumber.toLowerCase().includes(q) ||
        app.customerName.toLowerCase().includes(q) ||
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
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span>Manager Loan Review & Sanctions Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review employee recommendations, audit risk parameters, and approve or reject loan requests
          </p>
        </div>

        <Link
          to="/manager/disbursements"
          className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 font-bold"
        >
          <Banknote className="w-4 h-4 text-emerald-700" />
          <span>Disbursements Workspace</span>
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
            <option value="EMPLOYEE_RECOMMENDED">Awaiting Sanction (Recommended)</option>
            <option value="DISBURSEMENT_PENDING">Disbursement Pending</option>
            <option value="ACTIVE">Active & Disbursed</option>
            <option value="MANAGER_REJECTED">Manager Rejected</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Customer or Loan Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-1 text-xs font-mono"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="border border-slate-200 bg-white shadow-sm text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-slate-900">
            Manager Review Ledger ({filteredApps.length})
          </span>
          <span className="text-[11px] font-mono text-slate-400">Database connected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Requested</th>
                <th className="table-header text-right">Officer Recommendation</th>
                <th className="table-header text-center">CIBIL Score</th>
                <th className="table-header">Audited By</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-sans">
                    No loan applications found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell font-bold text-slate-900">{app.customerName}</td>
                    <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold text-slate-900">
                      ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-right font-mono font-bold text-emerald-800">
                      {app.employeeVerification?.recommendedAmount ? `₹${app.employeeVerification.recommendedAmount.toLocaleString('en-IN')}` : '—'}
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
                      <button
                        onClick={() => openReviewModal(app)}
                        className="btn-primary py-1 px-3 text-[11px] bg-purple-600 hover:bg-purple-500 border-purple-600 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{app.status === 'EMPLOYEE_RECOMMENDED' ? 'Review & Approve' : 'View Audit'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED MANAGER REVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full border border-slate-300 p-6 space-y-6 max-h-[92vh] overflow-y-auto text-xs shadow-2xl font-sans">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-purple-700 uppercase font-bold">Credit Sanction Review Gateway</span>
                <h3 className="font-bold text-lg text-slate-900">{selectedApp.applicationNumber} — {selectedApp.loanDetails?.loanType}</h3>
                <p className="text-[11px] text-slate-500">Borrower: <strong>{selectedApp.customerName}</strong> ({selectedApp.customerEmail})</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Officer Recommendation Highlight Card */}
            {selectedApp.employeeVerification && (
              <div className="border border-blue-300 bg-blue-50/70 p-4 space-y-2">
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="font-bold text-blue-900 uppercase text-xs flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-700" />
                    <span>Employee Recommendation & Audit Finding</span>
                  </span>
                  <span className="text-[10px] font-mono text-blue-800 font-bold bg-blue-100 px-2 py-0.5 border border-blue-300">
                    AUDIT COMPLETED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
                  <div>
                    <span className="text-blue-600 text-[10px] uppercase block">Auditing Officer</span>
                    <strong className="text-slate-900">{selectedApp.employeeVerification.employeeName}</strong>
                  </div>
                  <div>
                    <span className="text-blue-600 text-[10px] uppercase block">Recommended Sanction</span>
                    <strong className="text-emerald-800 text-sm">₹{selectedApp.employeeVerification.recommendedAmount?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-blue-600 text-[10px] uppercase block">Tenure</span>
                    <strong className="text-slate-900">{selectedApp.employeeVerification.recommendedTenure} Months</strong>
                  </div>
                  <div>
                    <span className="text-blue-600 text-[10px] uppercase block">Audit Date</span>
                    <span className="text-slate-700">{new Date(selectedApp.employeeVerification.verifiedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="border-t border-blue-200 pt-2 text-[11px] text-slate-700 font-sans">
                  <strong>Officer Verification Notes: </strong>
                  {selectedApp.employeeVerification.verificationNotes}
                </div>
              </div>
            )}

            {/* Applicant & Financial Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="border border-slate-200 bg-slate-50 p-3 space-y-1">
                <span className="font-bold text-slate-800 uppercase text-[10px] block border-b pb-1">Applicant Profile</span>
                <p>Name: <strong>{selectedApp.customerName}</strong></p>
                <p>Phone: <strong>{selectedApp.customerPhone}</strong></p>
                <p>Aadhaar: <strong>{selectedApp.identityDetails?.aadhaarNumber || 'XXXX-XXXX-8921'}</strong></p>
                <p>PAN: <strong>{selectedApp.identityDetails?.panNumber || 'ABCDE1234F'}</strong></p>
              </div>

              <div className="border border-slate-200 bg-slate-50 p-3 space-y-1">
                <span className="font-bold text-slate-800 uppercase text-[10px] block border-b pb-1">Financial Inflows</span>
                <p>Monthly Income: <strong className="text-emerald-800">₹{selectedApp.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')}</strong></p>
                <p>Employer: <strong>{selectedApp.employmentDetails?.companyName}</strong></p>
                <p>Existing Liabilities: <strong>₹{selectedApp.employmentDetails?.existingEmi?.toLocaleString('en-IN') || 0} / mo</strong></p>
                <p>CIBIL Score: <strong className="text-emerald-700 font-bold">{selectedApp.creditScore || 750}</strong></p>
              </div>

              <div className="border border-slate-200 bg-slate-50 p-3 space-y-1">
                <span className="font-bold text-slate-800 uppercase text-[10px] block border-b pb-1">Disbursement Bank</span>
                <p>Bank: <strong>{selectedApp.bankDetails?.bankName}</strong></p>
                <p>Account: <strong>{selectedApp.bankDetails?.accountNumber}</strong></p>
                <p>IFSC: <strong>{selectedApp.bankDetails?.ifscCode}</strong></p>
                <p>Requested: <strong>₹{selectedApp.loanDetails?.requestedAmount?.toLocaleString('en-IN')}</strong></p>
              </div>
            </div>

            {/* MANAGER DECISION ACTION PANELS */}
            {selectedApp.status === 'EMPLOYEE_RECOMMENDED' || selectedApp.status === 'MANAGER_REVIEW' ? (
              <div className="border border-purple-300 p-6 bg-purple-50/50 space-y-4">
                <div className="flex space-x-3 border-b border-purple-200 pb-3">
                  <button
                    type="button"
                    onClick={() => setActionTab('approve')}
                    className={`py-1.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors ${
                      actionTab === 'approve'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    Sanction & Approve Loan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionTab('reject')}
                    className={`py-1.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors ${
                      actionTab === 'reject'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    Reject Loan
                  </button>
                </div>

                {actionTab === 'approve' ? (
                  <form onSubmit={handleApprove} className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">Approved Loan Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          min="10000"
                          value={approvedAmount}
                          onChange={(e) => setApprovedAmount(e.target.value)}
                          className="input-field font-bold text-slate-900 bg-white"
                        />
                        <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Officer recommended: ₹{selectedApp.employeeVerification?.recommendedAmount?.toLocaleString('en-IN')}</span>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">Approved Tenure (Months) *</label>
                        <input
                          type="number"
                          required
                          min="6"
                          max="360"
                          value={approvedTenure}
                          onChange={(e) => setApprovedTenure(e.target.value)}
                          className="input-field font-bold text-slate-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">Interest Rate (% p.a.) *</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          min="5.0"
                          max="30.0"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          className="input-field font-bold text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1 font-sans">Manager Sanction Remarks *</label>
                      <textarea
                        rows={3}
                        required
                        value={managerRemarks}
                        onChange={(e) => setManagerRemarks(e.target.value)}
                        className="input-field bg-white font-sans text-xs"
                        placeholder="Sanction terms, rationale, or special conditions..."
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 border-purple-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{submitting ? 'Sanctioning...' : 'Confirm Approval (Move to Disbursement)'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleReject} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-rose-800 mb-1">Manager Rejection Reason *</label>
                      <select
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="input-field bg-white"
                        required
                      >
                        <option value="">-- Select Rejection Reason --</option>
                        <option value="Risk exposure cap exceeded for borrower segment">Risk exposure cap exceeded for borrower segment</option>
                        <option value="Insufficient repayment buffer for requested ticket size">Insufficient repayment buffer for requested ticket size</option>
                        <option value="High aggregate portfolio concentration risk">High aggregate portfolio concentration risk</option>
                        <option value="Discrepancy in employer background check">Discrepancy in employer background check</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Manager Detailed Remarks</label>
                      <textarea
                        rows={2}
                        value={managerRemarks}
                        onChange={(e) => setManagerRemarks(e.target.value)}
                        className="input-field bg-white text-xs"
                        placeholder="Audit notes justifying rejection..."
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-500 border-rose-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{submitting ? 'Rejecting...' : 'Confirm Loan Rejection'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : selectedApp.status === 'DISBURSEMENT_PENDING' ? (
              <div className="border border-emerald-300 p-6 bg-emerald-50/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="font-bold text-emerald-950 uppercase text-xs block">Loan Approved & Sanctioned</span>
                  <p className="text-xs text-emerald-800 font-mono mt-1">
                    Sanctioned Amount: <strong>₹{selectedApp.managerDecision?.approvedAmount?.toLocaleString('en-IN')}</strong> @ {selectedApp.managerDecision?.interestRate}% p.a.
                  </p>
                </div>
                <Link
                  to="/manager/disbursements"
                  className="btn-primary py-2 px-6 text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-white font-bold flex items-center gap-1.5"
                >
                  <Banknote className="w-4 h-4" />
                  <span>Go to Disbursement Workspace</span>
                </Link>
              </div>
            ) : (
              <div className="p-4 border bg-slate-50 space-y-2 font-mono text-xs">
                <span className="font-bold text-slate-800 uppercase block">Application Lifecycle Status: {selectedApp.status}</span>
                {selectedApp.managerDecision && (
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p>Decided by: <strong>{selectedApp.managerDecision.managerName}</strong> on {new Date(selectedApp.managerDecision.decidedAt).toLocaleString('en-IN')}</p>
                    <p>Sanctioned Amount: <strong>₹{selectedApp.managerDecision.approvedAmount?.toLocaleString('en-IN')}</strong> @ {selectedApp.managerDecision.interestRate}%</p>
                    <p>Remarks: {selectedApp.managerDecision.managerRemarks}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}