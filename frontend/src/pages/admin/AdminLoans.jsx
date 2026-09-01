import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Receipt, Search, CalendarDays } from 'lucide-react';

export function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getLoans({ status: statusFilter, search });
      setLoans(res.loans || []);
    } catch (err) {
      console.warn('Error fetching loans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLoans();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-900" />
            <span>Active & Historic Loan Accounts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of all sanctioned, disbursed, active, and fully closed customer loan portfolios
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Search by Loan ID, Customer Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field cursor-pointer font-semibold"
            >
              <option value="ALL">All Loan Statuses</option>
              <option value="APPROVED">Approved (Awaiting Payout)</option>
              <option value="ACTIVE">Active (In Repayment)</option>
              <option value="CLOSED">Closed (100% Repaid)</option>
            </select>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Loan ID</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Type</th>
                <th className="table-header text-right">Principal</th>
                <th className="table-header text-right">Rate</th>
                <th className="table-header text-right">Monthly EMI</th>
                <th className="table-header text-right">Remaining Balance</th>
                <th className="table-header text-center">EMIs Paid</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No loan records found.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50">
                    <td className="table-cell font-bold text-slate-900">{loan.loanNumber}</td>
                    <td className="table-cell font-sans">
                      <strong className="text-slate-900 block">{loan.customerName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{loan.customerEmail}</span>
                    </td>
                    <td className="table-cell font-sans font-semibold">{loan.loanType}</td>
                    <td className="table-cell text-right font-bold">₹{loan.principalAmount?.toLocaleString('en-IN')}</td>
                    <td className="table-cell text-right">{loan.annualInterestRate}%</td>
                    <td className="table-cell text-right font-bold text-slate-900">₹{loan.emiAmount?.toLocaleString('en-IN')}</td>
                    <td className="table-cell text-right font-bold text-emerald-800">₹{loan.remainingPrincipal?.toLocaleString('en-IN')}</td>
                    <td className="table-cell text-center">{loan.paidEmisCount || 0} / {loan.totalEmisCount}</td>
                    <td className="table-cell font-sans">
                      <StatusBadge status={loan.status} />
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
