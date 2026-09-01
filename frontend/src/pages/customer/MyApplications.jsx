import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FilePlus2,
  Calendar,
  X,
  ArrowRight
} from 'lucide-react';

export function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.applications.getMy();
      setApplications(res.applications || []);
    } catch (err) {
      console.warn('Applications error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-900" />
            <span>My Loan Applications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track status, underwriting decisions, and administrative remarks for all your loan requests
          </p>
        </div>

        <Link
          to="/apply-loan"
          className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto bg-emerald-700 hover:bg-emerald-800 border-emerald-700"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>New Application</span>
        </Link>
      </div>

      {/* Applications Table */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-slate-900">
            Submitted Applications Ledger ({applications.length})
          </span>
          <span className="text-[11px] font-mono text-slate-400">All lifecycle statuses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Requested Amount</th>
                <th className="table-header text-center">Tenure</th>
                <th className="table-header">Application Date</th>
                <th className="table-header">Status</th>
                <th className="table-header">Admin Decision Remarks</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    You have not submitted any loan applications yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold text-slate-900">
                      ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-center font-mono">
                      {app.loanDetails?.tenureMonths} Months
                    </td>
                    <td className="table-cell font-mono text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell font-mono text-[11px] text-slate-600 max-w-[220px]">
                      {app.adminRemarks || (app.status === 'PENDING_REVIEW' ? 'Under review by underwriting committee' : '—')}
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn-secondary py-1 px-2.5 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full border border-slate-300 p-6 space-y-6 max-h-[90vh] overflow-y-auto text-xs shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Loan Application Record</span>
                <h3 className="font-bold text-base text-slate-900">{selectedApp.applicationNumber} — {selectedApp.loanDetails?.loanType}</h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-black font-bold p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Decision Banner */}
            <div className="p-4 border border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Workflow State</span>
                <StatusBadge status={selectedApp.status} className="mt-1" />
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">Submitted On</span>
                <strong className="text-slate-900">{new Date(selectedApp.createdAt).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Financial & Terms Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900 text-white font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Requested Amount</span>
                <strong className="text-sm text-emerald-400 font-bold">₹{selectedApp.loanDetails?.requestedAmount?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Tenure</span>
                <strong className="text-sm font-bold">{selectedApp.loanDetails?.tenureMonths} Months</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Monthly Income</span>
                <strong className="text-sm font-bold">₹{selectedApp.employmentDetails?.monthlyIncome?.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">CIBIL Score</span>
                <strong className="text-sm text-emerald-300 font-bold">{selectedApp.creditAssessment?.creditScore || 780}</strong>
              </div>
            </div>

            {/* Admin Decision Remarks */}
            <div className="space-y-1 p-3.5 border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-800 block">Credit Committee Remarks:</span>
              <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                {selectedApp.adminRemarks || 'Your application is currently undergoing standard employment verification and document audit.'}
              </p>
              {selectedApp.rejectionReason && (
                <p className="text-rose-700 font-bold font-mono text-[11px] pt-1">
                  Rejection Reason: {selectedApp.rejectionReason}
                </p>
              )}
            </div>

            {/* Bank Details */}
            <div className="border border-slate-200 p-4 space-y-2">
              <span className="font-bold uppercase text-slate-800 block">Disbursement Bank Account</span>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-600">
                <div>Bank: <strong>{selectedApp.bankDetails?.bankName}</strong></div>
                <div>Account: <strong>{selectedApp.bankDetails?.accountNumber}</strong></div>
                <div>IFSC: <strong>{selectedApp.bankDetails?.ifscCode}</strong></div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="btn-secondary py-1.5 px-4 text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
