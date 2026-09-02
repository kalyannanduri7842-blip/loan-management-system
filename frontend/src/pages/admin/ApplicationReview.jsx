import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DocumentViewerModal } from '../../components/ui/DocumentViewerModal';
import { useToast } from '../../context/ToastContext';
import {
 FileText,
 User,
 Briefcase,
 BadgeIndianRupee,
 Landmark,
 FileCheck,
 CheckCircle,
 XCircle,
 AlertTriangle,
 ArrowLeft,
 Eye,
 ShieldCheck,
 Check,
 X,
 MessageSquare
} from 'lucide-react';

export function ApplicationReview() {
 const { id } = useParams();
 const navigate = useNavigate();
 const { addToast } = useToast();

 const [application, setApplication] = useState(null);
 const [loading, setLoading] = useState(true);

 // Document modal
 const [selectedDocType, setSelectedDocType] = useState(null);

 // Approval Modal State
 const [showApproveModal, setShowApproveModal] = useState(false);
 const [approveForm, setApproveForm] = useState({
 approvedAmount: 500000,
 annualRate: 12.0,
 tenureMonths: 36,
 adminRemarks: 'Customer income and KYC verified. Approved by Credit Committee.'
 });

 // Rejection Modal State
 const [showRejectModal, setShowRejectModal] = useState(false);
 const [rejectForm, setRejectForm] = useState({
 rejectionReason: 'Debt-to-Income Ratio Exceeded',
 adminRemarks: 'Monthly debt obligations exceed policy underwriting limits.'
 });

 const [processing, setProcessing] = useState(false);

 const fetchApplication = async () => {
 setLoading(true);
 try {
 const res = await api.admin.getApplicationById(id);
 setApplication(res.application);

 if (res.application?.loanDetails) {
 setApproveForm(prev => ({
 ...prev,
 approvedAmount: res.application.loanDetails.requestedAmount,
 tenureMonths: res.application.loanDetails.tenureMonths
 }));
 }
 } catch (err) {
 addToast('Error', err.message || 'Could not load application', 'error');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchApplication();
 }, [id]);

 const handleVerifyDocument = async (docType) => {
 try {
 await api.admin.verifyDocument(application.id, docType, 'VERIFIED');
 addToast('Document Verified', `${docType} marked as verified.`, 'success');
 fetchApplication();
 setSelectedDocType(null);
 } catch (err) {
 addToast('Error', err.message || 'Could not verify document', 'error');
 }
 };

 const handleRejectDocument = async (docType) => {
 try {
 await api.admin.verifyDocument(application.id, docType, 'REJECTED');
 addToast('Document Rejected', `${docType} marked as rejected.`, 'error');
 fetchApplication();
 setSelectedDocType(null);
 } catch (err) {
 addToast('Error', err.message || 'Could not reject document', 'error');
 }
 };

 const handleApproveLoan = async (e) => {
 e.preventDefault();
 setProcessing(true);
 try {
 const res = await api.admin.approveLoan(application.id, approveForm);
 addToast(
 'Loan Approved Successfully!',
 res.message || `Application ${application.applicationNumber} approved.`,
 'success'
 );
 setShowApproveModal(false);
 fetchApplication();
 } catch (err) {
 addToast('Approval Failed', err.message || 'Could not approve loan', 'error');
 } finally {
 setProcessing(false);
 }
 };

 const handleRejectLoan = async (e) => {
 e.preventDefault();
 setProcessing(true);
 try {
 const res = await api.admin.rejectLoan(application.id, rejectForm);
 addToast(
 'Loan Application Rejected',
 `Application ${application.applicationNumber} marked as REJECTED.`,
 'error'
 );
 setShowRejectModal(false);
 fetchApplication();
 } catch (err) {
 addToast('Rejection Failed', err.message || 'Could not reject loan', 'error');
 } finally {
 setProcessing(false);
 }
 };

 if (loading) {
 return <div className="p-12 text-center text-xs text-slate-500">Loading application details...</div>;
 }

 if (!application) {
 return (
 <div className="p-12 text-center space-y-3 text-xs">
 <p className="text-slate-500">Application not found.</p>
 <Link to="/admin/applications" className="btn-secondary py-1.5 px-3">
 Back to Applications
 </Link>
 </div>
 );
 }

 const app = application;
 const credit = app.creditAssessment || {};
 const isActionable = app.status === 'PENDING_REVIEW' || app.status === 'UNDER_REVIEW';

 return (
 <div className="max-w-5xl mx-auto space-y-6 font-sans">
 {/* Top Breadcrumb & Status */}
 <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="space-y-1">
 <Link to="/admin/applications" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold">
 <ArrowLeft className="w-3.5 h-3.5" />
 <span>Back to All Applications</span>
 </Link>
 <div className="flex items-center gap-3">
 <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 font-mono">
 {app.applicationNumber}
 </h1>
 <StatusBadge status={app.status} />
 </div>
 </div>

 {/* Action Decision Bar */}
 {isActionable && (
 <div className="flex items-center gap-2 self-start sm:self-auto">
 <button
 onClick={() => setShowRejectModal(true)}
 className="btn-danger py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer"
 >
 <XCircle className="w-3.5 h-3.5" />
 <span>Reject Loan</span>
 </button>

 <button
 onClick={() => setShowApproveModal(true)}
 className="btn-success py-2 px-5 text-xs flex items-center gap-1.5 cursor-pointer bg-emerald-700 hover:bg-emerald-800"
 >
 <CheckCircle className="w-3.5 h-3.5" />
 <span>Approve Loan Decision →</span>
 </button>
 </div>
 )}
 </div>

 {/* 1. CREDIT ASSESSMENT & ELIGIBILITY SCORECARD */}
 <div className="border border-slate-900 bg-slate-900 text-white p-6 space-y-4">
 <div className="flex justify-between items-start border-b border-slate-800 pb-3">
 <div className="flex items-center gap-2">
 <ShieldCheck className="w-5 h-5 text-emerald-400" />
 <h3 className="font-bold uppercase tracking-wider text-sm text-white">
 Automated Underwriting & Credit Risk Assessment
 </h3>
 </div>
 <StatusBadge status={credit.eligibilityStatus || 'ELIGIBLE'} />
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
 <div className="p-3 bg-slate-800 border border-slate-700 space-y-0.5">
 <span className="text-slate-400 text-[10px] uppercase block">CIBIL Credit Score</span>
 <strong className="text-xl font-bold text-emerald-400">{credit.creditScore || 780} / 900</strong>
 </div>

 <div className="p-3 bg-slate-800 border border-slate-700 space-y-0.5">
 <span className="text-slate-400 text-[10px] uppercase block">Debt-to-Income (DTI)</span>
 <strong className={`text-xl font-bold ${credit.dtiRatio > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
 {credit.dtiRatio || 29}%
 </strong>
 </div>

 <div className="p-3 bg-slate-800 border border-slate-700 space-y-0.5">
 <span className="text-slate-400 text-[10px] uppercase block">Monthly Income</span>
 <strong className="text-xl font-bold text-white">₹{app.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')}</strong>
 </div>

 <div className="p-3 bg-slate-800 border border-slate-700 space-y-0.5">
 <span className="text-slate-400 text-[10px] uppercase block">Projected EMI</span>
 <strong className="text-xl font-bold text-white">₹{(credit.estimatedNewEmi || 16607).toLocaleString('en-IN')}</strong>
 </div>
 </div>

 <div className="text-xs text-slate-300 font-mono pt-1">
 <span>Automated Underwriting Notes: </span>
 <strong className="text-emerald-300">{credit.assessmentNotes || 'Strong credit profile with verified income.'}</strong>
 </div>
 </div>

 {/* 2. CUSTOMER & EMPLOYMENT INFORMATION */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
 {/* Customer Info */}
 <div className="border border-slate-200 bg-white p-5 space-y-3">
 <div className="flex items-center gap-2 border-b border-slate-200 pb-2 font-bold uppercase text-slate-900">
 <User className="w-4 h-4" />
 <span>Applicant Personal Information</span>
 </div>
 <div className="space-y-2 font-mono text-slate-700">
 <div className="flex justify-between">
 <span className="text-slate-400">Full Name:</span>
 <strong className="text-slate-900">{app.personalDetails?.fullName}</strong>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Date of Birth:</span>
 <span>{app.personalDetails?.dob}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Gender:</span>
 <span>{app.personalDetails?.gender}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Mobile:</span>
 <span>{app.personalDetails?.mobile}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Email:</span>
 <span>{app.personalDetails?.email}</span>
 </div>
 <div className="pt-1 border-t border-slate-100">
 <span className="text-slate-400 block mb-0.5">Residential Address:</span>
 <span className="text-slate-900 font-sans leading-relaxed">{app.personalDetails?.address}</span>
 </div>
 </div>
 </div>

 {/* Employment & Financial Info */}
 <div className="border border-slate-200 bg-white p-5 space-y-3">
 <div className="flex items-center gap-2 border-b border-slate-200 pb-2 font-bold uppercase text-slate-900">
 <Briefcase className="w-4 h-4" />
 <span>Employment & Financial Position</span>
 </div>
 <div className="space-y-2 font-mono text-slate-700">
 <div className="flex justify-between">
 <span className="text-slate-400">Employment Type:</span>
 <strong className="text-slate-900">{app.employmentDetails?.employmentType}</strong>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Company / Employer:</span>
 <strong className="text-slate-900">{app.employmentDetails?.companyName}</strong>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Net Monthly In-Hand:</span>
 <strong className="text-emerald-800 text-sm">₹{app.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')}</strong>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Work Experience:</span>
 <span>{app.employmentDetails?.workExperience}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Existing Monthly EMIs:</span>
 <span>₹{app.employmentDetails?.existingEmi?.toLocaleString('en-IN')}</span>
 </div>
 </div>
 </div>
 </div>

 {/* 3. LOAN & BANK DETAILS */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
 {/* Loan Request */}
 <div className="border border-slate-200 bg-white p-5 space-y-3">
 <div className="flex items-center gap-2 border-b border-slate-200 pb-2 font-bold uppercase text-slate-900">
 <BadgeIndianRupee className="w-4 h-4" />
 <span>Requested Loan Terms</span>
 </div>
 <div className="space-y-2 font-mono text-slate-700">
 <div className="flex justify-between">
 <span className="text-slate-400">Loan Type:</span>
 <strong className="text-slate-900">{app.loanDetails?.loanType}</strong>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Requested Principal:</span>
 <strong className="text-slate-900 text-sm">₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}</strong>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Repayment Tenure:</span>
 <strong>{app.loanDetails?.tenureMonths} Months ({Math.round(app.loanDetails?.tenureMonths / 12)} Years)</strong>
 </div>
 <div className="pt-1 border-t border-slate-100">
 <span className="text-slate-400 block mb-0.5">Stated Loan Purpose:</span>
 <span className="text-slate-900 font-sans leading-relaxed">{app.loanDetails?.loanPurpose}</span>
 </div>
 </div>
 </div>

 {/* Bank Account */}
 <div className="border border-slate-200 bg-white p-5 space-y-3">
 <div className="flex items-center gap-2 border-b border-slate-200 pb-2 font-bold uppercase text-slate-900">
 <Landmark className="w-4 h-4" />
 <span>Disbursement Bank Account</span>
 </div>
 <div className="space-y-2 font-mono text-slate-700">
 <div className="flex justify-between">
 <span className="text-slate-400">Bank Name:</span>
 <strong className="text-slate-900">{app.bankDetails?.bankName}</strong>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Account Number:</span>
 <strong className="text-slate-900">{app.bankDetails?.accountNumber}</strong>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">IFSC Code:</span>
 <strong className="text-slate-900 uppercase">{app.bankDetails?.ifscCode}</strong>
 </div>
 </div>
 </div>
 </div>

 {/* 4. UPLOADED DOCUMENTS VERIFICATION MATRIX */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center">
 <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
 <FileCheck className="w-4 h-4 text-slate-900" />
 <span>Mandatory KYC & Financial Verification Documents</span>
 </h3>
 <span className="text-[11px] font-mono text-slate-400">Click to preview, download, or verify</span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr>
 <th className="table-header">Document Type</th>
 <th className="table-header">Attached File Name</th>
 <th className="table-header text-center">Verification Status</th>
 <th className="table-header text-right">Audit & Decision</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium">
 {Object.entries(app.documents || {}).map(([key, doc]) => (
 <tr key={key} className="hover:bg-slate-50">
 <td className="table-cell font-bold text-slate-900 uppercase font-mono">
 {key.replace(/([A-Z])/g, ' $1')}
 </td>
 <td className="table-cell font-mono text-slate-600">{doc.name}</td>
 <td className="table-cell text-center">
 <StatusBadge status={doc.status || 'PENDING'} />
 </td>
 <td className="table-cell text-right space-x-1.5">
 <button
 onClick={() => setSelectedDocType(key)}
 className="btn-secondary py-1 px-2.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
 >
 <Eye className="w-3 h-3" />
 <span>Inspect Document</span>
 </button>
 {isActionable && (
 <>
 <button
 onClick={() => handleVerifyDocument(key)}
 className="btn-success py-1 px-2.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
 title="Quick Verify"
 >
 <Check className="w-3 h-3" />
 <span>Verify</span>
 </button>
 <button
 onClick={() => handleRejectDocument(key)}
 className="btn-danger py-1 px-2.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
 title="Quick Reject"
 >
 <X className="w-3 h-3" />
 <span>Reject</span>
 </button>
 </>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* DOCUMENT VIEWER MODAL */}
 {selectedDocType && (
 <DocumentViewerModal
 docType={selectedDocType}
 doc={app.documents?.[selectedDocType]}
 isAdmin={true}
 onClose={() => setSelectedDocType(null)}
 onVerify={handleVerifyDocument}
 onReject={handleRejectDocument}
 />
 )}

 {/* APPROVE LOAN MODAL */}
 {showApproveModal && (
 <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
 <form onSubmit={handleApproveLoan} className="bg-white max-w-lg w-full border border-slate-300 p-6 space-y-5 text-xs ">
 <div className="flex justify-between items-start border-b border-slate-200 pb-3">
 <div>
 <span className="font-mono text-[10px] text-emerald-700 uppercase font-bold">Credit Sanctioning Authority</span>
 <h3 className="font-bold text-base text-slate-900">Approve Loan for {app.customerName}</h3>
 </div>
 <button type="button" onClick={() => setShowApproveModal(false)} className="text-slate-400 hover:text-black font-bold p-1">
 <X className="w-4 h-4" />
 </button>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block font-semibold text-slate-700 mb-1">Sanctioned Loan Principal (₹) *</label>
 <input
 type="number"
 required
 min={10000}
 value={approveForm.approvedAmount}
 onChange={(e) => setApproveForm({ ...approveForm, approvedAmount: parseInt(e.target.value) || 0 })}
 className="input-field font-mono font-bold"
 />
 </div>

 <div>
 <label className="block font-semibold text-slate-700 mb-1">Approved Annual Rate (% p.a.) *</label>
 <input
 type="number"
 step="0.1"
 required
 value={approveForm.annualRate}
 onChange={(e) => setApproveForm({ ...approveForm, annualRate: parseFloat(e.target.value) || 12.0 })}
 className="input-field font-mono font-bold"
 />
 </div>
 </div>

 <div>
 <label className="block font-semibold text-slate-700 mb-1">Approved Tenure (Months) *</label>
 <input
 type="number"
 required
 min={6}
 value={approveForm.tenureMonths}
 onChange={(e) => setApproveForm({ ...approveForm, tenureMonths: parseInt(e.target.value) || 36 })}
 className="input-field font-mono font-bold"
 />
 </div>

 <div>
 <label className="block font-semibold text-slate-700 mb-1">Official Credit Remarks / Audit Notes *</label>
 <textarea
 rows={3}
 required
 value={approveForm.adminRemarks}
 onChange={(e) => setApproveForm({ ...approveForm, adminRemarks: e.target.value })}
 className="input-field"
 />
 </div>

 <div className="p-3 bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
 Approval will automatically generate official Loan record, compute <strong>{approveForm.tenureMonths}-month EMI schedule</strong>, and notify customer <strong>{app.customerName}</strong>.
 </div>

 <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
 <button
 type="button"
 onClick={() => setShowApproveModal(false)}
 className="btn-secondary py-2 px-4 text-xs"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={processing}
 className="btn-success py-2 px-6 text-xs uppercase bg-emerald-700 hover:bg-emerald-800 border-emerald-700"
 >
 {processing ? 'Sanctioning...' : 'Sanction & Approve Loan →'}
 </button>
 </div>
 </form>
 </div>
 )}

 {/* REJECT LOAN MODAL */}
 {showRejectModal && (
 <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
 <form onSubmit={handleRejectLoan} className="bg-white max-w-lg w-full border border-slate-300 p-6 space-y-5 text-xs ">
 <div className="flex justify-between items-start border-b border-slate-200 pb-3">
 <div>
 <span className="font-mono text-[10px] text-rose-700 uppercase font-bold">Underwriting Decline</span>
 <h3 className="font-bold text-base text-slate-900">Decline Loan Application {app.applicationNumber}</h3>
 </div>
 <button type="button" onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-black font-bold p-1">
 <X className="w-4 h-4" />
 </button>
 </div>

 <div>
 <label className="block font-semibold text-slate-700 mb-1">Primary Rejection Reason *</label>
 <select
 value={rejectForm.rejectionReason}
 onChange={(e) => setRejectForm({ ...rejectForm, rejectionReason: e.target.value })}
 className="input-field cursor-pointer font-semibold"
 >
 <option value="Insufficient Income">Insufficient In-Hand Income</option>
 <option value="Low Credit Score">Low CIBIL Credit Score (Below 600)</option>
 <option value="Debt-to-Income Ratio Exceeded">Debt-to-Income Ratio Exceeded (&gt;65%)</option>
 <option value="Invalid Documents">Invalid or Fraudulent Documents</option>
 <option value="Eligibility Criteria">Failed Core Eligibility Policy</option>
 <option value="Other">Other Policy Grounds</option>
 </select>
 </div>

 <div>
 <label className="block font-semibold text-slate-700 mb-1">Detailed Explanation / Remarks *</label>
 <textarea
 rows={3}
 required
 value={rejectForm.adminRemarks}
 onChange={(e) => setRejectForm({ ...rejectForm, adminRemarks: e.target.value })}
 className="input-field"
 />
 </div>

 <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
 <button
 type="button"
 onClick={() => setShowRejectModal(false)}
 className="btn-secondary py-2 px-4 text-xs"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={processing}
 className="btn-danger py-2 px-6 text-xs uppercase"
 >
 {processing ? 'Declining...' : 'Confirm Rejection'}
 </button>
 </div>
 </form>
 </div>
 )}
 </div>
 );
}
