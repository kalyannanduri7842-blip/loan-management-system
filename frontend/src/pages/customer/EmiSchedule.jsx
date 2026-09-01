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
  Receipt
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
      const res = await api.loans.getMy();
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
      const res = await api.loans.getEmiSchedule(id);
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
      const res = await api.loans.payEmi(loan.id, {
        emiScheduleId: payingEmi.id,
        paymentMethod,
        paymentRef: `UPI-REF-${Date.now().toString().slice(-6)}`
      });

      addToast(
        'EMI Payment Successful!',
        res.message || `EMI #${payingEmi.emiNumber} paid successfully.`,
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
      {/* Header & Loan Selector */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-900" />
            <span>EMI Amortization Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Month-by-month repayment breakdown, principal deduction, interest, and instant online payments
          </p>
        </div>

        {loans.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Select Loan:</label>
            <select
              value={selectedLoanId}
              onChange={handleLoanChange}
              className="input-field py-1 px-3 text-xs font-mono font-bold cursor-pointer max-w-xs"
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
        <div className="border border-slate-200 bg-white p-12 text-center text-slate-400 space-y-3 text-xs">
          <p>No active loans found. Apply for a loan to generate an EMI schedule.</p>
          <Link to="/apply-loan" className="btn-primary py-2 px-4 text-xs inline-flex">
            Apply for Loan →
          </Link>
        </div>
      ) : (
        <>
          {/* Loan Summary Deck */}
          {loan && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-5 bg-slate-900 text-white font-mono text-xs border border-slate-900 shadow-sm">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Principal Loan</span>
                <strong className="text-base text-white font-bold">₹{loan.principalAmount?.toLocaleString('en-IN')}</strong>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Monthly EMI</span>
                <strong className="text-base text-emerald-400 font-bold">₹{loan.emiAmount?.toLocaleString('en-IN')}</strong>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Annual Interest</span>
                <strong className="text-base text-white font-bold">{loan.annualInterestRate}% p.a.</strong>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Remaining Balance</span>
                <strong className="text-base text-amber-400 font-bold">₹{loan.remainingPrincipal?.toLocaleString('en-IN')}</strong>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Repayment Progress</span>
                <strong className="text-base text-white font-bold">{loan.paidEmisCount || 0} / {loan.totalEmisCount} EMIs</strong>
              </div>
            </div>
          )}

          {/* Amortization Schedule Table */}
          <div className="border border-slate-200 bg-white space-y-4 text-xs">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider text-slate-900">
                Amortization Schedule Ledger ({schedule.length} Installments)
              </span>
              <span className="text-[11px] font-mono text-slate-400">Fixed Reducing Balance Method</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="table-header text-center">EMI #</th>
                    <th className="table-header">Due Date</th>
                    <th className="table-header text-right">EMI Amount</th>
                    <th className="table-header text-right">Principal</th>
                    <th className="table-header text-right">Interest</th>
                    <th className="table-header text-right">Remaining Balance</th>
                    <th className="table-header">Payment Status</th>
                    <th className="table-header text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium font-mono">
                  {schedule.map((item) => (
                    <tr key={item.id} className={`hover:bg-slate-50 ${item.status === 'PAID' ? 'bg-emerald-50/30' : ''}`}>
                      <td className="table-cell text-center font-bold text-slate-900">{item.emiNumber}</td>
                      <td className="table-cell">{item.dueDate}</td>
                      <td className="table-cell text-right font-bold text-slate-900">₹{item.emiAmount?.toLocaleString('en-IN')}</td>
                      <td className="table-cell text-right text-slate-600">₹{item.principalComponent?.toLocaleString('en-IN')}</td>
                      <td className="table-cell text-right text-slate-600">₹{item.interestComponent?.toLocaleString('en-IN')}</td>
                      <td className="table-cell text-right font-bold text-slate-900">₹{item.remainingBalance?.toLocaleString('en-IN')}</td>
                      <td className="table-cell">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="table-cell text-right">
                        {item.status === 'PAID' ? (
                          <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setPayingEmi(item)}
                            className="btn-primary py-1 px-3 text-[11px] uppercase cursor-pointer bg-emerald-700 hover:bg-emerald-800 border-emerald-700"
                          >
                            Pay EMI →
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* PAY EMI MODAL */}
      {payingEmi && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handlePayEmi} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-5 text-xs shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Secure EMI Payment Gateway</span>
                <h3 className="font-bold text-base text-slate-900">Pay Installment #{payingEmi.emiNumber}</h3>
              </div>
              <button type="button" onClick={() => setPayingEmi(null)} className="text-slate-400 hover:text-black font-bold p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Breakdown */}
            <div className="p-4 bg-slate-50 border border-slate-200 space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Loan Number:</span>
                <strong>{loan?.loanNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Due Date:</span>
                <span>{payingEmi.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Principal Portion:</span>
                <span>₹{payingEmi.principalComponent?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Interest Portion:</span>
                <span>₹{payingEmi.interestComponent?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 text-slate-900">
                <span>Total Amount Payable:</span>
                <span className="text-emerald-700">₹{payingEmi.emiAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Select Test Payment Mode:</label>
              <div className="grid grid-cols-3 gap-2 font-semibold">
                {['UPI', 'NET_BANKING', 'DEBIT_CARD'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 px-1 text-center border cursor-pointer ${
                      paymentMethod === m
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {m.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPayingEmi(null)}
                className="btn-secondary py-2 px-4 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="btn-primary py-2 px-6 text-xs uppercase bg-emerald-700 hover:bg-emerald-800 border-emerald-700 flex items-center gap-1.5"
              >
                <span>{processing ? 'Processing Payment...' : `Authorize ₹${payingEmi.emiAmount?.toLocaleString('en-IN')} →`}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
