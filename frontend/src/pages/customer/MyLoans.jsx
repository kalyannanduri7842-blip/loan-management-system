import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  BadgeIndianRupee,
  CalendarDays,
  ReceiptText,
  ArrowRight,
  CheckCircle2,
  Clock,
  Landmark,
  FilePlus2
} from 'lucide-react';

export function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.customer.getMyLoans();
      setLoans(res.loans || []);
    } catch (err) {
      console.warn('Loans error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BadgeIndianRupee className="w-5 h-5 text-slate-900" />
            <span>My Loans & Portfolios</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of all active, approved, and repaid loan accounts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/customer/emi-schedule"
            className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>EMI Schedules</span>
          </Link>
          <Link
            to="/customer/apply"
            className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer bg-emerald-700 hover:bg-emerald-800 border-emerald-700 text-white font-bold"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>New Loan</span>
          </Link>
        </div>
      </div>

      {/* Loans Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {loans.length === 0 ? (
          <div className="md:col-span-2 border border-slate-200 bg-white p-12 text-center text-slate-400 space-y-3">
            <p>You currently do not have any active or disbursed loan accounts.</p>
            <Link to="/customer/apply" className="btn-primary py-2 px-4 text-xs inline-flex bg-emerald-600 border-emerald-600 text-white font-bold">
              Apply for Loan Now →
            </Link>
          </div>
        ) : (
          loans.map((loan) => (
            <div key={loan.id} className="border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
              {/* Top Row */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{loan.loanType}</span>
                  <h3 className="font-bold text-base text-slate-900 font-mono">{loan.loanNumber}</h3>
                </div>
                <StatusBadge status={loan.status} />
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Principal</span>
                  <strong className="text-sm font-bold text-slate-900">₹{loan.principalAmount?.toLocaleString('en-IN')}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Interest Rate</span>
                  <strong className="text-sm font-bold text-slate-900">{loan.annualInterestRate}% p.a.</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Monthly EMI</span>
                  <strong className="text-sm font-bold text-emerald-800">₹{(loan.monthlyEmi || loan.emiAmount || 0).toLocaleString('en-IN')}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Remaining Balance</span>
                  <strong className="text-sm font-bold text-slate-900">₹{(loan.remainingPrincipal || loan.principalAmount).toLocaleString('en-IN')}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">EMIs Paid</span>
                  <strong className="text-sm font-bold text-emerald-700">{loan.paidEmisCount || 0} / {loan.totalEmisCount || loan.tenureMonths}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Disbursed Date</span>
                  <span className="text-xs font-bold text-slate-700">{loan.disbursedDate ? new Date(loan.disbursedDate).toLocaleDateString('en-IN') : 'Pending'}</span>
                </div>
              </div>

              {/* Bank Details & CTA */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-100 pt-3">
                <div className="text-[11px] text-slate-500 font-mono">
                  <span>Credited to: <strong>{loan.bankDetails?.bankName} ({loan.bankDetails?.accountNumber})</strong></span>
                </div>

                <Link
                  to="/customer/emi-schedule"
                  className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  <span>Pay EMI / Schedule</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
