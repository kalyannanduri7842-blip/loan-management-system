import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Banknote,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Landmark,
  ShieldCheck,
  Search,
  Receipt,
  X
} from 'lucide-react';

export function ManagerDisbursements() {
  const [pendingDisbursements, setPendingDisbursements] = useState([]);
  const [disbursementHistory, setDisbursementHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [disbursing, setDisbursing] = useState(false);
  const [paymentRemarks, setPaymentRemarks] = useState('');

  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchDisbursements = async () => {
    setLoading(true);
    try {
      const res = await api.manager.getDisbursements();
      setPendingDisbursements(res.pendingDisbursements || []);
      setDisbursementHistory(res.disbursementHistory || []);
    } catch (err) {
      console.warn('Disbursements fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursements();
  }, []);

  const handleDisburse = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return;

    setDisbursing(true);
    try {
      const res = await api.manager.disburseLoan(selectedLoan.id, {
        disbursementRef: `TXN-SIM-NEFT-${Date.now().toString().slice(-6)}`,
        paymentRemarks
      });

      addToast(
        'Loan Disbursed Successfully!',
        `Your loan of ₹${selectedLoan.principalAmount?.toLocaleString('en-IN')} has been successfully disbursed in the development/test environment.`,
        'success'
      );

      setSelectedLoan(null);
      fetchDisbursements();
    } catch (err) {
      addToast('Disbursement Error', err.message || 'Could not execute disbursement', 'error');
    } finally {
      setDisbursing(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-purple-600" />
          <span>Loan Disbursement & Fund Settlement Management</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute authorized fund transfers to customer bank accounts in the safe simulated development environment
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="border border-indigo-200 bg-indigo-50/70 p-4 flex items-start gap-3 text-xs font-mono">
        <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-indigo-950 font-bold block uppercase">Development / Safe Test Payment Simulation</strong>
          <span className="text-indigo-900 font-sans text-[11px] leading-relaxed">
            All disbursement transactions on this portal are executed through a safe internal accounting simulator. 
            Real banking NEFT/RTGS rails are simulated with verified database ledger entries, immediate EMI amortization generation, and customer notification dispatch.
          </span>
        </div>
      </div>

      {/* 1. PENDING DISBURSEMENTS QUEUE */}
      <div className="border border-slate-200 bg-white shadow-sm text-xs space-y-4">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h2 className="font-bold uppercase tracking-wider text-slate-900">
              Sanctioned Loans Awaiting Fund Transfer ({pendingDisbursements.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-purple-700 font-bold">
            Total Ready: ₹{pendingDisbursements.reduce((sum, l) => sum + (l.principalAmount || 0), 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Loan #</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Sanctioned Amount</th>
                <th className="table-header">Rate & Tenure</th>
                <th className="table-header">Customer Bank Details</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pendingDisbursements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No approved loans currently pending disbursement.
                  </td>
                </tr>
              ) : (
                pendingDisbursements.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">
                      {loan.loanNumber}
                    </td>
                    <td className="table-cell font-bold text-slate-900">{loan.customerName}</td>
                    <td className="table-cell font-semibold">{loan.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold text-emerald-800 text-sm">
                      ₹{loan.principalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell font-mono text-[11px]">
                      {loan.annualInterestRate}% p.a. • {loan.tenureMonths}M
                    </td>
                    <td className="table-cell font-mono text-[11px] text-slate-600">
                      {loan.bankDetails?.bankName} ({loan.bankDetails?.accountNumber})
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedLoan(loan)}
                        className="btn-primary py-1 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Money / Disburse</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. DISBURSEMENT HISTORY LEDGER */}
      <div className="border border-slate-200 bg-white shadow-sm text-xs space-y-4">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold uppercase tracking-wider text-slate-900">
              Completed Disbursements Ledger ({disbursementHistory.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">All historical fund settlements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Disbursement Ref</th>
                <th className="table-header">Loan #</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header text-right">Disbursed Amount</th>
                <th className="table-header">Credited Bank Account</th>
                <th className="table-header">Authorized By</th>
                <th className="table-header">Date & Timestamp</th>
                <th className="table-header text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono">
              {disbursementHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No disbursement transactions recorded yet.
                  </td>
                </tr>
              ) : (
                disbursementHistory.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="table-cell font-bold text-slate-900">{d.disbursementRef || d.id}</td>
                    <td className="table-cell">{d.loanNumber}</td>
                    <td className="table-cell font-sans font-bold">{d.customerName}</td>
                    <td className="table-cell text-right font-bold text-emerald-800">
                      ₹{d.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-[11px] text-slate-600">
                      {d.bankDetails?.bankName} ({d.bankDetails?.accountNumber})
                    </td>
                    <td className="table-cell font-sans text-[11px] text-slate-700">{d.disbursedBy}</td>
                    <td className="table-cell text-slate-500">{new Date(d.disbursedAt).toLocaleString('en-IN')}</td>
                    <td className="table-cell text-center">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        SUCCESS
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISBURSEMENT CONFIRMATION MODAL */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border border-slate-300 p-6 space-y-6 text-xs font-sans shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-emerald-700 uppercase font-bold">Fund Transfer Execution</span>
                <h3 className="font-bold text-base text-slate-900">Execute Loan Disbursement</h3>
              </div>
              <button
                onClick={() => setSelectedLoan(null)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border border-emerald-300 bg-emerald-50/70 space-y-3 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">Customer:</span>
                <strong className="text-slate-900">{selectedLoan.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Loan Account:</span>
                <strong className="text-slate-900">{selectedLoan.loanNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sanctioned Principal:</span>
                <strong className="text-emerald-900 text-sm font-bold">₹{selectedLoan.principalAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Beneficiary Bank:</span>
                <strong className="text-slate-900">{selectedLoan.bankDetails?.bankName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Account Number:</span>
                <strong className="text-slate-900">{selectedLoan.bankDetails?.accountNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">IFSC Code:</span>
                <strong className="text-slate-900">{selectedLoan.bankDetails?.ifscCode}</strong>
              </div>
            </div>

            <form onSubmit={handleDisburse} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transfer Remarks / Reference Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Authorized under retail credit policy 2026"
                  value={paymentRemarks}
                  onChange={(e) => setPaymentRemarks(e.target.value)}
                  className="input-field font-mono"
                />
              </div>

              <div className="p-3 border border-slate-200 bg-slate-50 text-[11px] text-slate-500 font-mono">
                Clicking "Send Money" will execute the safe simulated bank transfer, generate the {selectedLoan.tenureMonths}-month amortization schedule, and update loan status to ACTIVE.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLoan(null)}
                  className="btn-secondary py-2 px-4 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={disbursing}
                  className="btn-primary py-2 px-6 text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-white font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <span>{disbursing ? 'Transferring...' : `Send Money (₹${selectedLoan.principalAmount?.toLocaleString('en-IN')})`}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
