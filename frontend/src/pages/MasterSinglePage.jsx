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
 LogOut,
 Send,
 Sparkles,
 ChevronRight,
 Sliders,
 Save,
 Car,
 GraduationCap,
 Building2
} from 'lucide-react';

export function MasterSinglePage() {
 const { user, login, register, logout, isAuthenticated } = useAuth();
 const { addToast } = useToast();

 // Navigation Perspective View Filter (Optional Quick Filter, Defaults to ALL in One View)
 const [activeSectionFilter, setActiveSectionFilter] = useState('ALL'); // 'ALL' | 'CUSTOMER' | 'ADMIN' | 'CALCULATOR'

 // Live Database State
 const [adminStats, setAdminStats] = useState(null);
 const [applications, setApplications] = useState([]);
 const [loans, setLoans] = useState([]);
 const [customers, setCustomers] = useState([]);
 const [schedule, setSchedule] = useState([]);
 const [selectedLoanId, setSelectedLoanId] = useState('');
 const [adminNotifications, setAdminNotifications] = useState([]);
 const [customerNotifications, setCustomerNotifications] = useState([]);
 const [settings, setSettings] = useState(null);
 const [loading, setLoading] = useState(false);

 // Authentication Box Inputs
 const [custEmail, setCustEmail] = useState('customer@loan.com');
 const [custPassword, setCustPassword] = useState('customer123');
 const [adminEmail, setAdminEmail] = useState('admin@loan.com');
 const [adminPassword, setAdminPassword] = useState('admin123');
 const [authLoading, setAuthLoading] = useState(false);

 // Modals & Action States
 const [selectedApp, setSelectedApp] = useState(null);
 const [showApproveModal, setShowApproveModal] = useState(false);
 const [showRejectModal, setShowRejectModal] = useState(false);
 const [showDisburseModal, setShowDisburseModal] = useState(null);
 const [payingEmi, setPayingEmi] = useState(null);
 const [collectingEmi, setCollectingEmi] = useState(null);

 // Action Forms
 const [approveForm, setApproveForm] = useState({
 approvedAmount: 500000,
 annualRate: 12.0,
 tenureMonths: 36,
 adminRemarks: 'Income & KYC documents verified. Approved by Credit Committee.'
 });
 const [rejectForm, setRejectForm] = useState({
 rejectionReason: 'Debt-to-Income Exceeded',
 adminRemarks: 'Monthly debt obligations exceed underwriting risk policy limits.'
 });
 const [disburseRef, setDisburseRef] = useState('NEFT-AXIS-992100');
 const [paymentMethod, setPaymentMethod] = useState('UPI');
 const [offlineTxRef, setOfflineTxRef] = useState('CASH-REC-99100');

 // Customer Application Form
 const [applyForm, setApplyForm] = useState({
 fullName: 'Rahul Kumar',
 dob: '1992-05-14',
 gender: 'Male',
 mobile: '+91 98765 11111',
 email: 'customer@loan.com',
 address: 'Flat 302, Green Glen Heights, Bellandur, Bengaluru',
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
 const [calcTotalPayment, setCalcTotalPayment] = useState(597852);
 const [calcTotalInterest, setCalcTotalInterest] = useState(97852);

 // Fetch all live collections simultaneously
 const refreshAllData = async () => {
 setLoading(true);
 try {
 // 1. Admin Telemetry
 const dash = await api.admin.getDashboard().catch(() => null);
 if (dash) setAdminStats(dash);

 // 2. Applications
 const appsRes = await api.admin.getApplications({ limit: 100 }).catch(() => null);
 if (appsRes?.applications) setApplications(appsRes.applications);

 // 3. Loans & EMI Schedules
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

 // 4. Customers Directory
 const custRes = await api.admin.getCustomers().catch(() => null);
 if (custRes?.customers) setCustomers(custRes.customers);

 // 5. Settings
 const setRes = await api.admin.getSettings().catch(() => null);
 if (setRes?.settings) setSettings(setRes.settings);

 // 6. Dual Notifications (Admin & Customer)
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
 if (p > 0 && n > 0 && r > 0) {
 const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
 const tot = emi * n;
 setCalcEmi(emi);
 setCalcTotalPayment(tot);
 setCalcTotalInterest(tot - p);
 }
 }, [calcAmount, calcTenure, calcRate]);

 // Customer Login Handler
 const handleCustomerLogin = async (e) => {
 e.preventDefault();
 setAuthLoading(true);
 try {
 const res = await login(custEmail, custPassword);
 addToast('Customer Authenticated', `Welcome, ${res.user?.fullName}!`, 'success');
 refreshAllData();
 } catch (err) {
 addToast('Customer Login Failed', err.message, 'error');
 } finally {
 setAuthLoading(false);
 }
 };

 // Admin Login Handler
 const handleAdminLogin = async (e) => {
 e.preventDefault();
 setAuthLoading(true);
 try {
 const res = await login(adminEmail, adminPassword);
 addToast('Admin Authenticated', `Welcome, Chief Underwriting Officer!`, 'success');
 refreshAllData();
 } catch (err) {
 addToast('Admin Login Failed', err.message, 'error');
 } finally {
 setAuthLoading(false);
 }
 };

 // 1. CUSTOMER: Submit Loan Application -> Sends Notification to Admin
 const handleApplySubmit = async (e) => {
 e.preventDefault();
 if (!applyForm.fullName || !applyForm.mobile || !applyForm.requestedAmount || !applyForm.bankName) {
 addToast('Incomplete Form', 'Please fill all required personal and financial fields.', 'error');
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
 loanPurpose: applyForm.loanPurpose || 'Personal Investment'
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
 `Application ${res.application?.applicationNumber} queued! Admin has received an incoming alert.`,
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
 addToast('Document Status', `${docType} marked as ${status}.`, 'success');
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
 'Loan Approved & Sanctioned!',
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
 addToast('Application Declined', `Application ${selectedApp.applicationNumber} REJECTED. Customer notified.`, 'error');
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
 addToast('Funds Disbursed!', `Loan ${showDisburseModal.loanNumber} is ACTIVE. 36-Month EMI Schedule generated!`, 'success');
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

 // 7. ADMIN: Collect Offline Branch Payment
 const handleCollectOffline = async (e) => {
 e.preventDefault();
 if (!collectingEmi) return;
 try {
 const res = await api.admin.collectOfflineEmi(collectingEmi.id, {
 paymentMethod: 'CASH',
 transactionRef: offlineTxRef
 });
 addToast('Branch Collection Recorded', res.message, 'success');
 setCollectingEmi(null);
 refreshAllData();
 } catch (err) {
 addToast('Error', err.message, 'error');
 }
 };

 // 8. ADMIN: Save Interest Rate Settings
 const handleSaveSettings = async (e) => {
 e.preventDefault();
 if (!settings) return;
 try {
 await api.admin.updateSettings(settings);
 addToast('Settings Saved', 'Base interest rates and underwriting thresholds updated.', 'success');
 refreshAllData();
 } catch (err) {
 addToast('Error', err.message, 'error');
 }
 };

 const metrics = adminStats?.metrics || {};
 const currentLoan = loans.find(l => l.id === selectedLoanId) || loans[0];

 return (
 <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
 {/* 1. TOP HEADER & BRAND BAR */}
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
 All-In-One Unified Lending Workspace
 </span>
 </div>
 </div>

 <div className="flex items-center space-x-3 text-xs font-mono">
 {isAuthenticated ? (
 <div className="flex items-center gap-2">
 <span className="text-slate-300 hidden sm:inline">
 Active: <strong className="text-white font-bold">{user?.fullName} ({user?.role})</strong>
 </span>
 <button
 onClick={logout}
 className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 cursor-pointer text-[11px]"
 >
 Sign Out
 </button>
 </div>
 ) : (
 <span className="text-slate-400 text-xs hidden sm:inline">Guest Mode (Login Below)</span>
 )}

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

 {/* MAIN SINGLE-PAGE CANVASS */}
 <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
 {/* HERO SECTION */}
 <div className="border border-slate-900 bg-slate-900 text-white p-6 sm:p-8 space-y-4 shadow-sm">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div className="space-y-1">
 <span className="text-[10px] font-mono tracking-widest uppercase bg-slate-800 text-emerald-400 px-2 py-0.5 border border-slate-700 font-bold">
 Complete Interactive Ecosystem
 </span>
 <h1 className="text-xl sm:text-3xl font-bold uppercase tracking-wider text-white">
 Simple, Fast & Secure Loan Management
 </h1>
 </div>

 {/* Jump Navigation Pills */}
 <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
 <a href="#customer-section" className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-bold">
 ↓ Customer Workspace
 </a>
 <a href="#admin-section" className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold">
 ↓ Admin Console
 </a>
 <a href="#calculator-section" className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold">
 ↓ Calculator
 </a>
 </div>
 </div>

 <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed font-light">
 Everything is available on this single page: <strong>Customer Login</strong>, <strong>Admin Login</strong>, <strong>Loan Application Submission</strong>, <strong>Real-time Dual Notifications</strong>, <strong>KYC Underwriting & Approvals</strong>, <strong>Disbursements</strong>, and <strong>Interactive Online EMI Payments</strong>.
 </p>
 </div>

 {/* 2. DEDICATED SEPARATE LOGIN SECTIONS (CUSTOMER & ADMIN SIDE-BY-SIDE) */}
 <div id="login-sections" className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
 {/* Customer Login Card */}
 <div className="border border-slate-300 bg-white p-6 space-y-4 shadow-sm">
 <div className="flex justify-between items-center border-b border-slate-200 pb-2">
 <div className="flex items-center gap-2">
 <User className="w-4 h-4 text-emerald-700" />
 <h2 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
 Customer / Borrower Sign In
 </h2>
 </div>
 <button
 type="button"
 onClick={() => { setCustEmail('customer@loan.com'); setCustPassword('customer123'); }}
 className="text-[10px] font-mono font-bold bg-slate-100 text-slate-900 hover:bg-slate-200 px-2 py-0.5 border border-slate-300 cursor-pointer"
 >
 1-Click Auto-Fill
 </button>
 </div>

 <form onSubmit={handleCustomerLogin} className="space-y-3">
 <div>
 <label className="block font-semibold text-slate-700 mb-1">Customer Email Address</label>
 <input
 type="email"
 required
 value={custEmail}
 onChange={(e) => setCustEmail(e.target.value)}
 className="input-field font-mono"
 />
 </div>

 <div>
 <label className="block font-semibold text-slate-700 mb-1">Account Password</label>
 <input
 type="password"
 required
 value={custPassword}
 onChange={(e) => setCustPassword(e.target.value)}
 className="input-field font-mono"
 />
 </div>

 <button
 type="submit"
 disabled={authLoading}
 className="btn-primary w-full py-2 text-xs uppercase tracking-wider font-bold bg-emerald-700 hover:bg-emerald-800 border-emerald-700 cursor-pointer"
 >
 Sign In as Customer →
 </button>
 </form>
 <p className="text-[10px] text-slate-500 font-mono text-center">
 Demo Credentials: <strong>customer@loan.com</strong> / <strong>customer123</strong>
 </p>
 </div>

 {/* Admin Login Card */}
 <div className="border border-slate-700 bg-slate-900 text-white p-6 space-y-4 shadow-sm">
 <div className="flex justify-between items-center border-b border-slate-800 pb-2">
 <div className="flex items-center gap-2">
 <Shield className="w-4 h-4 text-emerald-400" />
 <h2 className="font-bold uppercase tracking-wider text-white text-sm">
 Admin Underwriter Sign In
 </h2>
 </div>
 <button
 type="button"
 onClick={() => { setAdminEmail('admin@loan.com'); setAdminPassword('admin123'); }}
 className="text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 hover:bg-slate-700 px-2 py-0.5 border border-slate-700 cursor-pointer"
 >
 1-Click Auto-Fill
 </button>
 </div>

 <form onSubmit={handleAdminLogin} className="space-y-3 text-xs">
 <div>
 <label className="block font-semibold text-slate-300 mb-1">Executive Email Address</label>
 <input
 type="email"
 required
 value={adminEmail}
 onChange={(e) => setAdminEmail(e.target.value)}
 className="input-field font-mono text-slate-900"
 />
 </div>

 <div>
 <label className="block font-semibold text-slate-300 mb-1">Security Key / Password</label>
 <input
 type="password"
 required
 value={adminPassword}
 onChange={(e) => setAdminPassword(e.target.value)}
 className="input-field font-mono text-slate-900"
 />
 </div>

 <button
 type="submit"
 disabled={authLoading}
 className="btn-primary w-full py-2 text-xs uppercase tracking-wider font-bold bg-emerald-500 text-slate-950 border-emerald-500 hover:bg-emerald-400 cursor-pointer"
 >
 Sign In as Admin Underwriter →
 </button>
 </form>
 <p className="text-[10px] text-slate-400 font-mono text-center">
 Admin Credentials: <strong>admin@loan.com</strong> / <strong>admin123</strong>
 </p>
 </div>
 </div>

 {/* 3. DUAL LIVE NOTIFICATION FEEDS (ADMIN & CUSTOMER SIDE-BY-SIDE) */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
 {/* Admin Notifications Box */}
 <div className="border border-amber-300 bg-amber-50 p-5 space-y-3 shadow-sm">
 <div className="flex justify-between items-center border-b border-amber-200 pb-2">
 <div className="flex items-center gap-2">
 <Shield className="w-4 h-4 text-amber-800" />
 <h3 className="font-bold uppercase tracking-wider text-amber-900 text-xs">
 ️ Admin Incoming Underwriting Alerts ({adminNotifications.length})
 </h3>
 </div>
 <span className="text-[10px] font-mono text-amber-700 font-bold">Live Stream</span>
 </div>

 <div className="space-y-2 max-h-40 overflow-y-auto font-mono">
 {adminNotifications.length === 0 ? (
 <div className="p-3 bg-white border border-amber-200 text-slate-500 text-center text-xs font-sans">
 No incoming applications yet. Fill the loan form below to trigger an instant admin notification!
 </div>
 ) : (
 adminNotifications.map((n) => (
 <div key={n.id} className="p-2.5 bg-white border border-amber-200 space-y-0.5">
 <div className="flex justify-between items-baseline font-sans">
 <strong className="text-slate-900 font-bold">{n.title}</strong>
 <span className="text-[9px] font-mono text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
 </div>
 <p className="text-slate-600 text-[11px] font-sans leading-relaxed">{n.message}</p>
 </div>
 ))
 )}
 </div>
 </div>

 {/* Customer Notifications Box */}
 <div className="border border-emerald-300 bg-emerald-50 p-5 space-y-3 shadow-sm">
 <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
 <div className="flex items-center gap-2">
 <User className="w-4 h-4 text-emerald-800" />
 <h3 className="font-bold uppercase tracking-wider text-emerald-900 text-xs">
 Customer Notifications & Approval Messages ({customerNotifications.length})
 </h3>
 </div>
 <span className="text-[10px] font-mono text-emerald-700 font-bold">Decision Notices</span>
 </div>

 <div className="space-y-2 max-h-40 overflow-y-auto font-mono">
 {customerNotifications.length === 0 ? (
 <div className="p-3 bg-white border border-emerald-200 text-slate-500 text-center text-xs font-sans">
 No customer alerts yet. When Admin approves or disburses your loan, the notification appears here!
 </div>
 ) : (
 customerNotifications.map((n) => (
 <div key={n.id} className="p-2.5 bg-white border border-emerald-200 space-y-0.5">
 <div className="flex justify-between items-baseline font-sans">
 <strong className="text-slate-900 font-bold">{n.title}</strong>
 <span className="text-[9px] font-mono text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
 </div>
 <p className="text-slate-600 text-[11px] font-sans leading-relaxed">{n.message}</p>
 </div>
 ))
 )}
 </div>
 </div>
 </div>

 {/* 4. REAL-TIME TELEMETRY KPI DECK */}
 <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Borrowers</span>
 <div className="text-xl font-bold font-mono text-slate-900">{customers.length || 2}</div>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Applications</span>
 <div className="text-xl font-bold font-mono text-slate-900">{applications.length}</div>
 </div>

 <div className="metric-card bg-amber-50 border-amber-300">
 <span className="text-amber-800 font-bold uppercase text-[10px] block">Pending</span>
 <div className="text-xl font-bold font-mono text-amber-900">{applications.filter(a => a.status === 'PENDING_REVIEW').length}</div>
 </div>

 <div className="metric-card bg-emerald-50 border-emerald-300">
 <span className="text-emerald-800 font-bold uppercase text-[10px] block">Approved</span>
 <div className="text-xl font-bold font-mono text-emerald-900">{applications.filter(a => a.status === 'APPROVED').length}</div>
 </div>

 <div className="metric-card bg-rose-50 border-rose-300">
 <span className="text-rose-800 font-bold uppercase text-[10px] block">Rejected</span>
 <div className="text-xl font-bold font-mono text-rose-900">{applications.filter(a => a.status === 'REJECTED').length}</div>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Active Loans</span>
 <div className="text-xl font-bold font-mono text-slate-900">{loans.filter(l => l.status === 'ACTIVE').length}</div>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">Disbursed Volume</span>
 <div className="text-lg font-bold font-mono text-emerald-800">₹{(metrics.totalDisbursed || 600000).toLocaleString('en-IN')}</div>
 </div>

 <div className="metric-card">
 <span className="text-slate-400 font-bold uppercase text-[10px] block">EMI Collected</span>
 <div className="text-lg font-bold font-mono text-emerald-700">₹{(metrics.totalCollected || 19786).toLocaleString('en-IN')}</div>
 </div>
 </div>

 {/* ========================================================================= */}
 {/* CUSTOMER PORTAL SECTION */}
 {/* ========================================================================= */}
 <div id="customer-section" className="space-y-6">
 <div className="border-b-2 border-emerald-600 pb-2 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <User className="w-6 h-6 text-emerald-700" />
 <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
 Customer Workspace & Actions
 </h2>
 </div>
 <span className="text-xs font-mono font-bold text-emerald-700">Applicant Portal</span>
 </div>

 {/* Form: Apply for Loan */}
 <div className="border border-slate-200 bg-white p-6 space-y-5 text-xs shadow-sm">
 <div className="flex justify-between items-center border-b border-slate-200 pb-3">
 <div className="flex items-center gap-2">
 <FilePlus2 className="w-5 h-5 text-slate-900" />
 <h3 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
 Apply for Loan (Customer Submission)
 </h3>
 </div>
 <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200">
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
 Simulated KYC Attachments: Aadhaar_Card.pdf, PAN_Card.pdf, SalarySlip.pdf
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

 {/* Table: My Submitted Applications */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center">
 <h3 className="font-bold uppercase tracking-wider text-slate-900">
 My Submitted Loan Applications ({applications.length})
 </h3>
 <span className="text-[11px] font-mono text-slate-400">Live Status Tracker</span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr>
 <th className="table-header">Application ID</th>
 <th className="table-header">Loan Type</th>
 <th className="table-header text-right">Requested Principal</th>
 <th className="table-header text-center">Tenure</th>
 <th className="table-header">Submission Date</th>
 <th className="table-header">Status</th>
 <th className="table-header">Admin Decision Remarks</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium">
 {applications.length === 0 ? (
 <tr>
 <td colSpan={7} className="py-6 text-center text-slate-400 font-mono">
 No loan applications submitted yet.
 </td>
 </tr>
 ) : (
 applications.map((app) => (
 <tr key={app.id} className="hover:bg-slate-50">
 <td className="table-cell font-mono font-bold text-slate-900">{app.applicationNumber}</td>
 <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
 <td className="table-cell text-right font-mono font-bold text-slate-900">
 ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
 </td>
 <td className="table-cell text-center font-mono">{app.loanDetails?.tenureMonths} Mos</td>
 <td className="table-cell font-mono text-slate-500">{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
 <td className="table-cell">
 <StatusBadge status={app.status} />
 </td>
 <td className="table-cell text-slate-600 font-mono text-[11px]">
 {app.adminRemarks || (app.status === 'PENDING_REVIEW' ? 'Under review by underwriting committee' : '—')}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Customer Active Loans & EMI Schedule with Online Pay */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
 <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="flex items-center gap-2">
 <CalendarDays className="w-5 h-5 text-slate-900" />
 <h3 className="font-bold uppercase tracking-wider text-slate-900">
 Active Loan Portfolio & Month-by-Month Amortization Schedule
 </h3>
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

 {currentLoan && (
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
 )}

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
 <th className="table-header text-right">Online Payment</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium font-mono">
 {schedule.length === 0 ? (
 <tr>
 <td colSpan={8} className="py-6 text-center text-slate-400 font-sans">
 No active amortization schedule yet. When Admin disburses an approved loan, the schedule appears here!
 </td>
 </tr>
 ) : (
 schedule.map((item) => (
 <tr key={item.id} className={`hover:bg-slate-50 ${item.status === 'PAID' ? 'bg-emerald-50' : ''}`}>
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
 </div>

 {/* ========================================================================= */}
 {/* ADMIN PORTAL SECTION */}
 {/* ========================================================================= */}
 <div id="admin-section" className="space-y-6 pt-6">
 <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Shield className="w-6 h-6 text-slate-900" />
 <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
 Admin Underwriting & Operations Console
 </h2>
 </div>
 <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5">Chief Underwriter</span>
 </div>

 {/* Admin Applications Queue & Underwriting Engine */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center">
 <h3 className="font-bold uppercase tracking-wider text-slate-900">
 Applications Underwriting Queue ({applications.length})
 </h3>
 <span className="text-[11px] font-mono text-slate-400">KYC Verification & Decision Engine</span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr>
 <th className="table-header">Application ID</th>
 <th className="table-header">Applicant</th>
 <th className="table-header">Loan Type</th>
 <th className="table-header text-right">Requested Principal</th>
 <th className="table-header text-center">Tenure</th>
 <th className="table-header text-center">CIBIL Score</th>
 <th className="table-header">Status</th>
 <th className="table-header text-right">Underwriting Decision</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium">
 {applications.length === 0 ? (
 <tr>
 <td colSpan={8} className="py-6 text-center text-slate-400 font-mono">
 No applications in underwriting queue.
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
 <span>Audit & Decide</span>
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

 {/* Admin Disbursements Queue */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center">
 <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
 <Banknote className="w-4 h-4 text-emerald-700" />
 <span>Sanctioned Loans Payout & Disbursements Queue ({loans.filter(l => l.status === 'APPROVED').length})</span>
 </h3>
 <span className="text-[11px] font-mono text-slate-400">NEFT / RTGS Transfers</span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr>
 <th className="table-header">Loan ID</th>
 <th className="table-header">Customer Name</th>
 <th className="table-header">Loan Type</th>
 <th className="table-header text-right">Sanctioned Amount</th>
 <th className="table-header">Beneficiary Bank</th>
 <th className="table-header">Status</th>
 <th className="table-header text-right">Disburse Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium font-mono">
 {loans.filter(l => l.status === 'APPROVED').length === 0 ? (
 <tr>
 <td colSpan={7} className="py-6 text-center text-slate-400 font-sans">
 No approved loans waiting for disbursement.
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

 {/* Admin EMI Collections & Overdue Management */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center">
 <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
 <Receipt className="w-4 h-4 text-slate-900" />
 <span>EMI Collections & Overdue Recovery</span>
 </h3>
 <span className="text-[11px] font-mono text-slate-400">All Scheduled Maturities</span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr>
 <th className="table-header">Loan #</th>
 <th className="table-header">Borrower Name</th>
 <th className="table-header text-center">EMI #</th>
 <th className="table-header">Due Date</th>
 <th className="table-header text-right">Installment Amount</th>
 <th className="table-header">Status</th>
 <th className="table-header text-right">Record Offline Receipt</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium font-mono">
 {schedule.length === 0 ? (
 <tr>
 <td colSpan={7} className="py-6 text-center text-slate-400 font-sans">
 No active maturities recorded.
 </td>
 </tr>
 ) : (
 schedule.slice(0, 5).map((s) => (
 <tr key={s.id} className="hover:bg-slate-50">
 <td className="table-cell font-bold text-slate-900">{currentLoan?.loanNumber}</td>
 <td className="table-cell font-sans font-semibold">{currentLoan?.customerName}</td>
 <td className="table-cell text-center">#{s.emiNumber}</td>
 <td className="table-cell">{s.dueDate}</td>
 <td className="table-cell text-right font-bold text-slate-900">₹{s.emiAmount?.toLocaleString('en-IN')}</td>
 <td className="table-cell font-sans">
 <StatusBadge status={s.status} />
 </td>
 <td className="table-cell text-right">
 {s.status === 'PAID' ? (
 <span className="text-emerald-700 font-bold text-[11px] font-sans">Collected</span>
 ) : (
 <button
 onClick={() => { setCollectingEmi(s); setOfflineTxRef(`CASH-${Date.now().toString().slice(-5)}`); }}
 className="btn-secondary py-1 px-2.5 text-[10px] uppercase cursor-pointer font-sans font-bold"
 >
 Record Cash / Cheque
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

 {/* Admin Borrowers Directory */}
 <div className="border border-slate-200 bg-white space-y-4 text-xs shadow-sm">
 <div className="p-4 border-b border-slate-200 flex justify-between items-center">
 <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
 <Users className="w-4 h-4 text-slate-900" />
 <span>Registered Borrowers & Customer Directory ({customers.length})</span>
 </h3>
 <span className="text-[11px] font-mono text-slate-400">KYC Verified Profiles</span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr>
 <th className="table-header">Customer Name</th>
 <th className="table-header">Contact & Email</th>
 <th className="table-header text-right">Monthly Income</th>
 <th className="table-header text-center">CIBIL Rating</th>
 <th className="table-header text-center">Active Loans</th>
 <th className="table-header text-right">Total Borrowed</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium">
 {customers.map((c) => (
 <tr key={c.id} className="hover:bg-slate-50 font-mono">
 <td className="table-cell font-sans font-bold text-slate-900">{c.fullName}</td>
 <td className="table-cell text-slate-600">
 <span>{c.email}</span>
 <span className="block text-[10px] text-slate-400">{c.phone}</span>
 </td>
 <td className="table-cell text-right font-bold text-slate-900">
 ₹{c.monthlyIncome?.toLocaleString('en-IN')}
 </td>
 <td className="table-cell text-center font-bold text-emerald-800">
 {c.creditScore || 780} / 900
 </td>
 <td className="table-cell text-center font-bold">{c.activeLoansCount || 0}</td>
 <td className="table-cell text-right font-bold text-emerald-800">
 ₹{(c.totalBorrowed || 0).toLocaleString('en-IN')}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Admin Interest Rates Settings Configuration */}
 {settings && (
 <div className="border border-slate-200 bg-white p-6 space-y-4 text-xs shadow-sm">
 <div className="flex justify-between items-center border-b border-slate-200 pb-3">
 <div className="flex items-center gap-2">
 <Sliders className="w-4 h-4 text-slate-900" />
 <h3 className="font-bold uppercase tracking-wider text-slate-900">
 Lending Parameters & Base Interest Rates Configuration
 </h3>
 </div>
 <button
 type="button"
 onClick={handleSaveSettings}
 className="btn-primary py-1.5 px-4 text-xs uppercase flex items-center gap-1 cursor-pointer font-bold"
 >
 <Save className="w-3.5 h-3.5" />
 <span>Save Configuration</span>
 </button>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
 {Object.entries(settings.interestRates || {}).map(([key, val]) => (
 <div key={key}>
 <label className="block font-semibold text-slate-700 mb-1">{key} (% p.a.)</label>
 <input
 type="number"
 step="0.1"
 value={val}
 onChange={(e) => setSettings({
 ...settings,
 interestRates: { ...settings.interestRates, [key]: parseFloat(e.target.value) || 0 }
 })}
 className="input-field font-mono font-bold"
 />
 </div>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* ========================================================================= */}
 {/* INTERACTIVE EMI CALCULATOR TOOL SECTION */}
 {/* ========================================================================= */}
 <div id="calculator-section" className="border border-slate-200 bg-white p-6 sm:p-8 space-y-6 text-xs shadow-sm">
 <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-slate-900 font-bold uppercase tracking-wider">
 <Calculator className="w-5 h-5" />
 <h2 className="text-sm font-bold uppercase tracking-wider">
 Interactive Loan Amortization & Repayment Calculator
 </h2>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 <div className="lg:col-span-7 space-y-5">
 <div className="space-y-2">
 <div className="flex justify-between items-center">
 <label className="font-bold text-slate-700 uppercase">Loan Principal (₹)</label>
 <span className="font-mono text-sm font-bold text-slate-900">₹{calcAmount.toLocaleString('en-IN')}</span>
 </div>
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

 <div className="space-y-2">
 <div className="flex justify-between items-center">
 <label className="font-bold text-slate-700 uppercase">Tenure (Months)</label>
 <span className="font-mono text-sm font-bold text-slate-900">{calcTenure} Months ({Math.round(calcTenure / 12)} Yrs)</span>
 </div>
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

 <div className="space-y-2">
 <div className="flex justify-between items-center">
 <label className="font-bold text-slate-700 uppercase">Annual Interest Rate (% p.a.)</label>
 <span className="font-mono text-sm font-bold text-slate-900">{calcRate}%</span>
 </div>
 <input
 type="range"
 min={8.0}
 max={20.0}
 step={0.5}
 value={calcRate}
 onChange={(e) => setCalcRate(Number(e.target.value))}
 className="w-full accent-slate-900 cursor-pointer"
 />
 </div>
 </div>

 <div className="lg:col-span-5 bg-slate-900 text-white p-6 space-y-4 font-mono">
 <span className="text-[10px] uppercase text-slate-400 tracking-widest block font-bold">Repayment Estimate</span>
 <div>
 <span className="text-slate-400 text-xs block">Monthly Installment (EMI)</span>
 <div className="text-3xl font-bold text-emerald-400 font-mono">
 ₹{calcEmi.toLocaleString('en-IN')}
 <span className="text-xs text-slate-400 font-normal"> / month</span>
 </div>
 </div>

 <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
 <div className="flex justify-between">
 <span>Principal:</span>
 <strong className="text-white">₹{calcAmount.toLocaleString('en-IN')}</strong>
 </div>
 <div className="flex justify-between">
 <span>Total Interest:</span>
 <strong className="text-amber-400">₹{calcTotalInterest.toLocaleString('en-IN')}</strong>
 </div>
 <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800 text-white">
 <span>Total Payable:</span>
 <strong className="text-emerald-400">₹{calcTotalPayment.toLocaleString('en-IN')}</strong>
 </div>
 </div>
 </div>
 </div>
 </div>
 </main>

 {/* ========================================================================= */}
 {/* MODALS: UNDERWRITING, APPROVAL, REJECTION, DISBURSEMENTS, PAY EMI */}
 {/* ========================================================================= */}

 {/* INSPECT & AUDIT APPLICATION MODAL */}
 {selectedApp && !showApproveModal && !showRejectModal && (
 <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
 <div className="bg-white max-w-2xl w-full border border-slate-300 p-6 space-y-5 text-xs max-h-[90vh] overflow-y-auto font-sans">
 <div className="flex justify-between items-start border-b border-slate-200 pb-3">
 <div>
 <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Underwriting Audit Screen</span>
 <h3 className="font-bold text-base text-slate-900">{selectedApp.applicationNumber} — {selectedApp.customerName}</h3>
 </div>
 <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer">
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
 className="btn-success py-1 px-2 text-[10px] uppercase font-bold cursor-pointer"
 >
 Verify
 </button>
 <button
 onClick={() => handleVerifyDoc(selectedApp.id, key, 'REJECTED')}
 className="btn-danger py-1 px-2 text-[10px] uppercase font-bold cursor-pointer"
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
 className="btn-danger py-2 px-4 text-xs uppercase font-bold cursor-pointer"
 >
 Reject Application
 </button>
 <button
 onClick={() => setShowApproveModal(true)}
 className="btn-success py-2 px-5 text-xs uppercase font-bold bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
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
 <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
 <form onSubmit={handleApprove} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs font-sans">
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
 <button type="button" onClick={() => setShowApproveModal(false)} className="btn-secondary py-1.5 px-3 cursor-pointer">Cancel</button>
 <button type="submit" className="btn-success py-1.5 px-5 uppercase font-bold bg-emerald-700 cursor-pointer">Confirm Approval & Send Alert →</button>
 </div>
 </form>
 </div>
 )}

 {/* REJECT LOAN MODAL */}
 {showRejectModal && selectedApp && (
 <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
 <form onSubmit={handleReject} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs font-sans">
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
 <button type="button" onClick={() => setShowRejectModal(false)} className="btn-secondary py-1.5 px-3 cursor-pointer">Cancel</button>
 <button type="submit" className="btn-danger py-1.5 px-4 uppercase font-bold cursor-pointer">Confirm Decline</button>
 </div>
 </form>
 </div>
 )}

 {/* DISBURSE MODAL */}
 {showDisburseModal && (
 <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
 <form onSubmit={handleDisburse} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs font-sans">
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
 <button type="button" onClick={() => setShowDisburseModal(null)} className="btn-secondary py-1.5 px-3 cursor-pointer">Cancel</button>
 <button type="submit" className="btn-success py-1.5 px-5 uppercase font-bold bg-emerald-800 cursor-pointer">Confirm Disbursement & Activate →</button>
 </div>
 </form>
 </div>
 )}

 {/* PAY EMI MODAL (CUSTOMER) */}
 {payingEmi && (
 <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
 <form onSubmit={handlePayEmi} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs font-sans">
 <h3 className="font-bold text-base text-slate-900 uppercase">Pay EMI Installment #{payingEmi.emiNumber}</h3>
 <div className="p-3 bg-slate-50 border border-slate-200 font-mono space-y-1">
 <div>Due Date: {payingEmi.dueDate}</div>
 <div>Amount Due: <strong className="text-emerald-800 text-sm">₹{payingEmi.emiAmount?.toLocaleString('en-IN')}</strong></div>
 <div>Principal Portion: ₹{payingEmi.principalComponent?.toLocaleString('en-IN')}</div>
 <div>Interest Portion: ₹{payingEmi.interestComponent?.toLocaleString('en-IN')}</div>
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
 <button type="button" onClick={() => setPayingEmi(null)} className="btn-secondary py-1.5 px-3 cursor-pointer">Cancel</button>
 <button type="submit" className="btn-primary py-1.5 px-5 uppercase font-bold bg-emerald-700 hover:bg-emerald-800 border-emerald-700 cursor-pointer">
 Authorize ₹{payingEmi.emiAmount?.toLocaleString('en-IN')} →
 </button>
 </div>
 </form>
 </div>
 )}

 {/* COLLECT OFFLINE BRANCH PAYMENT MODAL (ADMIN) */}
 {collectingEmi && (
 <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
 <form onSubmit={handleCollectOffline} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-4 text-xs font-sans">
 <h3 className="font-bold text-base text-slate-900 uppercase">Record Branch Payment for #{collectingEmi.emiNumber}</h3>
 <div className="p-3 bg-slate-50 border border-slate-200 font-mono space-y-1">
 <div>Borrower: <strong>{currentLoan?.customerName}</strong></div>
 <div>Due Date: {collectingEmi.dueDate}</div>
 <div>Amount: <strong className="text-emerald-800 text-sm">₹{collectingEmi.emiAmount?.toLocaleString('en-IN')}</strong></div>
 </div>
 <div>
 <label className="block font-semibold text-slate-700 mb-1">Cash Receipt / Cheque Ref Number</label>
 <input
 type="text"
 required
 value={offlineTxRef}
 onChange={(e) => setOfflineTxRef(e.target.value)}
 className="input-field font-mono uppercase font-bold"
 />
 </div>
 <div className="flex justify-end gap-2 pt-2">
 <button type="button" onClick={() => setCollectingEmi(null)} className="btn-secondary py-1.5 px-3 cursor-pointer">Cancel</button>
 <button type="submit" className="btn-primary py-1.5 px-5 uppercase font-bold bg-slate-900 cursor-pointer">
 Confirm Cash Receipt →
 </button>
 </div>
 </form>
 </div>
 )}
 </div>
 );
}
