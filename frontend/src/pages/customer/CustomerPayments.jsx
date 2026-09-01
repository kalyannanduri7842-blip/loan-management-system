import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ReceiptText, Download, CheckCircle2 } from 'lucide-react';

export function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.loans.getMyPayments();
      setPayments(res.payments || []);
    } catch (err) {
      console.warn('Payments error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-slate-900" />
          <span>Payment History & Receipts</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Record of all online and branch EMI installment payments made across your loans
        </p>
      </div>

      {/* Table */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-slate-900">
            Transactions Registry ({payments.length})
          </span>
          <span className="text-[11px] font-mono text-slate-400">All successful payments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Transaction ID</th>
                <th className="table-header">Loan #</th>
                <th className="table-header text-center">EMI #</th>
                <th className="table-header text-right">Amount Paid</th>
                <th className="table-header">Mode</th>
                <th className="table-header">Date & Timestamp</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payment records found yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="table-cell font-bold text-slate-900">{p.transactionRef || p.id}</td>
                    <td className="table-cell">{p.loanNumber}</td>
                    <td className="table-cell text-center font-bold">Installment #{p.emiNumber}</td>
                    <td className="table-cell text-right font-bold text-emerald-800">₹{p.amountPaid?.toLocaleString('en-IN')}</td>
                    <td className="table-cell">{p.paymentMethod}</td>
                    <td className="table-cell text-slate-500">{new Date(p.paymentDate).toLocaleString('en-IN')}</td>
                    <td className="table-cell">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        SUCCESS
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => alert(`Downloading official digital payment receipt for ${p.transactionRef}...`)}
                        className="btn-secondary py-1 px-2.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
