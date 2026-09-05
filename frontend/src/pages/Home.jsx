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
  Shield,
  Workflow,
  ArrowDown
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
      desc: 'Instant financial liquidity for travel, emergencies, medical needs, or personal investments.',
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
      desc: 'Up to 90% on-road financing for two-wheelers, passenger cars, and electric vehicles.',
      icon: Car
    },
    {
      title: 'Education Loan',
      rate: '10.0% p.a.',
      amount: 'Up to ₹1 Crore',
      tenure: 'Up to 10 Years',
      desc: 'Comprehensive funding for global university degrees, tuition fees, and living stipends.',
      icon: GraduationCap
    },
    {
      title: 'Business Loan',
      rate: '14.0% p.a.',
      amount: 'Up to ₹2 Crores',
      tenure: 'Up to 10 Years',
      desc: 'Working capital and machinery expansion financing for registered enterprises.',
      icon: Briefcase
    }
  ];

  const workflowSteps = [
    {
      role: '1. CUSTOMER',
      title: 'Apply for Loan',
      desc: 'Fill loan application form with personal, financial, bank details, CIBIL score & document proofs.',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
      badge: 'bg-emerald-600 text-white'
    },
    {
      role: '2. EMPLOYEE',
      title: 'Verify & Recommend',
      desc: 'Verification officer verifies KYC (Aadhaar/PAN), checks CIBIL & documents, then recommends or rejects with notes.',
      color: 'border-blue-500 bg-blue-50 text-blue-900',
      badge: 'bg-blue-600 text-white'
    },
    {
      role: '3. MANAGER',
      title: 'Review & Approve',
      desc: 'Senior manager reviews employee recommendation, assesses credit risk, sanctions approved amount & rate, or rejects.',
      color: 'border-purple-500 bg-purple-50 text-purple-900',
      badge: 'bg-purple-600 text-white'
    },
    {
      role: '4. DISBURSEMENT',
      title: 'Safe Disbursement',
      desc: 'Manager disburses approved loan to customer account, generates full monthly EMI schedule & creates notification.',
      color: 'border-amber-500 bg-amber-50 text-amber-900',
      badge: 'bg-amber-600 text-white'
    },
    {
      role: '5. ADMIN',
      title: 'Complete Oversight',
      desc: 'Admin monitors the complete system, users, applications, disbursements, audit logs, and risk settings.',
      color: 'border-slate-800 bg-slate-900 text-white',
      badge: 'bg-emerald-400 text-slate-950 font-bold'
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
              <span className="text-[10px] font-mono tracking-widest uppercase bg-slate-800 text-emerald-400 px-2.5 py-1 border border-slate-700 font-bold inline-block">
                Institutional Lending Platform
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
                Loan Management System
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-light">
                Secure and transparent digital loan processing connecting borrowers, verification officers, credit managers, and administrators.
              </p>
            </div>

            {/* 4 Dedicated Portal Entry Cards */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* Customer Portal */}
              <div className="p-4 bg-slate-800 border border-slate-700 hover:border-emerald-500 transition-colors flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">ROLE 1</span>
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-sm text-white mt-1">Customer Login</h3>
                  <p className="text-[11px] text-slate-300 mt-1">Apply for loans, track status, view EMI schedules & make payments.</p>
                </div>
                <Link
                  to="/login/customer"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase text-center block transition-colors"
                >
                  Customer Access →
                </Link>
              </div>

              {/* Employee Portal */}
              <div className="p-4 bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400">ROLE 2</span>
                    <UserCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-sm text-white mt-1">Employee Login</h3>
                  <p className="text-[11px] text-slate-300 mt-1">Verify customer identity, audit documents, check CIBIL & submit recommendation.</p>
                </div>
                <Link
                  to="/login/employee"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase text-center block transition-colors"
                >
                  Employee Access →
                </Link>
              </div>

              {/* Manager Portal */}
              <div className="p-4 bg-slate-800 border border-slate-700 hover:border-purple-500 transition-colors flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400">ROLE 3</span>
                    <Briefcase className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-sm text-white mt-1">Manager Login</h3>
                  <p className="text-[11px] text-slate-300 mt-1">Review employee recommendation, approve loan amount & disburse funds.</p>
                </div>
                <Link
                  to="/login/manager"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase text-center block transition-colors"
                >
                  Manager Access →
                </Link>
              </div>

              {/* Admin Portal */}
              <div className="p-4 bg-slate-800 border border-slate-700 hover:border-emerald-400 transition-colors flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">ROLE 4</span>
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-sm text-white mt-1">Admin Login</h3>
                  <p className="text-[11px] text-slate-300 mt-1">Master system control, user management, audit logs, reports & settings.</p>
                </div>
                <Link
                  to="/login/admin"
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase text-center block transition-colors"
                >
                  Admin Console →
                </Link>
              </div>
            </div>

            {/* Platform Credibility Badges */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400 font-mono">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>4-Role Governance</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Audit Trail History</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Fake Buttons</span>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW PIPELINE SECTION */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-slate-900" />
              <span>End-to-End Loan Processing Workflow</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict multi-tier underwriting lifecycle enforced through database validation and authorization middleware
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className={`p-4 border ${step.color} space-y-2 flex flex-col justify-between`}>
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider font-bold inline-block ${step.badge}`}>
                    {step.role}
                  </span>
                  <h3 className="font-bold text-sm pt-1">{step.title}</h3>
                  <p className="text-xs opacity-90 leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LOAN PRODUCTS SECTION */}
        <section id="loan-types" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              Loan Products & Lending Programs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized interest rates, flexible tenures, and transparent processing fees
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanProducts.map((prod, idx) => {
              const Icon = prod.icon;
              return (
                <div key={idx} className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm hover:border-slate-900 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-slate-900">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-200">
                      {prod.rate}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{prod.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{prod.desc}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 block">Max Limit:</span>
                      <span className="font-bold text-slate-800">{prod.amount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Tenure:</span>
                      <span className="font-bold text-slate-800">{prod.tenure}</span>
                    </div>
                  </div>

                  <Link
                    to={`/customer/apply?type=${encodeURIComponent(prod.title)}`}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs uppercase tracking-wider text-center block transition-colors"
                  >
                    Apply for this Loan →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* EMI CALCULATOR SECTION */}
        <section id="calculator" className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-slate-900" />
                  <span>Interactive Monthly EMI Calculator</span>
                </h2>
                <p className="text-xs text-slate-500">Calculate estimated monthly installments and interest costs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Controls */}
              <div className="lg:col-span-7 space-y-6 text-xs font-mono">
                {/* Loan Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-700">
                    <label className="font-semibold uppercase">Loan Amount (₹)</label>
                    <span className="font-bold text-sm text-slate-900">₹{Number(loanAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="25000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>₹50,000</span>
                    <span>₹50,00,000</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-700">
                    <label className="font-semibold uppercase">Tenure (Years)</label>
                    <span className="font-bold text-sm text-slate-900">{tenureYears} Years ({Number(tenureYears) * 12} Months)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(e.target.value)}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 Year</span>
                    <span>20 Years</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-700">
                    <label className="font-semibold uppercase">Interest Rate (% p.a.)</label>
                    <span className="font-bold text-sm text-slate-900">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="7.0"
                    max="20.0"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>7.0%</span>
                    <span>20.0%</span>
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="lg:col-span-5 bg-slate-900 text-white p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                    Estimated Repayment Summary
                  </span>

                  <div>
                    <span className="text-xs text-slate-400 uppercase font-mono">Monthly EMI</span>
                    <p className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                      ₹{calculatedEmi.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Principal Amount:</span>
                      <span className="font-bold text-slate-200">₹{Number(loanAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Interest Payable:</span>
                      <span className="font-bold text-emerald-400">₹{totalInterest.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold">
                      <span className="text-white">Total Amount Payable:</span>
                      <span className="text-white">₹{totalPayment.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/customer/apply?amount=${loanAmount}&tenure=${Number(tenureYears) * 12}`}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center block transition-colors"
                >
                  Proceed with Application →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
