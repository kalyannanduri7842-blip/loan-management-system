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
  ArrowRight
} from 'lucide-react';

export function ApplyLoan() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // 1. Personal Details
  const [personalDetails, setPersonalDetails] = useState({
    fullName: user?.fullName || 'Rahul Kumar',
    dob: '1992-05-14',
    gender: 'Male',
    mobile: user?.phone || '+91 98765 11111',
    email: user?.email || 'rahul@gmail.com',
    address: user?.address || 'Flat 302, Green Glen Heights, Bellandur, Bengaluru, Karnataka - 560103'
  });

  // 2. Employment Details
  const [employmentDetails, setEmploymentDetails] = useState({
    employmentType: 'Salaried',
    companyName: 'TechCorp Global Solutions Pvt Ltd',
    monthlyIncome: user?.monthlyIncome || 75000,
    workExperience: '6 Years',
    existingEmi: 5000
  });

  // 3. Loan Details
  const [loanDetails, setLoanDetails] = useState({
    loanType: searchParams.get('type') || 'Personal Loan',
    requestedAmount: Number(searchParams.get('amount')) || 500000,
    tenureMonths: Number(searchParams.get('tenure')) || 36,
    loanPurpose: 'Home renovation and interior woodwork'
  });

  // 4. Bank Details
  const [bankDetails, setBankDetails] = useState({
    bankName: 'HDFC Bank',
    accountNumber: '50100234567890',
    ifscCode: 'HDFC0001234'
  });

  // 5. Document file names mock/uploads
  const [documents, setDocuments] = useState({
    aadhaar: 'Aadhaar_Card_Front_Back.pdf',
    pan: 'PAN_Card_Verified.pdf',
    salarySlip: 'Salary_Slip_Last_3Months.pdf',
    bankStatement: 'Bank_Statement_6Months.pdf',
    addressProof: 'Electricity_Bill_Latest.pdf'
  });

  // Estimated EMI
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
        employmentDetails,
        loanDetails,
        bankDetails,
        documents
      };

      const res = await api.applications.submit(payload);
      addToast(
        'Loan Application Submitted!',
        `Your application ${res.application?.applicationNumber} has been received and queued for review.`,
        'success'
      );
      navigate('/my-applications');
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
          <span>Apply for Loan Application</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Complete all 5 sections below. All applications are reviewed by our credit underwriting committee within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>1. Personal Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={personalDetails.fullName}
                onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                className="input-field"
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                value={personalDetails.gender}
                onChange={(e) => setPersonalDetails({ ...personalDetails, gender: e.target.value })}
                className="input-field cursor-pointer font-semibold"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number *</label>
              <input
                type="tel"
                required
                value={personalDetails.mobile}
                onChange={(e) => setPersonalDetails({ ...personalDetails, mobile: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Current Residential Address *</label>
              <textarea
                rows={2}
                required
                value={personalDetails.address}
                onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: EMPLOYMENT & INCOME */}
        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>2. Employment & Income Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employment Type *</label>
              <select
                value={employmentDetails.employmentType}
                onChange={(e) => setEmploymentDetails({ ...employmentDetails, employmentType: e.target.value })}
                className="input-field cursor-pointer font-semibold"
              >
                <option value="Salaried">Salaried (Private / Govt)</option>
                <option value="Self-Employed">Self-Employed / Business Owner</option>
                <option value="Professional">Doctor / CA / Consultant</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Organization / Business Name *</label>
              <input
                type="text"
                required
                value={employmentDetails.companyName}
                onChange={(e) => setEmploymentDetails({ ...employmentDetails, companyName: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Net Monthly In-Hand Income (₹) *</label>
              <input
                type="number"
                required
                min={10000}
                value={employmentDetails.monthlyIncome}
                onChange={(e) => setEmploymentDetails({ ...employmentDetails, monthlyIncome: parseInt(e.target.value) || 0 })}
                className="input-field font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Existing Monthly Loan EMIs (₹)</label>
              <input
                type="number"
                min={0}
                value={employmentDetails.existingEmi}
                onChange={(e) => setEmploymentDetails({ ...employmentDetails, existingEmi: parseInt(e.target.value) || 0 })}
                className="input-field font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: LOAN REQUIREMENTS */}
        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <BadgeIndianRupee className="w-4 h-4" />
            <span>3. Loan Requirements & Tenure</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loan Category *</label>
              <select
                value={loanDetails.loanType}
                onChange={(e) => setLoanDetails({ ...loanDetails, loanType: e.target.value })}
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
              <label className="block font-semibold text-slate-700 mb-1">Requested Loan Amount (₹) *</label>
              <input
                type="number"
                required
                min={10000}
                max={50000000}
                step={10000}
                value={loanDetails.requestedAmount}
                onChange={(e) => setLoanDetails({ ...loanDetails, requestedAmount: parseInt(e.target.value) || 0 })}
                className="input-field font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Repayment Tenure (Months) *</label>
              <select
                value={loanDetails.tenureMonths}
                onChange={(e) => setLoanDetails({ ...loanDetails, tenureMonths: parseInt(e.target.value) || 36 })}
                className="input-field cursor-pointer font-mono font-semibold"
              >
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
                <option value={48}>48 Months (4 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
                <option value={84}>84 Months (7 Years)</option>
                <option value={120}>120 Months (10 Years)</option>
                <option value={240}>240 Months (20 Years)</option>
                <option value={360}>360 Months (30 Years)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">Specific Purpose of Loan *</label>
              <input
                type="text"
                required
                placeholder="e.g. Home renovation, Vehicle purchase, Wedding expenses..."
                value={loanDetails.loanPurpose}
                onChange={(e) => setLoanDetails({ ...loanDetails, loanPurpose: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Real-time Estimated EMI Box */}
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Estimated Monthly Installment (EMI)</span>
              <strong className="text-xl text-emerald-400 font-bold">₹{estimatedEmi.toLocaleString('en-IN')} / month</strong>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              <span>Rate: <strong>{interestRateMap[loanDetails.loanType] || 12}% p.a.</strong></span>
              <span className="block text-slate-400">Tenure: {loanDetails.tenureMonths} Mos</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: BANK ACCOUNT FOR DISBURSEMENT */}
        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4" />
            <span>4. Bank Account Details (For Loan Payout)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. HDFC Bank"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 50100234567890"
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
                placeholder="e.g. HDFC0001234"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                className="input-field font-mono uppercase font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: DIGITAL DOCUMENTS */}
        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider">
            <Upload className="w-4 h-4" />
            <span>5. Mandatory KYC & Financial Documents</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Aadhaar */}
            <div className="p-3 border border-slate-200 bg-slate-50 space-y-2">
              <label className="block font-bold text-slate-800">Aadhaar Card (Front & Back)</label>
              <span className="text-[11px] text-slate-600 font-mono block truncate">File: {documents.aadhaar}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload('aadhaar', e)}
                className="text-xs text-slate-500 file:btn-secondary file:py-1 file:px-2 file:text-[10px]"
              />
            </div>

            {/* PAN */}
            <div className="p-3 border border-slate-200 bg-slate-50 space-y-2">
              <label className="block font-bold text-slate-800">Permanent Account Number (PAN) Card</label>
              <span className="text-[11px] text-slate-600 font-mono block truncate">File: {documents.pan}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload('pan', e)}
                className="text-xs text-slate-500 file:btn-secondary file:py-1 file:px-2 file:text-[10px]"
              />
            </div>

            {/* Salary Slip */}
            <div className="p-3 border border-slate-200 bg-slate-50 space-y-2">
              <label className="block font-bold text-slate-800">Latest Salary Slip / Income Certificate</label>
              <span className="text-[11px] text-slate-600 font-mono block truncate">File: {documents.salarySlip}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload('salarySlip', e)}
                className="text-xs text-slate-500 file:btn-secondary file:py-1 file:px-2 file:text-[10px]"
              />
            </div>

            {/* Bank Statement */}
            <div className="p-3 border border-slate-200 bg-slate-50 space-y-2">
              <label className="block font-bold text-slate-800">Last 6 Months Bank Statement</label>
              <span className="text-[11px] text-slate-600 font-mono block truncate">File: {documents.bankStatement}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload('bankStatement', e)}
                className="text-xs text-slate-500 file:btn-secondary file:py-1 file:px-2 file:text-[10px]"
              />
            </div>

            {/* Address Proof */}
            <div className="sm:col-span-2 p-3 border border-slate-200 bg-slate-50 space-y-2">
              <label className="block font-bold text-slate-800">Current Address Proof (Utility Bill / Passport / Rental Deed)</label>
              <span className="text-[11px] text-slate-600 font-mono block truncate">File: {documents.addressProof}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload('addressProof', e)}
                className="text-xs text-slate-500 file:btn-secondary file:py-1 file:px-2 file:text-[10px]"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900 block">Declaration & Consent</span>
            <p className="text-[11px] text-slate-500">
              By submitting, you authorize Apex Capital to pull your CIBIL score and verify the provided bank statement.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 px-8 text-xs uppercase tracking-wider font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 w-full sm:w-auto justify-center"
          >
            <span>{loading ? 'Submitting Application...' : 'Submit Loan Application →'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
