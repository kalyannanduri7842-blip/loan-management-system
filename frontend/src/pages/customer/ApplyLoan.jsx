import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  FilePlus2,
  User,
  Briefcase,
  BadgeIndianRupee,
  Landmark,
  Upload,
  CheckCircle2,
  AlertCircle,
  Calculator,
  ArrowRight,
  Shield
} from 'lucide-react';

export function ApplyLoan() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // 1. Personal Information
  const [personalDetails, setPersonalDetails] = useState({
    fullName: user?.fullName || 'Rahul Kumar',
    email: user?.email || 'customer@demo.com',
    mobile: user?.phone || '+91 98765 11111',
    dob: '1992-05-14',
    gender: 'Male',
    address: user?.address || 'Flat 302, Green Glen Heights, Bellandur',
    city: user?.city || 'Bengaluru',
    state: user?.state || 'Karnataka',
    postalCode: user?.postalCode || '560103'
  });

  // 2. Identity Information
  const [identityDetails, setIdentityDetails] = useState({
    aadhaarNumber: '123456788921',
    panNumber: 'ABCDE1234F'
  });

  // 3. Financial & Employment Information
  const [employmentDetails, setEmploymentDetails] = useState({
    employmentType: 'Salaried',
    companyName: 'TechCorp Global Solutions Pvt Ltd',
    monthlyIncome: user?.monthlyIncome || 85000,
    workExperience: '6 Years',
    existingEmi: 8000
  });

  // 4. Bank Information
  const [bankDetails, setBankDetails] = useState({
    bankName: 'HDFC Bank',
    accountNumber: '50100234567890',
    ifscCode: 'HDFC0001234'
  });

  // 5. Loan Information
  const [loanDetails, setLoanDetails] = useState({
    loanType: searchParams.get('type') || 'Personal Loan',
    requestedAmount: Number(searchParams.get('amount')) || 500000,
    tenureMonths: Number(searchParams.get('tenure')) || 36,
    loanPurpose: 'Home renovation and interior woodwork'
  });

  // 6. Simulated CIBIL Credit Information
  const [creditScore, setCreditScore] = useState(user?.creditScore || 780);

  // 7. Documents
  const [documents, setDocuments] = useState({
    aadhaar: 'Aadhaar_Card_Front_Back.pdf',
    pan: 'PAN_Card_Verified.pdf',
    salarySlip: 'Salary_Slip_Last_3Months.pdf',
    bankStatement: 'Bank_Statement_6Months.pdf'
  });

  // Dynamic EMI Calculation
  const [estimatedEmi, setEstimatedEmi] = useState(16607);

  const interestRateMap = {
    'Personal Loan': 12.0,
    'Home Loan': 8.5,
    'Vehicle Loan': 9.5,
    'Education Loan': 10.0,
    'Business Loan': 14.0
  };

  useEffect(() => {
    const p = Number(loanDetails.requestedAmount);
    const rate = interestRateMap[loanDetails.loanType] || 12.0;
    const r = (rate / 12) / 100;
    const n = Number(loanDetails.tenureMonths);

    if (p > 0 && n > 0) {
      const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      setEstimatedEmi(emi);
    }
  }, [loanDetails.requestedAmount, loanDetails.tenureMonths, loanDetails.loanType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        personalDetails,
        identityDetails,
        employmentDetails,
        loanDetails,
        bankDetails,
        creditScore: Number(creditScore),
        documents
      };

      const res = await api.customer.submitApplication(payload);
      addToast(
        'Loan Application Submitted!',
        'Loan application submitted successfully. Your application is now waiting for employee verification.',
        'success'
      );
      navigate('/customer/applications');
    } catch (err) {
      addToast('Submission Error', err.message || 'Could not submit application', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => ({ ...prev, [field]: file.name }));
      addToast('Document Attached', `"${file.name}" uploaded successfully.`, 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <FilePlus2 className="w-5 h-5 text-slate-900" />
          <span>Apply for Loan</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit your retail financing request. Verification officers will audit your KYC, documents & CIBIL score.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <User className="w-4 h-4 text-emerald-700" />
            <span>1. Personal Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name (as per Govt ID) *</label>
              <input
                type="text"
                required
                value={personalDetails.fullName}
                onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={personalDetails.email}
                onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone / Mobile Number *</label>
              <input
                type="tel"
                required
                value={personalDetails.mobile}
                onChange={(e) => setPersonalDetails({ ...personalDetails, mobile: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={personalDetails.dob}
                onChange={(e) => setPersonalDetails({ ...personalDetails, dob: e.target.value })}
                className="input-field font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={personalDetails.address}
                onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={personalDetails.city}
                onChange={(e) => setPersonalDetails({ ...personalDetails, city: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">State & PIN *</label>
              <input
                type="text"
                required
                value={`${personalDetails.state} - ${personalDetails.postalCode}`}
                onChange={(e) => setPersonalDetails({ ...personalDetails, postalCode: e.target.value })}
                className="input-field font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: IDENTITY INFORMATION (AADHAAR & PAN) */}
        <div className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>2. Identity & Government ID Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Number (12 Digits) *</label>
              <input
                type="text"
                required
                maxLength={12}
                placeholder="XXXX-XXXX-8921"
                value={identityDetails.aadhaarNumber}
                onChange={(e) => setIdentityDetails({ ...identityDetails, aadhaarNumber: e.target.value })}
                className="input-field font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Stored securely with standard masking for privacy.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Permanent Account Number (PAN) *</label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="ABCDE1234F"
                value={identityDetails.panNumber}
                onChange={(e) => setIdentityDetails({ ...identityDetails, panNumber: e.target.value.toUpperCase() })}
                className="input-field font-mono uppercase"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Verified against income tax record during verification.</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: FINANCIAL & EMPLOYMENT INFORMATION */}
        <div className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-emerald-700" />
            <span>3. Employment & Financial Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employment Type *</label>
              <select
                value={employmentDetails.employmentType}
                onChange={(e) => setEmploymentDetails({ ...employmentDetails, employmentType: e.target.value })}
                className="input-field"
              >
                <option value="Salaried">Salaried (Full-Time)</option>
                <option value="Self-Employed">Self-Employed / Business Owner</option>
                <option value="Professional">Doctor / CA / Consultant</option>
                <option value="Government">Government / Public Sector</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employer / Company Name *</label>
              <input
                type="text"
                required
                value={employmentDetails.companyName}
                onChange={(e) => setEmploymentDetails({ ...employmentDetails, companyName: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Net Monthly Take-Home Income (₹) *</label>
              <input
                type="number"
                required
                min="10000"
                value={employmentDetails.monthlyIncome}
                onChange={(e) => setEmploymentDetails({ ...employmentDetails, monthlyIncome: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Existing Monthly EMIs / Liabilities (₹)</label>
              <input
                type="number"
                min="0"
                value={employmentDetails.existingEmi}
                onChange={(e) => setEmploymentDetails({ ...employmentDetails, existingEmi: e.target.value })}
                className="input-field font-mono"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Disbursement Bank Name *</label>
              <input
                type="text"
                required
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Account Number *</label>
              <input
                type="text"
                required
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">IFSC Code *</label>
              <input
                type="text"
                required
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                className="input-field font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: LOAN DETAILS & CREDIT INFORMATION */}
        <div className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <BadgeIndianRupee className="w-4 h-4 text-emerald-700" />
            <span>4. Loan Requirements & Credit Score</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loan Product Type *</label>
              <select
                value={loanDetails.loanType}
                onChange={(e) => setLoanDetails({ ...loanDetails, loanType: e.target.value })}
                className="input-field"
              >
                <option value="Personal Loan">Personal Loan (12.0% p.a.)</option>
                <option value="Home Loan">Home Loan (8.5% p.a.)</option>
                <option value="Vehicle Loan">Vehicle Loan (9.5% p.a.)</option>
                <option value="Education Loan">Education Loan (10.0% p.a.)</option>
                <option value="Business Loan">Business Loan (14.0% p.a.)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Requested Loan Amount (₹) *</label>
              <input
                type="number"
                required
                min="10000"
                max="50000000"
                step="10000"
                value={loanDetails.requestedAmount}
                onChange={(e) => setLoanDetails({ ...loanDetails, requestedAmount: e.target.value })}
                className="input-field font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tenure (in Months) *</label>
              <select
                value={loanDetails.tenureMonths}
                onChange={(e) => setLoanDetails({ ...loanDetails, tenureMonths: Number(e.target.value) })}
                className="input-field font-mono"
              >
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
                <option value={48}>48 Months (4 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
                <option value={120}>120 Months (10 Years)</option>
                <option value={180}>180 Months (15 Years)</option>
                <option value={240}>240 Months (20 Years)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Purpose of Loan *</label>
              <input
                type="text"
                required
                value={loanDetails.loanPurpose}
                onChange={(e) => setLoanDetails({ ...loanDetails, loanPurpose: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">CIBIL Credit Score (Demo Data)</label>
              <input
                type="number"
                min="300"
                max="900"
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                className="input-field font-mono font-bold text-emerald-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Simulated credit bureau score (300–900).</span>
            </div>
          </div>

          {/* Dynamic Calculated Repayment Preview */}
          <div className="border border-emerald-200 bg-emerald-50 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono">
            <div>
              <span className="text-[11px] text-emerald-900 uppercase font-bold block">Estimated Monthly Installment (EMI)</span>
              <p className="text-2xl font-black text-emerald-950">₹{estimatedEmi.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right text-[11px] text-emerald-800">
              <p>Interest Rate: <strong>{interestRateMap[loanDetails.loanType] || 12.0}% p.a.</strong></p>
              <p>Total Repayable: <strong>₹{(estimatedEmi * Number(loanDetails.tenureMonths)).toLocaleString('en-IN')}</strong></p>
            </div>
          </div>
        </div>

        {/* SECTION 5: DOCUMENT ATTACHMENTS */}
        <div className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>5. Mandatory KYC & Financial Documents</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-800 block">Identity Proof (Aadhaar / Passport) *</span>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-600 truncate max-w-[200px]">{documents.aadhaar}</span>
                <label className="btn-secondary py-1 px-2.5 text-[10px] cursor-pointer">
                  <span>Browse</span>
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload('aadhaar', e)} />
                </label>
              </div>
            </div>

            <div className="p-3 border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-800 block">PAN Card Copy *</span>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-600 truncate max-w-[200px]">{documents.pan}</span>
                <label className="btn-secondary py-1 px-2.5 text-[10px] cursor-pointer">
                  <span>Browse</span>
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload('pan', e)} />
                </label>
              </div>
            </div>

            <div className="p-3 border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-800 block">Salary Slip / ITR Computation *</span>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-600 truncate max-w-[200px]">{documents.salarySlip}</span>
                <label className="btn-secondary py-1 px-2.5 text-[10px] cursor-pointer">
                  <span>Browse</span>
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload('salarySlip', e)} />
                </label>
              </div>
            </div>

            <div className="p-3 border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-800 block">Bank Account Statement (Last 6 Months) *</span>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-600 truncate max-w-[200px]">{documents.bankStatement}</span>
                <label className="btn-secondary py-1 px-2.5 text-[10px] cursor-pointer">
                  <span>Browse</span>
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload('bankStatement', e)} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMISSION CTA */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 px-8 text-xs uppercase tracking-wider font-bold bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-white flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span>{loading ? 'Submitting Application...' : 'Submit Loan Application'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
