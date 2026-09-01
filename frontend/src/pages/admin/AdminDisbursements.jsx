import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Banknote, CheckCircle, ArrowRight, X } from 'lucide-react';

export function AdminDisbursements() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [disburseRef, setDisburseRef] = useState('');
  const [processing, setProcessing] = useState(false);

  const { addToast } = useToast();

  const fetchApprovedLoans = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getLoans({ status: 'APPROVED' });
      setLoans(res.loans || []);
    } catch (err) {
      console.warn('Disbursements error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedLoans();
  }, []);

  const handleDisburse = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return;

    setProcessing(true);
    try {
      const res = await api.admin.disburseLoan(selectedLoan.id, {
        disbursementRef: disburseRef || `NEFT-${Date.now().toString().slice(-6)}`
      });

      addToast(
        'Loan Disbursed Successfully!',
        res.message || `Disbursed ₹${selectedLoan.principalAmount} to ${selectedLoan.customerName}.`,
        'success'
      );

      setSelectedLoan(null);
      fetchApprovedLoans();
    } catch (err) {
      addToast('Disbursement Error', err.message || 'Could not disburse loan', 'error');
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
            <Banknote className="w-5 h-5 text-slate-900" />
            <span>Loan Disbursements Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorize NEFT/RTGS fund transfers for sanctioned loan applications into customer bank accounts
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-emerald-800 text-white px-3 py-1 self-start sm:self-auto">
          Pending Payouts: {loans.length}
        </span>
      </div>

      {/* Table */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Loan ID</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Sanctioned Principal</th>
                <th className="table-header">Rate & Tenure</th>
                <th className="table-header">Beneficiary Bank Details</th>
                <th className="table-header text-right">Disburse Funds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    All approved loans have been disbursed! No pending payouts in queue.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">{loan.loanNumber}</td>
                    <td className="table-cell">
                      <strong className="text-slate-900 block">{loan.customerName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{loan.customerEmail}</span>
                    </td>
                    <td className="table-cell font-semibold">{loan.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold text-emerald-800 text-sm">
                      ₹{loan.principalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell font-mono">
                      {loan.annualInterestRate}% p.a. • {loan.tenureMonths} Mos
                    </td>
                    <td className="table-cell font-mono text-[11px] text-slate-700">
                      <strong>{loan.bankDetails?.bankName}</strong> ({loan.bankDetails?.accountNumber})
                      <span className="block text-slate-400">IFSC: {loan.bankDetails?.ifscCode}</span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => {
                          setSelectedLoan(loan);
                          setDisburseRef(`NEFT-P2P-${Date.now().toString().slice(-6)}`);
                        }}
                        className="btn-success py-1.5 px-3 text-xs uppercase bg-emerald-800 hover:bg-emerald-900 border-emerald-800 flex items-center gap-1.5 cursor-pointer inline-flex"
                      >
                        <Banknote className="w-3.5 h-3.5" />
                        <span>Disburse Loan →</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISBURSE CONFIRMATION MODAL */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleDisburse} className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-5 text-xs shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-emerald-700 uppercase font-bold">Banking Transfer Authorization</span>
                <h3 className="font-bold text-base text-slate-900">Disburse {selectedLoan.loanNumber}</h3>
              </div>
              <button type="button" onClick={() => setSelectedLoan(null)} className="text-slate-400 hover:text-black font-bold p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <strong>{selectedLoan.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <strong className="text-emerald-800 text-sm">₹{selectedLoan.principalAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank & Account:</span>
                <span>{selectedLoan.bankDetails?.bankName} • {selectedLoan.bankDetails?.accountNumber}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Reference / UTR Number</label>
              <input
                type="text"
                required
                value={disburseRef}
                onChange={(e) => setDisburseRef(e.target.value)}
                className="input-field font-mono uppercase"
              />
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
              Disbursing will transition the loan to <strong>ACTIVE</strong>, generate the full <strong>{selectedLoan.tenureMonths}-month EMI Amortization Schedule</strong>, and notify the customer.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setSelectedLoan(null)} className="btn-secondary py-2 px-4 text-xs">
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="btn-success py-2 px-6 text-xs uppercase bg-emerald-800 hover:bg-emerald-900 border-emerald-800"
              >
                {processing ? 'Transferring Funds...' : 'Confirm Disbursement →'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
