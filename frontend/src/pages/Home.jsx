import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
 ShieldCheck,
 Zap,
 Lock,
 ArrowRight,
 Calculator,
 UserCheck,
 CheckCircle2,
 FileText,
 BadgeIndianRupee,
 Clock,
 Landmark,
 Building2,
 Car,
 GraduationCap,
 Briefcase,
 User,
 Shield
} from 'lucide-react';

export function Home() {
 // Interactive EMI Calculator State
 const [loanAmount, setLoanAmount] = useState(500000);
 const [tenureYears, setTenureYears] = useState(3);
 const [interestRate, setInterestRate] = useState(12.0);
 const [calculatedEmi, setCalculatedEmi] = useState(16607);
 const [totalInterest, setTotalInterest] = useState(97852);
 const [totalPayment, setTotalPayment] = useState(597852);

 useEffect(() => {
 const p = Number(loanAmount);
 const r = (Number(interestRate) / 12) / 100;
 const n = Number(tenureYears) * 12;

 if (p > 0 && n > 0 && r > 0) {
 const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
 const totPay = emi * n;
 const totInt = totPay - p;

 setCalculatedEmi(emi);
 setTotalPayment(totPay);
 setTotalInterest(totInt);
 }
 }, [loanAmount, tenureYears, interestRate]);

 const loanProducts = [
 {
 title: 'Personal Loan',
 rate: '12.0% p.a.',
 amount: 'Up to ₹25 Lakhs',
 tenure: '12 to 60 Months',
 desc: 'Instant financial liquidity for travel, emergencies, weddings, or personal investments.',
 icon: BadgeIndianRupee
 },
 {
 title: 'Home Loan',
 rate: '8.5% p.a.',
 amount: 'Up to ₹5 Crores',
 tenure: 'Up to 30 Years',
 desc: 'Affordable home financing with lowest interest rates and flexible repayment terms.',
 icon: Landmark
 },
 {
 title: 'Vehicle Loan',
 rate: '9.5% p.a.',
 amount: 'Up to ₹50 Lakhs',
 tenure: 'Up to 7 Years',
 desc: 'Up to 90% on-road financing for two-wheelers and passenger vehicles.',
 icon: Car
 },
 {
 title: 'Education Loan',
 rate: '10.0% p.a.',
 amount: 'Up to ₹1 Crore',
 tenure: 'Up to 10 Years',
 desc: 'Comprehensive funding for global university degrees, tuition, and living stipends.',
 icon: GraduationCap
 },
 {
 title: 'Business Loan',
 rate: '14.0% p.a.',
 amount: 'Up to ₹2 Crores',
 tenure: 'Up to 10 Years',
 desc: 'Working capital and machinery expansion financing for registered businesses.',
 icon: Briefcase
 }
 ];

 return (
 <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
 <Navbar />

 <main className="flex-1 space-y-16 py-8">
 {/* HERO SECTION */}
 <section className="max-w-6xl mx-auto px-4 sm:px-6">
 <div className="border border-slate-900 bg-slate-900 text-white p-8 sm:p-12 space-y-6">
 <div className="space-y-3">
 <span className="text-[10px] font-mono tracking-widest uppercase bg-slate-800 text-emerald-400 px-2 py-0.5 border border-slate-700 font-bold">
 Institutional Lending Platform
 </span>
 <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
 Simple, Fast & Secure Loan Management
 </h1>
 <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-light">
 End- digital lending ecosystem connecting borrowers with institutional underwriters. Complete credit assessment, document audits, approvals, automated EMI schedules, and online payments.
 </p>
 </div>

 {/* Separate Call-To-Action Buttons for Customer and Admin */}
 <div className="pt-2 flex flex-wrap items-center gap-3">
 <Link
 to="/customer-login"
 className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-bold bg-emerald-500 text-slate-950 border-emerald-500 hover:bg-emerald-400 flex items-center gap-1.5"
 >
 <User className="w-3.5 h-3.5" />
 <span>Customer Login</span>
 </Link>

 <Link
 to="/customer-register"
 className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-bold bg-white text-slate-900 border-white hover:bg-slate-100"
 >
 Register as Customer
 </Link>

 <Link
 to="/admin-login"
 className="btn-secondary py-2.5 px-6 text-xs uppercase tracking-wider font-bold text-slate-200 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center gap-1.5"
 >
 <Shield className="w-3.5 h-3.5 text-emerald-400" />
 <span>Admin Login</span>
 </Link>
 </div>

 {/* Platform Credibility Badges */}
 <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400 font-mono">
 <div className="flex items-center space-x-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
 <span>Instant Pre-Approval</span>
 </div>
 <div className="flex items-center space-x-2">
 <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
 <span>Bank-Grade Encryption</span>
 </div>
 <div className="flex items-center space-x-2">
 <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
 <span>24h Fast Disbursement</span>
 </div>
 <div className="flex items-center space-x-2">
 <BadgeIndianRupee className="w-4 h-4 text-emerald-400 shrink-0" />
 <span>Transparent Rates</span>
 </div>
 </div>
 </div>
 </section>

 {/* 5 LOAN TYPES */}
 <section id="loan-types" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
 <div className="border-b border-slate-200 pb-3 flex justify-between items-end">
 <div>
 <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
 Product Catalog
 </span>
 <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
 Loan Products & Annual Interest Rates
 </h2>
 </div>
 <span className="text-xs text-slate-500 font-mono">5 Retail Categories</span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {loanProducts.map((prod) => {
 const Icon = prod.icon;
 return (
 <div key={prod.title} className="border border-slate-200 bg-white p-6 space-y-4 hover:border-slate-400 transition-colors">
 <div className="flex justify-between items-start">
 <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-slate-900">
 <Icon className="w-5 h-5" />
 </div>
 <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
 {prod.rate}
 </span>
 </div>

 <div className="space-y-1">
 <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">{prod.title}</h3>
 <p className="text-xs text-slate-600 leading-relaxed">{prod.desc}</p>
 </div>

 <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
 <div>
 <span className="block text-[10px] text-slate-400">Max Limit</span>
 <strong className="text-slate-900">{prod.amount}</strong>
 </div>
 <div>
 <span className="block text-[10px] text-slate-400">Tenure</span>
 <strong className="text-slate-900">{prod.tenure}</strong>
 </div>
 </div>

 <Link
 to="/customer-login"
 className="btn-secondary w-full py-1.5 text-xs flex items-center justify-center gap-1 mt-2"
 >
 <span>Apply for {prod.title}</span>
 <ArrowRight className="w-3 h-3" />
 </Link>
 </div>
 );
 })}
 </div>
 </section>

 {/* INTERACTIVE EMI CALCULATOR */}
 <section id="calculator" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
 <div className="border-b border-slate-200 pb-3">
 <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
 Financial Planning Tool
 </span>
 <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
 Interactive Monthly EMI Calculator
 </h2>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 <div className="lg:col-span-7 border border-slate-200 bg-white p-6 sm:p-8 space-y-6 text-xs">
 <div className="space-y-3">
 <div className="flex justify-between items-center">
 <label className="font-bold text-slate-700 uppercase">Loan Amount (₹)</label>
 <span className="font-mono text-sm font-bold text-slate-900">₹{loanAmount.toLocaleString('en-IN')}</span>
 </div>
 <input
 type="range"
 min={50000}
 max={5000000}
 step={50000}
 value={loanAmount}
 onChange={(e) => setLoanAmount(Number(e.target.value))}
 className="w-full accent-slate-900 cursor-pointer"
 />
 </div>

 <div className="space-y-3">
 <div className="flex justify-between items-center">
 <label className="font-bold text-slate-700 uppercase">Tenure (Years)</label>
 <span className="font-mono text-sm font-bold text-slate-900">{tenureYears} Years ({tenureYears * 12} Months)</span>
 </div>
 <input
 type="range"
 min={1}
 max={10}
 step={1}
 value={tenureYears}
 onChange={(e) => setTenureYears(Number(e.target.value))}
 className="w-full accent-slate-900 cursor-pointer"
 />
 </div>

 <div className="space-y-3">
 <div className="flex justify-between items-center">
 <label className="font-bold text-slate-700 uppercase">Interest Rate (% p.a.)</label>
 <span className="font-mono text-sm font-bold text-slate-900">{interestRate}%</span>
 </div>
 <input
 type="range"
 min={8.0}
 max={20.0}
 step={0.5}
 value={interestRate}
 onChange={(e) => setInterestRate(Number(e.target.value))}
 className="w-full accent-slate-900 cursor-pointer"
 />
 </div>
 </div>

 <div className="lg:col-span-5 border border-slate-900 bg-slate-900 text-white p-6 sm:p-8 space-y-6 text-xs">
 <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
 Repayment Breakdown
 </span>

 <div className="space-y-1">
 <span className="text-slate-400 text-xs block">Monthly Installment (EMI)</span>
 <div className="text-3xl font-bold font-mono text-emerald-400">
 ₹{calculatedEmi.toLocaleString('en-IN')}
 <span className="text-xs text-slate-400 font-normal"> / month</span>
 </div>
 </div>

 <div className="pt-4 border-t border-slate-800 space-y-2 font-mono text-xs text-slate-300">
 <div className="flex justify-between">
 <span>Principal Amount:</span>
 <strong className="text-white">₹{loanAmount.toLocaleString('en-IN')}</strong>
 </div>
 <div className="flex justify-between">
 <span>Total Interest:</span>
 <strong className="text-amber-400">₹{totalInterest.toLocaleString('en-IN')}</strong>
 </div>
 <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800 text-white">
 <span>Total Amount Payable:</span>
 <strong className="text-emerald-400">₹{totalPayment.toLocaleString('en-IN')}</strong>
 </div>
 </div>

 <Link
 to="/customer-login"
 className="btn-primary w-full py-2.5 text-xs uppercase tracking-wider font-bold bg-emerald-500 text-slate-950 border-emerald-500 hover:bg-emerald-400 flex items-center justify-center gap-1.5 mt-4"
 >
 <span>Proceed to Apply →</span>
 </Link>
 </div>
 </div>
 </section>

 {/* 4-STEP HOW IT WORKS */}
 <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
 <div className="border-b border-slate-200 pb-3">
 <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
 Workflow Guide
 </span>
 <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
 How the Loan Approval Process Operates
 </h2>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
 <div className="border border-slate-200 bg-white p-5 space-y-3">
 <div className="w-7 h-7 bg-slate-900 text-white font-mono font-bold flex items-center justify-center">1</div>
 <h3 className="font-bold text-slate-900 uppercase">Apply Online</h3>
 <p className="text-slate-600 leading-relaxed">
 Submit your personal details, income proof, bank account, and KYC documents in under 5 minutes.
 </p>
 </div>

 <div className="border border-slate-200 bg-white p-5 space-y-3">
 <div className="w-7 h-7 bg-slate-900 text-white font-mono font-bold flex items-center justify-center">2</div>
 <h3 className="font-bold text-slate-900 uppercase">Admin Review & KYC</h3>
 <p className="text-slate-600 leading-relaxed">
 Chief Underwriting Officer verifies documents, assesses CIBIL credit score, and validates DTI ratio.
 </p>
 </div>

 <div className="border border-slate-200 bg-white p-5 space-y-3">
 <div className="w-7 h-7 bg-slate-900 text-white font-mono font-bold flex items-center justify-center">3</div>
 <h3 className="font-bold text-slate-900 uppercase">Approval & Payout</h3>
 <p className="text-slate-600 leading-relaxed">
 Loan is sanctioned, customer is notified instantly, and funds are disbursed directly via NEFT/RTGS.
 </p>
 </div>

 <div className="border border-slate-200 bg-white p-5 space-y-3">
 <div className="w-7 h-7 bg-slate-900 text-white font-mono font-bold flex items-center justify-center">4</div>
 <h3 className="font-bold text-slate-900 uppercase">Track & Pay EMIs</h3>
 <p className="text-slate-600 leading-relaxed">
 View monthly amortization schedule, pay installments online via UPI/Card, and download official receipts.
 </p>
 </div>
 </div>
 </section>
 </main>

 <Footer />
 </div>
 );
}
