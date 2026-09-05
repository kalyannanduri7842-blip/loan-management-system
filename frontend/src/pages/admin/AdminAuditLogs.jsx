import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldAlert, Search, Filter, Clock, User, ShieldCheck } from 'lucide-react';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getAuditLogs();
      setLogs(res.logs || []);
    } catch (err) {
      console.warn('Audit logs fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(log => {
    if (roleFilter !== 'ALL' && log.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.action?.toLowerCase().includes(q) ||
        log.actor?.toLowerCase().includes(q) ||
        log.details?.toLowerCase().includes(q) ||
        log.targetId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            <span>Master System Governance & Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable chronological ledger of all customer applications, employee verifications, manager sanctions & disbursements
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1 self-start sm:self-auto">
          Audit Entries: {filtered.length}
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs shadow-sm">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="font-semibold text-slate-700">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field py-1 text-xs"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="EMPLOYEE">Employee (Verification)</option>
            <option value="MANAGER">Manager (Underwriting)</option>
            <option value="ADMIN">Administrator</option>
            <option value="SYSTEM">System</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-1 text-xs font-mono"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="border border-slate-200 bg-white shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Timestamp</th>
                <th className="table-header">Action Type</th>
                <th className="table-header">Actor / User</th>
                <th className="table-header">Role</th>
                <th className="table-header">Target ID</th>
                <th className="table-header">Status Transition / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="table-cell text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell font-bold text-slate-900">{log.action}</td>
                    <td className="table-cell font-sans font-bold text-slate-900">{log.actor}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${
                        log.role === 'ADMIN'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : log.role === 'MANAGER'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : log.role === 'EMPLOYEE'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="table-cell font-bold text-slate-700">{log.targetId || '—'}</td>
                    <td className="table-cell font-sans text-slate-600 max-w-[340px]">{log.details}</td>
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
