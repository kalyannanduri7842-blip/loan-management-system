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
  Landmark
} from 'lucide-react';

export function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.loans.getMy();
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

        <Link
          to="/emi-schedule"
          className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>View EMI Schedules</span>
        </Link>
      </div>

      {/* Loans Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {loans.length === 0 ? (
          <div className="md:col-span-2 border border-slate-200 bg-white p-12 text-center text-slate-400 space-y-3">
            <p>You currently do not have any approved or active loan records.</p>
            <Link to="/apply-loan" className="btn-primary py-2 px-4 text-xs inline-flex">
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
                  <strong className="text-sm font-bold text-emerald-800">₹{loan.emiAmount?.toLocaleString('en-IN')}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Remaining Balance</span>
                  <strong className="text-sm font-bold text-slate-900">₹{loan.remainingPrincipal?.toLocaleString('en-IN')}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Repaid So Far</span>
                  <strong className="text-sm font-bold text-emerald-700">₹{loan.totalPaidAmount?.toLocaleString('en-IN')}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">EMIs Completed</span>
                  <strong className="text-sm font-bold text-slate-900">{loan.paidEmisCount || 0} / {loan.totalEmisCount}</strong>
                </div>
              </div>

              {/* Disbursement & Bank Summary */}
              <div className="space-y-1 text-[11px] text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span>Disbursed Bank Account:</span>
                  <strong>{loan.bankDetails?.bankName} ({loan.bankDetails?.accountNumber})</strong>
                </div>
                {loan.disbursedDate && (
                  <div className="flex justify-between">
                    <span>Disbursed On:</span>
                    <span>{new Date(loan.disbursedDate).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                {loan.firstEmiDate && (
                  <div className="flex justify-between">
                    <span>First EMI Due Date:</span>
                    <strong className="text-slate-900">{loan.firstEmiDate}</strong>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <Link
                  to={`/emi-schedule?loanId=${loan.id}`}
                  className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Amortization Schedule</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
