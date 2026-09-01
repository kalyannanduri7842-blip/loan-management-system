import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { CalendarCheck2, AlertTriangle, CheckCircle, X, Banknote } from 'lucide-react';

export function AdminEmiManagement() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmi, setSelectedEmi] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [txRef, setTxRef] = useState('');
  const [processing, setProcessing] = useState(false);

  const { addToast } = useToast();

  const fetchEmiData = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getEmiManagement();
      setData(res);
    } catch (err) {
      console.warn('EMI error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmiData();
  }, []);

  const handleCollectEmi = async (e) => {
    e.preventDefault();
    if (!selectedEmi) return;

    setProcessing(true);
    try {
      const res = await api.admin.collectOfflineEmi(selectedEmi.id, {
        paymentMethod,
        transactionRef: txRef || `OFFLINE-RECEIPT-${Date.now().toString().slice(-5)}`
      });

      addToast('Payment Recorded', res.message, 'success');
      setSelectedEmi(null);
      fetchEmiData();
    } catch (err) {
      addToast('Error', err.message || 'Could not record collection', 'error');
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
            <CalendarCheck2 className="w-5 h-5 text-slate-900" />
            <span>EMI Collections & Portfolio Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor overdue borrower installments, upcoming maturities, and record offline cash/branch payments
          </p>
        </div>

        {data?.overdue?.length > 0 && (
          <div className="p-2 bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800 flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{data.overdue.length} Overdue EMIs (₹{data.totalOverdueAmount?.toLocaleString('en-IN')})</span>
          </div>
        )}
      </div>

      {/* 1. OVERDUE REPAYMENTS */}
      {data?.overdue?.length > 0 && (
        <div className="border border-rose-300 bg-white space-y-3 text-xs shadow-sm">
          <div className="p-4 bg-rose-50 border-b border-rose-200 flex justify-between items-center text-rose-900 font-bold uppercase tracking-wider">
            <span>Critical Overdue Installments ({data.overdue.length})</span>
            <span className="font-mono text-rose-700">Immediate recovery action required</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">Loan Number</th>
                  <th className="table-header">Borrower Name</th>
                  <th className="table-header text-center">EMI #</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header text-right">Overdue Amount</th>
                  <th className="table-header text-right">Collect Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100 font-medium font-mono">
                {data.overdue.map((s) => (
                  <tr key={s.id} className="hover:bg-rose-50/50">
                    <td className="table-cell font-bold text-slate-900">{s.loanNumber}</td>
                    <td className="table-cell font-sans font-semibold">{s.customerName}</td>
                    <td className="table-cell text-center">#{s.emiNumber}</td>
                    <td className="table-cell text-rose-700 font-bold">{s.dueDate}</td>
                    <td className="table-cell text-right font-bold text-rose-800">₹{s.emiAmount?.toLocaleString('en-IN')}</td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => { setSelectedEmi(s); setTxRef(`CASH-REC-${Date.now().toString().slice(-5)}`); }}
                        className="btn-danger py-1 px-3 text-[11px] uppercase cursor-pointer inline-flex items-center gap-1"
                      >
                        <Banknote className="w-3 h-3" />
                        <span>Record Collection</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. UPCOMING INSTALLMENTS */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-slate-900">
            Upcoming Customer EMI Schedule ({data?.upcoming?.length || 0})
          </span>
          <span className="text-[11px] font-mono text-slate-400">Scheduled active maturities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Loan Number</th>
                <th className="table-header">Borrower Name</th>
                <th className="table-header text-center">EMI #</th>
                <th className="table-header">Scheduled Due Date</th>
                <th className="table-header text-right">EMI Installment</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono">
              {data?.upcoming?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No upcoming EMIs queued.</td>
                </tr>
              ) : (
                data?.upcoming?.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="table-cell font-bold text-slate-900">{s.loanNumber}</td>
                    <td className="table-cell font-sans font-semibold">{s.customerName}</td>
                    <td className="table-cell text-center">#{s.emiNumber}</td>
                    <td className="table-cell text-slate-700">{s.dueDate}</td>
                    <td className="table-cell text-right font-bold text-slate-900">₹{s.emiAmount?.toLocaleString('en-IN')}</td>
                    <td className="table-cell">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => { setSelectedEmi(s); setTxRef(`BRANCH-REC-${Date.now().toString().slice(-5)}`); }}
                        className="btn-secondary py-1 px-3 text-[11px] uppercase cursor-pointer"
                      >
                        Record Payment →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COLLECT OFFLINE PAYMENT MODAL */}
      {selectedEmi && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleCollectEmi} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-5 text-xs shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Manual Branch Collection</span>
                <h3 className="font-bold text-base text-slate-900">Collect EMI #{selectedEmi.emiNumber}</h3>
              </div>
              <button type="button" onClick={() => setSelectedEmi(null)} className="text-slate-400 hover:text-black font-bold p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Loan Number:</span>
                <strong>{selectedEmi.loanNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <strong>{selectedEmi.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Due:</span>
                <strong className="text-emerald-800 text-sm">₹{selectedEmi.emiAmount?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Collection Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="input-field cursor-pointer font-semibold"
                >
                  <option value="CASH">Cash Over Counter</option>
                  <option value="CHEQUE">Cheque / Demand Draft</option>
                  <option value="NEFT">Direct Bank Transfer (NEFT)</option>
                  <option value="UPI">UPI QR Scanner</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt / Cheque Ref</label>
                <input
                  type="text"
                  required
                  value={txRef}
                  onChange={(e) => setTxRef(e.target.value)}
                  className="input-field font-mono uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setSelectedEmi(null)} className="btn-secondary py-2 px-4 text-xs">
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="btn-primary py-2 px-6 text-xs uppercase"
              >
                {processing ? 'Recording...' : 'Confirm Payment Record →'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
