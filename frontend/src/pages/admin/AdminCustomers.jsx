import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Phone, Mail, ShieldCheck, Power, Eye, X, FileText, BadgeIndianRupee } from 'lucide-react';

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCust, setSelectedCust] = useState(null);
  const { addToast } = useToast();

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

  const handleToggleStatus = async (id, name, currentStatus) => {
    try {
      const res = await api.admin.toggleCustomerStatus(id);
      addToast('Status Updated', `Customer ${name} account marked as ${res.customer?.status}.`, 'info');
      fetchCustomers();
    } catch (err) {
      addToast('Error', err.message || 'Could not change customer status', 'error');
    }
  };

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
            <Users className="w-5 h-5 text-emerald-600" />
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
      <div className="bg-white border border-slate-200 p-4 text-xs shadow-sm">
        <input
          type="text"
          placeholder="Search by Customer Name, Email, Phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field font-mono"
        />
      </div>

      {/* Table */}
      <div className="border border-slate-200 bg-white shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Contact & Email</th>
                <th className="table-header text-right">Monthly Income</th>
                <th className="table-header text-center">CIBIL Score</th>
                <th className="table-header text-center">Applications</th>
                <th className="table-header text-center">Active Loans</th>
                <th className="table-header text-right">Total Borrowed</th>
                <th className="table-header text-center">Account Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-sans">
                    No customers found matching search criteria.
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
                    <td className="table-cell text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        c.status === 'INACTIVE'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {c.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setSelectedCust(c)}
                          className="btn-secondary py-1 px-2 text-[10px] inline-flex items-center gap-1 font-bold"
                          title="View Customer Profile"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(c.id, c.fullName, c.status)}
                          className={`py-1 px-2 text-[10px] font-bold border transition-colors ${
                            c.status === 'INACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                          }`}
                          title={c.status === 'INACTIVE' ? 'Activate Account' : 'Deactivate Account'}
                        >
                          {c.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border border-slate-300 p-6 space-y-6 text-xs font-sans shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-emerald-700 uppercase font-bold">Borrower Record</span>
                <h3 className="font-bold text-base text-slate-900">{selectedCust.fullName}</h3>
                <p className="text-[11px] text-slate-500">{selectedCust.email}</p>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 border">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Monthly Income</span>
                  <strong className="text-slate-900">₹{selectedCust.monthlyIncome?.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">CIBIL Score</span>
                  <strong className="text-emerald-800 font-bold">{selectedCust.creditScore || 780}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Total Applications</span>
                  <strong className="text-slate-900">{selectedCust.applicationsCount}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Active Loans</span>
                  <strong className="text-slate-900">{selectedCust.activeLoansCount}</strong>
                </div>
              </div>

              <div className="p-3 border bg-slate-50 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase block">Residential Address</span>
                <p className="font-sans text-slate-800">{selectedCust.address}, {selectedCust.city}, {selectedCust.state} - {selectedCust.postalCode}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-end">
              <button
                onClick={() => setSelectedCust(null)}
                className="btn-secondary py-1.5 px-4 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
