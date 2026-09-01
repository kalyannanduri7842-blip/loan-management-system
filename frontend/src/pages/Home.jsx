import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  Shield,
  ArrowRight,
  Calculator,
  User,
  CheckCircle2,
  Lock,
  Clock,
  Home as HomeIcon,
  Car,
  GraduationCap,
  Briefcase,
  Layers,
  HelpCircle,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

export function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenureYears, setTenureYears] = useState(3);
  const [interestRate, setInterestRate] = useState(12.0);
  const [selectedType, setSelectedType] = useState('Personal Loan');

  const [calcResult, setCalcResult] = useState({
    monthlyEmi: 16607,
    totalInterest: 97852,
    totalPayable: 597852
  });

  const loanProducts = [
    {
      type: 'Personal Loan',
      rate: '12.0% p.a.',
      annualRate: 12.0,
      maxAmount: 'Up to ₹25,00,000',
      maxTenure: '1 to 5 Years',
      icon: User,
      desc: 'Instant digital approval with minimal documentation for medical emergencies, travel, weddings, or renovations.'
    },
    {
      type: 'Home Loan',
      rate: '8.5% p.a.',
      annualRate: 8.5,
      maxAmount: 'Up to ₹5,00,00,000',
      maxTenure: 'Up to 30 Years',
      icon: HomeIcon,
      desc: 'Lowest interest rates for purchasing new flats, independent villas, construction, or balance transfers.'
    },
    {
      type: 'Vehicle Loan',
      rate: '9.5% p.a.',
      annualRate: 9.5,
      maxAmount: 'Up to ₹40,00,000',
      maxTenure: 'Up to 7 Years',
      icon: Car,
      desc: 'Up to 100% on-road financing for electric vehicles, passenger cars, and commercial fleets.'
    },
    {
      type: 'Education Loan',
      rate: '10.0% p.a.',
      annualRate: 10.0,
      maxAmount: 'Up to ₹75,00,000',
      maxTenure: 'Up to 10 Years',
      icon: GraduationCap,
      desc: 'Flexible moratorium period covering university tuition, living expenses, and global higher studies.'
    },
    {
      type: 'Business Loan',
      rate: '14.0% p.a.',
      annualRate: 14.0,
      maxAmount: 'Up to ₹1,00,00,000',
      maxTenure: 'Up to 10 Years',
      icon: Briefcase,
      desc: 'Collateral-free working capital, machinery financing, and enterprise expansion capital for MSMEs.'
    }
  ];

  const steps = [
    { step: '1', title: 'Register / Login', desc: 'Create your customer account or sign in with verified credentials.' },
    { step: '2', title: 'Apply for Loan', desc: 'Fill personal, employment, bank details, and loan requirements in a single form.' },
    { step: '3', title: 'Submit Documents', desc: 'Upload digital copies of Aadhaar, PAN, salary slips, and bank statements.' },
    { step: '4', title: 'Admin Reviews', desc: 'Underwriting team conducts credit score assessment and document verification.' },
    { step: '5', title: 'Loan Approved', desc: 'Receive instant notification with approved loan ID, interest rate, and terms.' },
    { step: '6', title: 'Loan Disbursed', desc: 'Approved loan amount is credited directly to your verified bank account.' },
    { step: '7', title: 'Pay Monthly EMI', desc: 'Track amortization schedule and repay monthly EMIs online via UPI or Net Banking.' }
  ];

  // Calculate EMI on change
  useEffect(() => {
    const p = Number(loanAmount);
    const r = (Number(interestRate) / 12) / 100;
    const n = Number(tenureYears) * 12;

    if (p > 0 && n > 0) {
      const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;
      setCalcResult({
        monthlyEmi: emi,
        totalInterest,
        totalPayable
      });
    }
  }, [loanAmount, tenureYears, interestRate]);

  const handleSelectLoanType = (prod) => {
    setSelectedType(prod.type);
    setInterestRate(prod.annualRate);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest uppercase bg-slate-800 text-emerald-400 px-3 py-1 border border-slate-700">
              Enterprise Lending Platform 2.0
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white leading-tight">
              Simple, Fast & Secure Loan Management
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Experience transparent lending with instant credit assessments, digital document verification, and automated monthly EMI schedules. Apply in 5 minutes and receive funds directly in your bank account.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/apply-loan') : '/register'}
                className="btn-primary py-3 px-6 text-xs uppercase tracking-wider bg-white text-slate-900 border-white hover:bg-slate-100 flex items-center gap-2"
              >
                <span>Apply for Loan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="btn-secondary py-3 px-6 text-xs uppercase tracking-wider bg-transparent text-white border-slate-700 hover:bg-slate-800"
              >
                Customer Login
              </Link>

              <Link
                to="/login?role=admin"
                className="btn-secondary py-3 px-6 text-xs uppercase tracking-wider bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900 flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">Interest Rates</span>
                <strong className="text-emerald-400 text-sm">From 8.5% p.a.</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Approval Speed</span>
                <strong className="text-white text-sm">Under 24 Hours</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Paperless Digital Flow</span>
                <strong className="text-white text-sm">100% Online</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOAN TYPES SECTION */}
      <section id="loans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="border-b border-slate-200 pb-3 flex justify-between items-baseline">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              Loan Products & Offerings
            </h2>
            <p className="text-xs text-slate-500">Choose from retail and commercial financing categories</p>
          </div>
          <span className="text-xs font-mono text-slate-400">5 Active Categories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loanProducts.map((prod) => {
            const Icon = prod.icon;
            const isSelected = selectedType === prod.type;

            return (
              <div
                key={prod.type}
                onClick={() => handleSelectLoanType(prod)}
                className={`border bg-white p-5 space-y-3 cursor-pointer transition-all ${
                  isSelected ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="w-9 h-9 bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-900" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-xs uppercase">{prod.type}</h3>
                  <span className="text-xs font-mono text-emerald-700 font-bold block">{prod.rate}</span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {prod.desc}
                </p>

                <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500 space-y-0.5">
                  <div>Limit: <strong>{prod.maxAmount}</strong></div>
                  <div>Tenure: <strong>{prod.maxTenure}</strong></div>
                </div>

                <Link
                  to={isAuthenticated ? `/apply-loan?type=${encodeURIComponent(prod.type)}` : `/login?redirect=apply&type=${encodeURIComponent(prod.type)}`}
                  className="w-full btn-primary py-1.5 text-[10px] flex items-center justify-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE EMI CALCULATOR SECTION */}
      <section id="calculator" className="bg-slate-100 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="border-b border-slate-300 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-slate-900" />
              <span>EMI Amortization Calculator</span>
            </h2>
            <p className="text-xs text-slate-500">Calculate your monthly installments, total interest, and complete repayment projection</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sliders Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-6 space-y-6 text-xs">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="font-bold uppercase text-slate-700">Requested Loan Amount (₹)</label>
                  <span className="font-mono text-sm font-bold text-slate-900">₹{Number(loanAmount).toLocaleString('en-IN')}</span>
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
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹50,000</span>
                  <span>₹25,00,000</span>
                  <span>₹50,00,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="font-bold uppercase text-slate-700">Loan Tenure ({tenureYears} Years / {tenureYears * 12} Months)</label>
                  <span className="font-mono text-sm font-bold text-slate-900">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>1 Year</span>
                  <span>7 Years</span>
                  <span>15 Years</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="font-bold uppercase text-slate-700">Annual Interest Rate (% p.a.)</label>
                  <span className="font-mono text-sm font-bold text-slate-900">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={7.5}
                  max={20.0}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>7.5% (Home)</span>
                  <span>12.0% (Personal)</span>
                  <span>20.0% (Max)</span>
                </div>
              </div>
            </div>

            {/* Projection Card */}
            <div className="lg:col-span-5 bg-slate-900 text-white border border-slate-900 p-6 space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Calculated Monthly Installment</span>
                <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
                  ₹{calcResult.monthlyEmi.toLocaleString('en-IN')}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </div>
              </div>

              <div className="space-y-3 font-mono">
                <div className="flex justify-between text-xs pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Principal Borrowed:</span>
                  <strong className="text-white">₹{Number(loanAmount).toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-xs pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Interest Payable:</span>
                  <strong className="text-amber-400">₹{calcResult.totalInterest.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-xs pb-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Amount Repaid:</span>
                  <strong className="text-white">₹{calcResult.totalPayable.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total EMIs Count:</span>
                  <strong className="text-white">{tenureYears * 12} Installments</strong>
                </div>
              </div>

              <Link
                to={isAuthenticated ? `/apply-loan?amount=${loanAmount}&tenure=${tenureYears * 12}` : `/login`}
                className="w-full btn-primary py-2.5 text-xs uppercase tracking-wider bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                <span>Proceed with this Plan →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (7 STEPS) */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            How It Works — 7 Step Transparent Process
          </h2>
          <p className="text-xs text-slate-500">From initial application submission to online EMI repayment</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item, idx) => (
            <div key={item.step} className="border border-slate-200 bg-white p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {item.step}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Phase {idx + 1}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm uppercase">{item.title}</h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ABOUT & SECURITY */}
      <section id="about" className="bg-slate-100 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="border-b border-slate-300 pb-3">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              About Apex Capital Loan Management System
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Bank-Grade Encryption</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All customer identity, financial statements, and document uploads are protected via 256-bit AES encryption compliant with RBI guidelines.
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Instant Credit Assessment</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Automated debt-to-income and CIBIL score algorithms generate accurate eligibility ratings in real time for swift underwriting.
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Hidden Fees</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Standardized processing fees, clear interest schedules, and zero prepayment penalties on all retail loan categories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            Contact Lending Assistance
          </h2>
          <p className="text-xs text-slate-500">Reach our dedicated credit and support team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          <div className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              Have questions regarding eligibility, documentation requirements, or interest rate subsidies? Contact our customer support desk or visit our regional lending offices.
            </p>

            <div className="space-y-2 font-mono text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-900" />
                <span>1800-456-7890 (Toll Free • Mon-Sat 9AM-6PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-900" />
                <span>support@loanmanagement.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-slate-900" />
                <span>Corporate Office: Level 8, Apex Towers, MG Road, Bengaluru, 560001</span>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Thank you. A loan advisor will contact you shortly.'); }} className="border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase">Request Loan Advisory Call</h3>
            <div>
              <label className="block text-slate-600 mb-1">Full Name</label>
              <input type="text" required placeholder="e.g. Rahul Kumar" className="input-field" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Mobile Phone Number</label>
              <input type="tel" required placeholder="e.g. +91 98765 43210" className="input-field font-mono" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Inquiry Details</label>
              <textarea rows={3} placeholder="Tell us about the loan type and amount needed..." className="input-field" />
            </div>
            <button type="submit" className="btn-primary w-full py-2">
              Submit Request →
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
