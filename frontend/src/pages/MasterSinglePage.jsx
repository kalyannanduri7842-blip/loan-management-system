import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  Landmark,
  Shield,
  User,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Banknote,
  CalendarDays,
  FilePlus2,
  FileText,
  Calculator,
  ArrowRight,
  RefreshCw,
  Eye,
  Check,
  X,
  CreditCard,
  AlertTriangle,
  Receipt,
  Users,
  Briefcase,
  Upload,
  Lock,
  Mail,
  Phone,
  Send,
  Sparkles,
  ChevronRight,
  CheckCheck
} from 'lucide-react';

export function MasterSinglePage() {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  // Active Role Focus for Quick Action & Perspective
  const [activePerspective, setActivePerspective] = useState('ALL'); // 'ALL' | 'CUSTOMER' | 'ADMIN'

  // Live Database Collections
  const [adminStats, setAdminStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loans, setLoans] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [customerNotifications, setCustomerNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals & Action States
  const [selectedApp, setSelectedApp] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(null);
  const [payingEmi, setPayingEmi] = useState(null);

  // Forms
  const [approveForm, setApproveForm] = useState({
    approvedAmount: 500000,
    annualRate: 12.0,
    tenureMonths: 36,
    adminRemarks: 'Income, KYC documents, and CIBIL score verified. Loan sanctioned.'
  });
  const [rejectForm, setRejectForm] = useState({
    rejectionReason: 'Debt-to-Income Exceeded',
    adminRemarks: 'Monthly debt obligations exceed underwriting risk policy limits.'
  });
  const [disburseRef, setDisburseRef] = useState('NEFT-AXIS-992100');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Customer Application Form
  const [applyForm, setApplyForm] = useState({
    fullName: 'Rahul Kumar',
    dob: '1992-05-14',
    gender: 'Male',
    mobile: '+91 98765 11111',
    email: 'customer@loan.com',
    address: 'Flat 302, Green Glen Heights, Bengaluru, Karnataka',
    employmentType: 'Salaried',
    companyName: 'TechCorp Global Solutions',
    monthlyIncome: 75000,
    existingEmi: 5000,
    loanType: 'Personal Loan',
    requestedAmount: 500000,
    tenureMonths: 36,
    loanPurpose: 'Home interior renovation and appliances purchase',
    bankName: 'HDFC Bank',
    accountNumber: '50100234567890',
    ifscCode: 'HDFC0001234',
    documents: {
      aadhaar: 'Aadhaar_Card.pdf',
      pan: 'PAN_Card.pdf',
      salarySlip: 'Salary_Slip_3M.pdf',
      bankStatement: 'Bank_Statement_6M.pdf',
      addressProof: 'Electricity_Bill.pdf'
    }
  });

  // EMI Calculator State
  const [calcAmount, setCalcAmount] = useState(500000);
  const [calcTenure, setCalcTenure] = useState(36);
  const [calcRate, setCalcRate] = useState(12.0);
  const [calcEmi, setCalcEmi] = useState(16607);

  // Sync user details when logged in
  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      setApplyForm(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        mobile: user.phone || prev.mobile,
        address: user.address || prev.address,
        monthlyIncome: user.monthlyIncome || prev.monthlyIncome
      }));
    }
  }, [user]);

  // Fetch all live data simultaneously
  const refreshAllData = async () => {
    setLoading(true);
    try {
      // 1. Dashboard stats
      const dash = await api.admin.getDashboard().catch(() => null);
      if (dash) setAdminStats(dash);

      // 2. All Applications
      const appsRes = await api.admin.getApplications({ limit: 100 }).catch(() => null);
      if (appsRes?.applications) setApplications(appsRes.applications);

      // 3. All Loans
      const loansRes = await api.admin.getLoans({ limit: 100 }).catch(() => null);
      if (loansRes?.loans) {
        setLoans(loansRes.loans);
        if (loansRes.loans.length > 0) {
          const currentId = selectedLoanId || loansRes.loans[0].id;
          setSelectedLoanId(currentId);
          const schRes = await api.loans.getEmiSchedule(currentId).catch(() => null);
          if (schRes?.schedule) setSchedule(schRes.schedule);
        } else {
          setSchedule([]);
        }
      } else {
        setLoans([]);
        setSchedule([]);
      }

      // 4. Dual Notifications (Admin & Customer)
      const notifsRes = await api.notifications.getMy().catch(() => null);
      if (notifsRes?.notifications) {
        const list = notifsRes.notifications;
        setAdminNotifications(list.filter(n => n.type === 'NEW_APPLICATION' || n.type === 'ADMIN_ALERT' || !n.userId || n.userId === 'usr-admin-1'));
        setCustomerNotifications(list.filter(n => n.type === 'LOAN_APPROVED' || n.type === 'LOAN_REJECTED' || n.type === 'LOAN_DISBURSED' || n.type === 'EMI_PAID' || n.type === 'CUSTOMER_ALERT'));
      }
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [selectedLoanId, user]);

  // Real-time EMI Calculator
  useEffect(() => {
    const p = Number(calcAmount);
    const r = (Number(calcRate) / 12) / 100;
    const n = Number(calcTenure);
    if (p > 0 && n > 0) {
      const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      setCalcEmi(emi);
    }
  }, [calcAmount, calcTenure, calcRate]);

  // Quick Role Sign In
  const handleQuickLogin = async (role, email, password) => {
    try {
      const res = await login(email, password);
      addToast('Role Switched', `Active Session: ${res.user?.fullName} (${res.user?.role})`, 'success');
      refreshAllData();
    } catch (err) {
      addToast('Login Failed', err.message, 'error');
    }
  };

  // 1. CUSTOMER: Submit Loan Application -> Sends Notification to Admin
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.mobile || !applyForm.requestedAmount || !applyForm.bankName) {
      addToast('Incomplete Form', 'Please fill all required fields.', 'error');
      return;
    }

    try {
      const payload = {
        personalDetails: {
          fullName: applyForm.fullName,
          dob: applyForm.dob || '1992-05-14',
          gender: applyForm.gender,
          mobile: applyForm.mobile,
          email: applyForm.email || 'customer@loan.com',
          address: applyForm.address || 'Bengaluru, Karnataka'
        },
        employmentDetails: {
          employmentType: applyForm.employmentType,
          companyName: applyForm.companyName || 'TechCorp Global Solutions',
          monthlyIncome: Number(applyForm.monthlyIncome),
          workExperience: '5 Years',
          existingEmi: Number(applyForm.existingEmi)
        },
        loanDetails: {
          loanType: applyForm.loanType,
          requestedAmount: Number(applyForm.requestedAmount),
          tenureMonths: Number(applyForm.tenureMonths),
          loanPurpose: applyForm.loanPurpose || 'Personal Requirement'
        },
        bankDetails: {
          bankName: applyForm.bankName,
          accountNumber: applyForm.accountNumber || '50100234567890',
          ifscCode: applyForm.ifscCode || 'HDFC0001234'
        },
        documents: applyForm.documents
      };

      const res = await api.applications.submit(payload);
      addToast(
        'Application Submitted!',
        `Loan application ${res.application?.applicationNumber} submitted! Admin has received an alert.`,
        'success'
      );

      refreshAllData();
    } catch (err) {
      addToast('Submission Error', err.message || 'Could not submit application', 'error');
    }
  };

  // 2. ADMIN: Verify KYC Document
  const handleVerifyDoc = async (appId, docType, status) => {
    try {
      await api.admin.verifyDocument(appId, docType, status);
      addToast('Document Verified', `${docType} marked as ${status}.`, 'success');
      refreshAllData();
      if (selectedApp) {
        const updated = await api.admin.getApplicationById(appId);
        setSelectedApp(updated.application);
      }
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // 3. ADMIN: Approve Loan -> Sends Approval Notification to Customer
  const handleApprove = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      const res = await api.admin.approveLoan(selectedApp.id, approveForm);
      addToast(
        'Loan Sanctioned & Approved!',
        `Application ${selectedApp.applicationNumber} APPROVED for ₹${approveForm.approvedAmount.toLocaleString('en-IN')}. Customer notified!`,
        'success'
      );
      setShowApproveModal(false);
      setSelectedApp(null);
      refreshAllData();
    } catch (err) {
      addToast('Approval Error', err.message, 'error');
    }
  };

  // 4. ADMIN: Reject Loan -> Sends Rejection Notification to Customer
  const handleReject = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      const res = await api.admin.rejectLoan(selectedApp.id, rejectForm);
      addToast('Application Declined', `Application ${selectedApp.applicationNumber} REJECTED. Customer has been notified.`, 'error');
      setShowRejectModal(false);
      setSelectedApp(null);
      refreshAllData();
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // 5. ADMIN: Disburse Loan -> Sends Disbursement Notification to Customer & Generates EMI Schedule
  const handleDisburse = async (e) => {
    e.preventDefault();
    if (!showDisburseModal) return;
    try {
      const res = await api.admin.disburseLoan(showDisburseModal.id, { disbursementRef: disburseRef });
      addToast('Funds Disbursed!', `Loan ${showDisburseModal.loanNumber} is now ACTIVE. Customer received disbursement notice!`, 'success');
      setShowDisburseModal(null);
      refreshAllData();
    } catch (err) {
      addToast('Disbursement Error', err.message, 'error');
    }
  };

  // 6. CUSTOMER: Pay EMI Online -> Reduces Principal & Generates Payment Notification
  const handlePayEmi = async (e) => {
    e.preventDefault();
    if (!payingEmi) return;
    try {
      const res = await api.loans.payEmi(selectedLoanId, {
        emiScheduleId: payingEmi.id,
        paymentMethod,
        paymentRef: `UPI-TXN-${Date.now().toString().slice(-6)}`
      });
      addToast('EMI Payment Successful', `Installment #${payingEmi.emiNumber} paid successfully! Balance reduced.`, 'success');
      setPayingEmi(null);
      refreshAllData();
    } catch (err) {
      addToast('Payment Error', err.message, 'error');
    }
  };

  const metrics = adminStats?.metrics || {};
  const currentLoan = loans.find(l => l.id === selectedLoanId) || loans[0];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      {/* HEADER & ONE-CLICK ROLE ACCESS */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider uppercase block leading-tight text-white">
                Loan Management System
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block">
                All-In-One Unified Lending Console
              </span>
            </div>
          </div>

          {/* Quick Access Pills in Header */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => handleQuickLogin('CUSTOMER', 'customer@loan.com', 'customer123')}
              className="py-1.5 px-3 uppercase border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer font-bold"
            >
              👤 Customer Mode (customer@loan.com)
            </button>

            <button
              onClick={() => handleQuickLogin('ADMIN', 'admin@loan.com', 'admin123')}
              className="py-1.5 px-3 uppercase border border-emerald-600 bg-emerald-800 hover:bg-emerald-700 text-white cursor-pointer font-bold"
            >
              🛡️ Admin Mode (admin@loan.com)
            </button>

            <button
              onClick={refreshAllData}
              className="p-1.5 bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN SINGLE-PAGE WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* HERO BANNER */}
        <div className="border border-slate-900 bg-slate-900 text-white p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-slate-800 text-emerald-400 px-2 py-0.5 border border-slate-700 font-bold">
                End-To-End Master Platform
              </span>
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                Customer Loan Application & Admin Underwriting Approval Console
              </h1>
            </div>

            <div className="text-right text-xs font-mono">
              <span className="text-slate-400 block text-[10px]">Session Operator:</span>
              <strong className="text-emerald-400 text-sm font-bold">{user?.fullName || 'Rahul Kumar'} ({user?.role || 'CUSTOMER'})</strong>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed font-light">
            <strong>Connected Workflow:</strong> Apply for a loan below ➔ Admin gets instant application alert ➔ Admin verifies KYC documents and clicks <strong>"Approve"</strong> ➔ Customer receives official <strong>"Loan Approved!"</strong> alert ➔ Admin disburses funds ➔ Customer pays monthly EMI online.
          </p>
        </div>

        {/* 1. DUAL LIVE NOTIFICATION FEEDS (ADMIN & CUSTOMER) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          {/* Admin Notifications Box */}
          <div className="border border-amber-300 bg-amber-50/40 p-5 space-y-3 shadow-sm">
            <div className="flex justify-between items-center border-b border-amber-200 pb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-800" />
                <h3 className="font-bold uppercase tracking-wider text-amber-900 text-xs">
                  🛡️ Admin Underwriting Alerts ({adminNotifications.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-700 font-bold">Incoming Applications</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {adminNotifications.length === 0 ? (
                <div className="p-3 bg-white border border-amber-200 text-slate-500 text-center font-mono">
                  No incoming applications yet. Submit a loan below to trigger an admin alert!
                </div>
              ) : (
                adminNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 bg-white border border-amber-200 space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-slate-900 font-bold">{n.title}</strong>
                      <span className="text-[9px] font-mono text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Customer Notifications Box */}
          <div className="border border-emerald-300 bg-emerald-50/40 p-5 space-y-3 shadow-sm">
            <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-800" />
                <h3 className="font-bold uppercase tracking-wider text-emerald-900 text-xs">
                  👤 Customer Notifications & Approval Alerts ({customerNotifications.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">Decision & Payments</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {customerNotifications.length === 0 ? (
                <div className="p-3 bg-white border border-emerald-200 text-slate-500 text-center font-mono">
                  No customer alerts yet. When Admin approves your loan, the approval notice will appear here!
                </div>
              ) : (
                customerNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 bg-white border border-emerald-200 space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-slate-900 font-bold">{n.title}</strong>
                      <span className="text-[9px] font-mono text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 2. CUSTOMER COMPONENT: APPLY FOR LOAN FORM */}
        <div className="border border-slate-200 bg-white p-6 space-y-5 text-xs shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <FilePlus2 className="w-5 h-5 text-slate-900" />
              <h2 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
                1. Customer Loan Application Form (Submit to Request Sanction)
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-200">
              Generates Unique LN-1000X
            </span>
          </div>

          <form onSubmit={handleApplySubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={applyForm.fullName}
                  onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={applyForm.mobile}
                  onChange={(e) => setApplyForm({ ...applyForm, mobile: e.target.value })}
                  className="input-field font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={applyForm.email}
                  onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                  className="input-field font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loan Category *</label>
                <select
                  value={applyForm.loanType}
                  onChange={(e) => setApplyForm({ ...applyForm, loanType: e.target.value })}
                  className="input-field cursor-pointer font-semibold"
                >
                  <option value="Personal Loan">Personal Loan (12.0% p.a.)</option>
                  <option value="Home Loan">Home Loan (8.5% p.a.)</option>
                  <option value="Vehicle Loan">Vehicle Loan (9.5% p.a.)</option>
                  <option value="Education Loan">Education Loan (10.0% p.a.)</option>
                  <option value="Business Loan">Business Loan (14.0% p.a.)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requested Principal (₹) *</label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={10000}
                  value={applyForm.requestedAmount}
                  onChange={(e) => setApplyForm({ ...applyForm, requestedAmount: parseInt(e.target.value) || 0 })}
                  className="input-field font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Repayment Tenure (Months) *</label>
                <select
                  value={applyForm.tenureMonths}
                  onChange={(e) => setApplyForm({ ...applyForm, tenureMonths: parseInt(e.target.value) || 36 })}
                  className="input-field cursor-pointer font-mono font-semibold"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                  <option value={120}>120 Months (10 Years)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly In-Hand Income (₹) *</label>
                <input
                  type="number"
                  required
                  value={applyForm.monthlyIncome}
                  onChange={(e) => setApplyForm({ ...applyForm, monthlyIncome: parseInt(e.target.value) || 0 })}
                  className="input-field font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Disbursement Bank Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Bank"
                  value={applyForm.bankName}
                  onChange={(e) => setApplyForm({ ...applyForm, bankName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50100234567890"
                  value={applyForm.accountNumber}
                  onChange={(e) => setApplyForm({ ...applyForm, accountNumber: e.target.value })}
                  className="input-field font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">IFSC Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC0001234"
                  value={applyForm.ifscCode}
                  onChange={(e) => setApplyForm({ ...applyForm, ifscCode: e.target.value.toUpperCase() })}
                  className="input-field font-mono uppercase"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">
                Attaches KYC: Aadhaar_Card.pdf, PAN_Card.pdf, Salary_Slip.pdf
              </span>
              <button
                type="submit"
                className="btn-primary py-2.5 px-8 text-xs uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 border-emerald-700 cursor-pointer font-bold"
              >
                Submit Loan Application →
              </button>
            </div>
          </form>
        </div>

        {/* 3. ADMIN COMPONENT: APPLICATIONS QUEUE & DECISION ENGINE */}
        <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-900" />
              <h2 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
                2. Admin Review Queue & Credit Decision Engine (Underwrite & Sanction)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Total: {applications.length} Applications</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">Application ID</th>
                  <th className="table-header">Applicant Name</th>
                  <th className="table-header">Loan Type</th>
                  <th className="table-header text-right">Requested Amount</th>
                  <th className="table-header text-center">Tenure</th>
                  <th className="table-header text-center">CIBIL Score</th>
                  <th className="table-header">Application Status</th>
                  <th className="table-header text-right">Underwriting Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-mono">
                      No loan applications submitted yet. Apply above to see it appear here!
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="table-cell font-mono font-bold text-slate-900">{app.applicationNumber}</td>
                      <td className="table-cell">
                        <strong className="text-slate-900 block">{app.customerName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{app.customerEmail}</span>
                      </td>
                      <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
                      <td className="table-cell text-right font-mono font-bold text-slate-900">
                        ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell text-center font-mono">{app.loanDetails?.tenureMonths} Mos</td>
                      <td className="table-cell text-center font-mono">
                        <span className="block font-bold">{app.creditAssessment?.creditScore || 780}</span>
                        <StatusBadge status={app.creditAssessment?.eligibilityStatus || 'ELIGIBLE'} />
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="table-cell text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setApproveForm({
                              approvedAmount: app.loanDetails?.requestedAmount || 500000,
                              annualRate: 12.0,
                              tenureMonths: app.loanDetails?.tenureMonths || 36,
                              adminRemarks: 'Income & KYC documents verified. Sanctioned by Credit Committee.'
                            });
                          }}
                          className="btn-secondary py-1 px-2.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Review & Audit</span>
                        </button>

                        {app.status === 'PENDING_REVIEW' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setShowApproveModal(true);
                              }}
                              className="btn-success py-1 px-3 text-[10px] uppercase font-bold cursor-pointer"
                            >
                              Approve Loan
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setShowRejectModal(true);
                              }}
                              className="btn-danger py-1 px-2 text-[10px] uppercase cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. ADMIN COMPONENT: DISBURSEMENTS QUEUE */}
        <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-800" />
              <h2 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
                3. Admin Disbursements Queue (Payout Sanctioned Funds)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {loans.filter(l => l.status === 'APPROVED').length} Approved Awaiting Transfer
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">Loan ID</th>
                  <th className="table-header">Customer Name</th>
                  <th className="table-header">Loan Type</th>
                  <th className="table-header text-right">Sanctioned Amount</th>
                  <th className="table-header">Beneficiary Bank Account</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Disburse Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium font-mono">
                {loans.filter(l => l.status === 'APPROVED').length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400 font-sans">
                      No approved loans waiting for disbursement. When you approve an application, it appears here!
                    </td>
                  </tr>
                ) : (
                  loans.filter(l => l.status === 'APPROVED').map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="table-cell font-bold text-slate-900">{loan.loanNumber}</td>
                      <td className="table-cell font-sans font-semibold">{loan.customerName}</td>
                      <td className="table-cell font-sans">{loan.loanType}</td>
                      <td className="table-cell text-right font-bold text-emerald-800 text-sm">
                        ₹{loan.principalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell text-slate-600">
                        {loan.bankDetails?.bankName} ({loan.bankDetails?.accountNumber})
                      </td>
                      <td className="table-cell font-sans">
                        <StatusBadge status={loan.status} />
                      </td>
                      <td className="table-cell text-right">
                        <button
                          onClick={() => setShowDisburseModal(loan)}
                          className="btn-success py-1.5 px-4 text-xs uppercase bg-emerald-800 hover:bg-emerald-900 border-emerald-800 cursor-pointer font-bold font-sans"
                        >
                          Disburse Funds →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. CUSTOMER COMPONENT: ACTIVE LOANS & MONTH-BY-MONTH EMI SCHEDULE */}
        <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-slate-900" />
              <h2 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
                4. Customer Active Loans & EMI Amortization Schedule (Pay Online)
              </h2>
            </div>

            {loans.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="font-bold text-slate-700">Select Loan:</label>
                <select
                  value={selectedLoanId}
                  onChange={(e) => setSelectedLoanId(e.target.value)}
                  className="input-field py-1 px-3 text-xs font-mono font-bold cursor-pointer"
                >
                  {loans.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.loanNumber} — {l.customerName} ({l.loanType} • ₹{l.principalAmount?.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {currentLoan ? (
            <div className="p-4 mx-4 bg-slate-900 text-white font-mono grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <span className="text-slate-400 text-[10px] block">Loan Principal</span>
                <strong className="text-sm font-bold text-white">₹{currentLoan.principalAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Monthly EMI</span>
                <strong className="text-sm font-bold text-emerald-400">₹{currentLoan.emiAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Remaining Principal</span>
                <strong className="text-sm font-bold text-amber-400">₹{currentLoan.remainingPrincipal?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Interest Rate</span>
                <strong className="text-sm font-bold text-white">{currentLoan.annualInterestRate}% p.a.</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Repayment Progress</span>
                <strong className="text-sm font-bold text-white">{currentLoan.paidEmisCount || 0} / {currentLoan.totalEmisCount} EMIs</strong>
              </div>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header text-center">EMI #</th>
                  <th className="table-header">Scheduled Due Date</th>
                  <th className="table-header text-right">Installment (₹)</th>
                  <th className="table-header text-right">Principal Portion</th>
                  <th className="table-header text-right">Interest Portion</th>
                  <th className="table-header text-right">Remaining Balance</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Pay Installment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium font-mono">
                {schedule.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                      No active loan amortization schedule yet. When Admin disburses an approved loan, the installment schedule generates here!
                    </td>
                  </tr>
                ) : (
                  schedule.map((item) => (
                    <tr key={item.id} className={`hover:bg-slate-50 ${item.status === 'PAID' ? 'bg-emerald-50/40' : ''}`}>
                      <td className="table-cell text-center font-bold text-slate-900">{item.emiNumber}</td>
                      <td className="table-cell">{item.dueDate}</td>
                      <td className="table-cell text-right font-bold text-slate-900">₹{item.emiAmount?.toLocaleString('en-IN')}</td>
                      <td className="table-cell text-right text-slate-600">₹{item.principalComponent?.toLocaleString('en-IN')}</td>
                      <td className="table-cell text-right text-slate-600">₹{item.interestComponent?.toLocaleString('en-IN')}</td>
                      <td className="table-cell text-right font-bold text-slate-900">₹{item.remainingBalance?.toLocaleString('en-IN')}</td>
                      <td className="table-cell font-sans">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="table-cell text-right">
                        {item.status === 'PAID' ? (
                          <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1 font-sans">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setPayingEmi(item)}
                            className="btn-primary py-1 px-3 text-[10px] uppercase bg-emerald-700 hover:bg-emerald-800 border-emerald-700 cursor-pointer font-sans font-bold"
                          >
                            Pay EMI →
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. INTERACTIVE EMI CALCULATOR TOOL */}
        <div className="border border-slate-200 bg-white p-6 space-y-4 text-xs shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Interactive Monthly Repayment Calculator</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loan Principal (₹): <strong>₹{calcAmount.toLocaleString('en-IN')}</strong></label>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={50000}
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tenure: <strong>{calcTenure} Months ({Math.round(calcTenure / 12)} Yrs)</strong></label>
              <input
                type="range"
                min={12}
                max={120}
                step={12}
                value={calcTenure}
                onChange={(e) => setCalcTenure(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Annual Interest Rate: <strong>{calcRate}% p.a.</strong></label>
              <input
                type="range"
                min={8.0}
                max={18.0}
                step={0.5}
                value={calcRate}
                onChange={(e) => setCalcRate(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-white font-mono flex justify-between items-center">
            <span>Calculated Monthly Installment:</span>
            <strong className="text-xl text-emerald-400 font-bold">₹{calcEmi.toLocaleString('en-IN')} / month</strong>
          </div>
        </div>
      </main>

      {/* INSPECT & UNDERWRITE MODAL */}
      {selectedApp && !showApproveModal && !showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full border border-slate-300 p-6 space-y-5 text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Underwriting Audit Screen</span>
                <h3 className="font-bold text-base text-slate-900">{selectedApp.applicationNumber} — {selectedApp.customerName}</h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-black font-bold p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-slate-900 text-white font-mono text-[11px]">
              <div>
                <span className="text-slate-400 text-[9px] block">CIBIL</span>
                <strong className="text-emerald-400 font-bold">{selectedApp.creditAssessment?.creditScore || 780}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] block">DTI Ratio</span>
                <strong className="text-white">{selectedApp.creditAssessment?.dtiRatio || 29}%</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] block">Income</span>
                <strong className="text-white">₹{selectedApp.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] block">Rating</span>
                <StatusBadge status={selectedApp.creditAssessment?.eligibilityStatus || 'ELIGIBLE'} />
              </div>
            </div>

            {/* Document Verify Controls */}
            <div className="space-y-2 border border-slate-200 p-3">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">Verify Uploaded KYC Documents:</span>
              <div className="space-y-1.5 font-mono">
                {Object.entries(selectedApp.documents || {}).map(([key, doc]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-200">
                    <div>
                      <strong className="text-slate-900 uppercase text-[11px] block">{key}</strong>
                      <span className="text-slate-500 text-[10px]">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={doc.status || 'PENDING'} />
                      <button
                        onClick={() => handleVerifyDoc(selectedApp.id, key, 'VERIFIED')}
                        className="btn-success py-1 px-2 text-[10px] uppercase font-bold"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleVerifyDoc(selectedApp.id, key, 'REJECTED')}
                        className="btn-danger py-1 px-2 text-[10px] uppercase font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Action Buttons */}
            {selectedApp.status === 'PENDING_REVIEW' && (
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="btn-danger py-2 px-4 text-xs uppercase font-bold"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="btn-success py-2 px-5 text-xs uppercase font-bold bg-emerald-700 hover:bg-emerald-800"
                >
                  Approve Loan & Notify Customer →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPROVE LOAN MODAL */}
      {showApproveModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleApprove} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 uppercase">Approve & Sanction {selectedApp.applicationNumber}</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Approved Amount (₹)</label>
              <input
                type="number"
                required
                value={approveForm.approvedAmount}
                onChange={(e) => setApproveForm({ ...approveForm, approvedAmount: parseInt(e.target.value) || 0 })}
                className="input-field font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Approved Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={approveForm.annualRate}
                onChange={(e) => setApproveForm({ ...approveForm, annualRate: parseFloat(e.target.value) || 12.0 })}
                className="input-field font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Remarks & Sanction Notes</label>
              <textarea
                rows={2}
                required
                value={approveForm.adminRemarks}
                onChange={(e) => setApproveForm({ ...approveForm, adminRemarks: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowApproveModal(false)} className="btn-secondary py-1.5 px-3">Cancel</button>
              <button type="submit" className="btn-success py-1.5 px-5 uppercase font-bold bg-emerald-700">Confirm Approval & Send Notification →</button>
            </div>
          </form>
        </div>
      )}

      {/* REJECT LOAN MODAL */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleReject} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 uppercase">Reject Application {selectedApp.applicationNumber}</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Decline Reason</label>
              <select
                value={rejectForm.rejectionReason}
                onChange={(e) => setRejectForm({ ...rejectForm, rejectionReason: e.target.value })}
                className="input-field cursor-pointer font-semibold"
              >
                <option value="Insufficient Income">Insufficient In-Hand Income</option>
                <option value="Low Credit Score">Low CIBIL Credit Score (&lt;600)</option>
                <option value="Debt-to-Income Exceeded">Debt-to-Income Exceeded (&gt;65%)</option>
                <option value="Invalid Documents">Invalid Documents</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
              <textarea
                rows={2}
                required
                value={rejectForm.adminRemarks}
                onChange={(e) => setRejectForm({ ...rejectForm, adminRemarks: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowRejectModal(false)} className="btn-secondary py-1.5 px-3">Cancel</button>
              <button type="submit" className="btn-danger py-1.5 px-4 uppercase font-bold">Confirm Decline</button>
            </div>
          </form>
        </div>
      )}

      {/* DISBURSE MODAL */}
      {showDisburseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleDisburse} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 uppercase">Disburse Funds for {showDisburseModal.loanNumber}</h3>
            <div className="p-3 bg-slate-50 border border-slate-200 font-mono space-y-1">
              <div>Customer: <strong>{showDisburseModal.customerName}</strong></div>
              <div>Sanctioned Amount: <strong className="text-emerald-800">₹{showDisburseModal.principalAmount?.toLocaleString('en-IN')}</strong></div>
              <div>Bank Account: {showDisburseModal.bankDetails?.bankName} ({showDisburseModal.bankDetails?.accountNumber})</div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Reference / UTR Number</label>
              <input
                type="text"
                required
                value={disburseRef}
                onChange={(e) => setDisburseRef(e.target.value)}
                className="input-field font-mono uppercase font-bold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowDisburseModal(null)} className="btn-secondary py-1.5 px-3">Cancel</button>
              <button type="submit" className="btn-success py-1.5 px-5 uppercase font-bold bg-emerald-800">Confirm Disbursement & Activate →</button>
            </div>
          </form>
        </div>
      )}

      {/* PAY EMI MODAL */}
      {payingEmi && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handlePayEmi} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 uppercase">Pay EMI Installment #{payingEmi.emiNumber}</h3>
            <div className="p-3 bg-slate-50 border border-slate-200 font-mono space-y-1">
              <div>Due Date: {payingEmi.dueDate}</div>
              <div>Amount Due: <strong className="text-emerald-800 text-sm">₹{payingEmi.emiAmount?.toLocaleString('en-IN')}</strong></div>
              <div>Principal Component: ₹{payingEmi.principalComponent?.toLocaleString('en-IN')}</div>
              <div>Interest Component: ₹{payingEmi.interestComponent?.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Payment Gateway</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input-field cursor-pointer font-semibold"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="DEBIT_CARD">Debit Card</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setPayingEmi(null)} className="btn-secondary py-1.5 px-3">Cancel</button>
              <button type="submit" className="btn-primary py-1.5 px-5 uppercase font-bold bg-emerald-700 hover:bg-emerald-800 border-emerald-700">
                Authorize ₹{payingEmi.emiAmount?.toLocaleString('en-IN')} →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
