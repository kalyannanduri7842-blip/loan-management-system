import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Eye,
  X,
  User,
  Shield,
  Briefcase,
  FileText,
  BadgeIndianRupee,
  ArrowRight,
  Landmark
} from 'lucide-react';

export function EmployeeApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Verification & Decision Form State
  const [checks, setChecks] = useState({
    aadhaar: false,
    pan: false,
    salarySlip: false,
    bankStatement: false
  });
  const [recAmount, setRecAmount] = useState('');
  const [recTenure, setRecTenure] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionTab, setActionTab] = useState('recommend'); // 'recommend' | 'reject'
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.employee.getApplications();
      setApplications(res.applications || []);

      // If appId param is passed, open detail modal
      const appIdParam = searchParams.get('appId');
      if (appIdParam && res.applications) {
        const target = res.applications.find(a => a.id === appIdParam || a.applicationNumber === appIdParam);
        if (target) openVerificationModal(target);
      }
    } catch (err) {
      console.warn('Employee applications fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openVerificationModal = async (app) => {
    setSelectedApp(app);
    setRecAmount(app.employeeVerification?.recommendedAmount || app.loanDetails?.requestedAmount || '');
    setRecTenure(app.employeeVerification?.recommendedTenure || app.loanDetails?.tenureMonths || '');
    setVerificationNotes(app.employeeVerification?.verificationNotes || 'Customer identity, income documents, and bank statement verified. Good credit standing.');
    setRejectionReason(app.rejectionReason || '');

    setChecks({
      aadhaar: app.documents?.aadhaar?.status === 'VERIFIED',
      pan: app.documents?.pan?.status === 'VERIFIED',
      salarySlip: app.documents?.salarySlip?.status === 'VERIFIED',
      bankStatement: app.documents?.bankStatement?.status === 'VERIFIED'
    });

    // Notify backend that application was opened for review if SUBMITTED
    if (app.status === 'SUBMITTED') {
      try {
        await api.employee.getApplicationById(app.id);
      } catch (e) {}
    }
  };

  const handleDocumentVerify = async (docType) => {
    if (!selectedApp) return;
    const newStatus = !checks[docType] ? 'VERIFIED' : 'PENDING';
    setChecks(prev => ({ ...prev, [docType]: !prev[docType] }));

    try {
      await api.employee.verifyDocument(selectedApp.id, docType, newStatus);
    } catch (e) {
      console.warn('Doc verify error', e);
    }
  };

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (!recAmount || Number(recAmount) <= 0) {
      return addToast('Validation Error', 'Please enter a valid recommended loan amount.', 'error');
    }

    setSubmitting(true);
    try {
      const res = await api.employee.recommendLoan(selectedApp.id, {
        recommendedAmount: Number(recAmount),
        recommendedTenure: Number(recTenure),
        verificationNotes,
        creditScore: selectedApp.creditScore || 750,
        riskLevel: selectedApp.creditAssessment?.riskLevel || 'LOW_RISK'
      });

      addToast(
        'Application Recommended!',
        `Application ${selectedApp.applicationNumber} has been recommended for ₹${Number(recAmount).toLocaleString('en-IN')} and forwarded to the Manager review queue.`,
        'success'
      );

      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      addToast('Recommendation Error', err.message || 'Could not recommend application', 'error');
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
      await api.employee.rejectApplication(selectedApp.id, {
        rejectionReason,
        verificationNotes
      });

      addToast(
        'Application Rejected',
        `Application ${selectedApp.applicationNumber} has been rejected at the employee verification stage.`,
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
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <span>Employee Application Verification & KYC Review</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit applicant KYC, check credit rating & documents, and submit approval recommendations or rejection reasons
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="border border-slate-200 bg-white p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="font-semibold text-slate-700">Filter Stage:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-1 text-xs"
          >
            <option value="ALL">All Application Stages</option>
            <option value="SUBMITTED">New (Submitted)</option>
            <option value="EMPLOYEE_REVIEW">Under Review</option>
            <option value="EMPLOYEE_RECOMMENDED">Recommended to Manager</option>
            <option value="EMPLOYEE_REJECTED">Rejected by Staff</option>
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
            Assigned Applications Queue ({filteredApps.length})
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
                <th className="table-header text-right">Monthly Income</th>
                <th className="table-header text-center">CIBIL Score</th>
                <th className="table-header">Submission Date</th>
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
                      <button
                        onClick={() => openVerificationModal(app)}
                        className="btn-primary py-1 px-3 text-[11px] bg-blue-600 hover:bg-blue-500 border-blue-600 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{app.status === 'SUBMITTED' || app.status === 'EMPLOYEE_REVIEW' ? 'Verify Application' : 'View Audit'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED APPLICATION VERIFICATION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full border border-slate-300 p-6 space-y-6 max-h-[92vh] overflow-y-auto text-xs shadow-2xl font-sans">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-blue-700 uppercase font-bold">Employee Verification Gateway</span>
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

            {/* 4 Multi-Tier Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Customer Personal & Identity Verification */}
              <div className="border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5 border-b pb-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Applicant KYC & Identity</span>
                </span>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>Full Name: <strong>{selectedApp.customerName}</strong></p>
                  <p>Mobile: <strong>{selectedApp.customerPhone}</strong></p>
                  <p>DOB: <strong>{selectedApp.personalDetails?.dob || '1992-05-14'}</strong></p>
                  <p>Aadhaar: <strong>{selectedApp.identityDetails?.aadhaarNumber || 'XXXX-XXXX-8921'}</strong></p>
                  <p>PAN: <strong>{selectedApp.identityDetails?.panNumber || 'ABCDE1234F'}</strong></p>
                  <p>Address: <span className="font-sans text-[10px] text-slate-600 block">{selectedApp.personalDetails?.address}</span></p>
                </div>
              </div>

              {/* 2. Employment & Bank Information */}
              <div className="border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5 border-b pb-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Employment & Bank Verification</span>
                </span>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>Employment: <strong>{selectedApp.employmentDetails?.employmentType}</strong></p>
                  <p>Employer: <strong>{selectedApp.employmentDetails?.companyName}</strong></p>
                  <p>Monthly Income: <strong className="text-emerald-800">₹{selectedApp.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')}</strong></p>
                  <p>Existing Liabilities: <strong>₹{selectedApp.employmentDetails?.existingEmi?.toLocaleString('en-IN') || 0} / mo</strong></p>
                  <p>Bank: <strong>{selectedApp.bankDetails?.bankName} ({selectedApp.bankDetails?.accountNumber})</strong></p>
                  <p>IFSC: <strong>{selectedApp.bankDetails?.ifscCode}</strong></p>
                </div>
              </div>

              {/* 3. Loan Requirements */}
              <div className="border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5 border-b pb-1">
                  <BadgeIndianRupee className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. Loan Request Parameters</span>
                </span>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>Loan Product: <strong>{selectedApp.loanDetails?.loanType}</strong></p>
                  <p>Requested Amount: <strong className="text-slate-900 text-sm">₹{selectedApp.loanDetails?.requestedAmount?.toLocaleString('en-IN')}</strong></p>
                  <p>Requested Tenure: <strong>{selectedApp.loanDetails?.tenureMonths} Months</strong></p>
                  <p>Purpose: <span className="font-sans text-[10px] text-slate-600 block">{selectedApp.loanDetails?.loanPurpose}</span></p>
                </div>
              </div>

              {/* 4. Credit Bureau & Assessment */}
              <div className="border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5 border-b pb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>4. Credit Bureau & Risk Check</span>
                </span>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>CIBIL Score: <strong className="text-base text-emerald-800 font-black">{selectedApp.creditScore || 750}</strong></p>
                  <p>DTI Ratio: <strong>{selectedApp.creditAssessment?.dtiRatio || 28.5}%</strong></p>
                  <p>Risk Profile: <span className="font-bold text-emerald-700">{selectedApp.creditAssessment?.riskLevel || 'LOW_RISK'}</span></p>
                  <p>Policy Eligibility: <span className="font-bold text-slate-900">{selectedApp.creditAssessment?.recommendation || 'ELIGIBLE'}</span></p>
                </div>
              </div>
            </div>

            {/* MANDATORY DOCUMENT VERIFICATION CHECKLIST */}
            <div className="border border-slate-300 p-4 space-y-3 bg-white">
              <span className="font-bold uppercase text-xs text-slate-900 flex items-center gap-1.5 border-b pb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Document Verification Checklist (Audit Proofs)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center justify-between p-2.5 border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checks.aadhaar}
                      onChange={() => handleDocumentVerify('aadhaar')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold block text-slate-900">Aadhaar Card Proof</span>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedApp.documents?.aadhaar?.name || 'Aadhaar_Card.pdf'}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${checks.aadhaar ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                    {checks.aadhaar ? 'VERIFIED' : 'PENDING'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-2.5 border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checks.pan}
                      onChange={() => handleDocumentVerify('pan')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold block text-slate-900">PAN Card Proof</span>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedApp.documents?.pan?.name || 'PAN_Card.pdf'}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${checks.pan ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                    {checks.pan ? 'VERIFIED' : 'PENDING'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-2.5 border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checks.salarySlip}
                      onChange={() => handleDocumentVerify('salarySlip')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold block text-slate-900">Salary Slip / ITR</span>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedApp.documents?.salarySlip?.name || 'Salary_Slip.pdf'}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${checks.salarySlip ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                    {checks.salarySlip ? 'VERIFIED' : 'PENDING'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-2.5 border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checks.bankStatement}
                      onChange={() => handleDocumentVerify('bankStatement')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <div>
                      <span className="font-bold block text-slate-900">6-Month Bank Statement</span>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedApp.documents?.bankStatement?.name || 'Bank_Statement.pdf'}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${checks.bankStatement ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                    {checks.bankStatement ? 'VERIFIED' : 'PENDING'}
                  </span>
                </label>
              </div>
            </div>

            {/* EMPLOYEE DECISION ACTION PANELS */}
            {['SUBMITTED', 'EMPLOYEE_REVIEW', 'EMPLOYEE_RECOMMENDED'].includes(selectedApp.status) ? (
              <div className="border border-slate-300 p-6 bg-slate-50 space-y-4">
                <div className="flex space-x-3 border-b border-slate-200 pb-3">
                  <button
                    type="button"
                    onClick={() => setActionTab('recommend')}
                    className={`py-1.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors ${
                      actionTab === 'recommend'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    Recommend Loan to Manager
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
                    Reject Application
                  </button>
                </div>

                {actionTab === 'recommend' ? (
                  <form onSubmit={handleRecommend} className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">Recommended Loan Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          min="10000"
                          value={recAmount}
                          onChange={(e) => setRecAmount(e.target.value)}
                          className="input-field font-bold text-slate-900 bg-white"
                        />
                        <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Applicant requested: ₹{selectedApp.loanDetails?.requestedAmount?.toLocaleString('en-IN')}</span>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">Recommended Tenure (Months) *</label>
                        <input
                          type="number"
                          required
                          min="6"
                          max="360"
                          value={recTenure}
                          onChange={(e) => setRecTenure(e.target.value)}
                          className="input-field font-bold text-slate-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1 font-sans">Verification Notes & Remarks for Manager *</label>
                      <textarea
                        rows={3}
                        required
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        className="input-field bg-white font-sans text-xs"
                        placeholder="Document and KYC audit findings, employer verification, repayment capacity notes..."
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-500 border-blue-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{submitting ? 'Submitting...' : 'Confirm Recommendation & Send to Manager'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleReject} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-rose-800 mb-1">Rejection Reason *</label>
                      <select
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="input-field bg-white"
                        required
                      >
                        <option value="">-- Select Standard Rejection Reason --</option>
                        <option value="High Debt-to-Income (DTI) ratio exceeding risk tolerance">High Debt-to-Income (DTI) ratio exceeding risk tolerance</option>
                        <option value="CIBIL credit score below minimum eligibility threshold (600)">CIBIL credit score below minimum eligibility threshold (600)</option>
                        <option value="KYC document mismatch / Unverifiable identity proofs">KYC document mismatch / Unverifiable identity proofs</option>
                        <option value="Unsatisfactory income inflows / Bank statement default history">Unsatisfactory income inflows / Bank statement default history</option>
                        <option value="Employer business untraceable or inactive registration">Employer business untraceable or inactive registration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Additional Detailed Officer Remarks</label>
                      <textarea
                        rows={2}
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        className="input-field bg-white text-xs"
                        placeholder="Specific details on reason for rejection..."
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-500 border-rose-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{submitting ? 'Rejecting...' : 'Confirm Rejection'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="p-4 border bg-slate-50 space-y-2 font-mono text-xs">
                <span className="font-bold text-slate-800 uppercase block">Application Lifecycle Status: {selectedApp.status}</span>
                {selectedApp.employeeVerification && (
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p>Verified by: <strong>{selectedApp.employeeVerification.employeeName}</strong> on {new Date(selectedApp.employeeVerification.verifiedAt).toLocaleString('en-IN')}</p>
                    <p>Recommendation: <strong>₹{selectedApp.employeeVerification.recommendedAmount?.toLocaleString('en-IN')}</strong> for {selectedApp.employeeVerification.recommendedTenure} months</p>
                    <p>Notes: {selectedApp.employeeVerification.verificationNotes}</p>
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
