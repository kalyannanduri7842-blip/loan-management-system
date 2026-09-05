import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { History, Eye, Search, FileText } from 'lucide-react';

export function EmployeeHistory() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.employee.getHistory();
      setApplications(res.applications || []);
    } catch (err) {
      console.warn('History error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filtered = applications.filter(app => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.applicationNumber.toLowerCase().includes(q) ||
        app.customerName.toLowerCase().includes(q) ||
        app.loanDetails?.loanType?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <span>Processed Applications History Ledger</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Archival record of all loan requests audited, recommended, or rejected by verification officers
        </p>
      </div>

      {/* Filter Bar */}
      <div className="border border-slate-200 bg-white p-4 flex justify-between items-center text-xs">
        <span className="font-bold text-slate-700">Audit Registry ({filtered.length} Records)</span>
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-1 text-xs font-mono"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 bg-white shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Requested</th>
                <th className="table-header text-right">Recommended</th>
                <th className="table-header">Officer Decision / Notes</th>
                <th className="table-header">Verification Date</th>
                <th className="table-header">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No processed applications found in history.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell font-bold">{app.customerName}</td>
                    <td className="table-cell">{app.loanDetails?.loanType}</td>
                    <td className="table-cell text-right font-mono text-slate-900 font-bold">
                      ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-right font-mono text-emerald-800 font-bold">
                      {app.employeeVerification?.recommendedAmount ? `₹${app.employeeVerification.recommendedAmount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="table-cell text-[11px] text-slate-600 max-w-[280px]">
                      {app.employeeVerification?.verificationNotes || app.rejectionReason || '—'}
                    </td>
                    <td className="table-cell font-mono text-slate-500">
                      {app.employeeVerification?.verifiedAt ? new Date(app.employeeVerification.verifiedAt).toLocaleDateString('en-IN') : new Date(app.updatedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
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
