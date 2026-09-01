import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Search, Phone, Mail, ShieldCheck } from 'lucide-react';

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getCustomers();
      setCustomers(res.customers || []);
    } catch (err) {
      console.warn('Error fetching customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-900" />
            <span>Registered Borrowers & Customers Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer KYC records, verified income profiles, CIBIL credit ratings, and lifetime loan history
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1 self-start sm:self-auto">
          Active Borrowers: {customers.length}
        </span>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 p-4 text-xs">
        <input
          type="text"
          placeholder="Search by Customer Name, Email, Phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Table */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Contact & Email</th>
                <th className="table-header text-right">Monthly Income</th>
                <th className="table-header text-center">CIBIL Score</th>
                <th className="table-header text-center">Total Applications</th>
                <th className="table-header text-center">Active Loans</th>
                <th className="table-header text-right">Total Borrowed</th>
                <th className="table-header">Onboarded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 font-mono">
                    <td className="table-cell font-sans font-bold text-slate-900">{c.fullName}</td>
                    <td className="table-cell text-slate-600">
                      <span>{c.email}</span>
                      <span className="block text-[10px] text-slate-400">{c.phone}</span>
                    </td>
                    <td className="table-cell text-right font-bold text-slate-900">
                      ₹{c.monthlyIncome?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-center font-bold text-emerald-800">
                      {c.creditScore || 780} / 900
                    </td>
                    <td className="table-cell text-center">{c.applicationsCount}</td>
                    <td className="table-cell text-center font-bold">{c.activeLoansCount}</td>
                    <td className="table-cell text-right font-bold text-emerald-800">
                      ₹{c.totalBorrowed?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-slate-500">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
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
