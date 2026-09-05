import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../context/ToastContext';
import {
  CalendarDays,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  BadgeIndianRupee,
  Shield,
  ArrowRight,
  Receipt,
  FilePlus2
} from 'lucide-react';

export function EmiSchedule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(searchParams.get('loanId') || '');
  const [loan, setLoan] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pay EMI Modal
  const [payingEmi, setPayingEmi] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  const { addToast } = useToast();

  const fetchLoans = async () => {
    try {
      const res = await api.customer.getMyLoans();
      const list = res.loans || [];
      setLoans(list);

      if (list.length > 0) {
        const targetId = searchParams.get('loanId') || list[0].id;
        setSelectedLoanId(targetId);
        loadSchedule(targetId);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.warn('Error fetching loans', err);
      setLoading(false);
    }
  };

  const loadSchedule = async (id) => {
    setLoading(true);
    try {
      const res = await api.customer.getEmiSchedule(id);
      setLoan(res.loan);
      setSchedule(res.schedule || []);
    } catch (err) {
      console.warn('Schedule error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleLoanChange = (e) => {
    const id = e.target.value;
    setSelectedLoanId(id);
    setSearchParams({ loanId: id });
    loadSchedule(id);
  };

  const handlePayEmi = async (e) => {
    e.preventDefault();
    if (!payingEmi || !loan) return;

    setProcessing(true);
    try {
      const res = await api.customer.payEmi(loan.id, {
        scheduleId: payingEmi.id,
        paymentMethod
      });

      addToast(
        'EMI Payment Successful!',
        res.message || `EMI #${payingEmi.emiNumber} of ₹${payingEmi.emiAmount} processed successfully.`,
        'success'
      );

      setPayingEmi(null);
      loadSchedule(loan.id);
    } catch (err) {
      addToast('Payment Failed', err.message || 'Could not process EMI payment', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-900" />
            <span>Monthly EMI Repayment Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full reducing balance amortization schedule, payment status & online EMI settlement
          </p>
        </div>

        {/* Loan Selector Dropdown */}
        {loans.length > 0 && (
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="font-semibold text-slate-700">Select Loan:</span>
            <select
              value={selectedLoanId}
              onChange={handleLoanChange}
              className="input-field py-1 text-xs font-bold"
            >
              {loans.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.loanNumber} — {l.loanType} (₹{l.principalAmount?.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loans.length === 0 ? (
        <div className="border border-slate-200 bg-white p-12 text-center text-slate-400 space-y-3">
          <p>No active loan accounts found. Submit an application to view generated repayment schedules.</p>
          <Link to="/customer/apply" className="btn-primary py-2 px-4 text-xs inline-flex bg-emerald-600 border-emerald-600 text-white font-bold">
            Apply for Loan →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Loan KPI Overview Banner */}
          {loan && (
            <div className="border border-slate-200 bg-white p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono shadow-sm">
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Principal Loan</span>
                <strong className="text-base text-slate-900">₹{loan.principalAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Annual Rate</span>
                <strong className="text-base text-slate-900">{loan.annualInterestRate}% p.a.</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Monthly Installment</span>
                <strong className="text-base text-emerald-800">₹{(loan.monthlyEmi || loan.emiAmount || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Remaining Principal</span>
                <strong className="text-base text-slate-900">₹{(loan.remainingPrincipal || loan.principalAmount).toLocaleString('en-IN')}</strong>
              </div>
            </div>
          )}

          {/* EMI Schedule Table */}
          <div className="border border-slate-200 bg-white shadow-sm text-xs">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider text-slate-900">
                Amortization Ledger ({schedule.length} Installments)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Paid: {schedule.filter(s => s.status === 'PAID').length} / {schedule.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="table-header text-center">EMI #</th>
                    <th className="table-header">Due Date</th>
                    <th className="table-header text-right">EMI Amount</th>
                    <th className="table-header text-right">Principal Component</th>
                    <th className="table-header text-right">Interest Component</th>
                    <th className="table-header text-right">Balance After EMI</th>
                    <th className="table-header text-center">Payment Status</th>
                    <th className="table-header text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono font-medium">
                  {schedule.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                        No schedule entries found.
                      </td>
                    </tr>
                  ) : (
                    schedule.map((emi) => (
                      <tr key={emi.id} className={emi.status === 'PAID' ? 'bg-emerald-50/40 hover:bg-emerald-50' : 'hover:bg-slate-50'}>
                        <td className="table-cell text-center font-bold text-slate-900">
                          #{emi.emiNumber}
                        </td>
                        <td className="table-cell font-bold">
                          {emi.dueDate}
                        </td>
                        <td className="table-cell text-right font-bold text-slate-900">
                          ₹{emi.emiAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="table-cell text-right text-slate-600">
                          ₹{emi.principalComponent?.toLocaleString('en-IN')}
                        </td>
                        <td className="table-cell text-right text-slate-600">
                          ₹{emi.interestComponent?.toLocaleString('en-IN')}
                        </td>
                        <td className="table-cell text-right font-bold text-slate-900">
                          ₹{emi.remainingBalance?.toLocaleString('en-IN')}
                        </td>
                        <td className="table-cell text-center">
                          <StatusBadge status={emi.status} />
                        </td>
                        <td className="table-cell text-right">
                          {emi.status === 'PAID' ? (
                            <span className="text-[11px] text-emerald-800 font-bold font-mono">
                              Paid ({emi.paidDate || 'Success'})
                            </span>
                          ) : (
                            <button
                              onClick={() => setPayingEmi(emi)}
                              className="btn-primary py-1 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-white font-bold cursor-pointer"
                            >
                              Pay EMI
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
      )}

      {/* Pay EMI Modal */}
      {payingEmi && loan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-6 text-xs font-sans shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Online Payment Gateway</span>
                <h3 className="font-bold text-base text-slate-900">Pay Installment #{payingEmi.emiNumber}</h3>
              </div>
              <button
                onClick={() => setPayingEmi(null)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border border-emerald-200 bg-emerald-50 space-y-2 font-mono">
              <div className="flex justify-between text-slate-700">
                <span>Loan Account:</span>
                <span className="font-bold text-slate-900">{loan.loanNumber}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Due Date:</span>
                <span className="font-bold text-slate-900">{payingEmi.dueDate}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-emerald-200 pt-2 text-emerald-950">
                <span>Amount Due:</span>
                <span>₹{payingEmi.emiAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <form onSubmit={handlePayEmi} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Payment Mode *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="input-field font-mono"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="NET_BANKING">Net Banking (NEFT / IMPS)</option>
                  <option value="DEBIT_CARD">Debit Card (RuPay / Visa / MasterCard)</option>
                </select>
              </div>

              <div className="p-3 border border-slate-200 bg-slate-50 text-[11px] text-slate-500 font-mono">
                Safe simulated payment processing. Upon submission, the installment is immediately marked as PAID in the database ledger.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingEmi(null)}
                  className="btn-secondary py-2 px-4 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary py-2 px-6 text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-white font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <span>{processing ? 'Processing Transfer...' : `Confirm & Pay ₹${payingEmi.emiAmount?.toLocaleString('en-IN')}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
