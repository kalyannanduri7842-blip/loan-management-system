import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Search, Plus, UserPlus, X, Shield, Phone, Mail } from 'lucide-react';

export function AdminManagers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+91 98765 22222',
    department: 'Credit Approvals & Disbursement',
    password: 'password123'
  });
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getManagers();
      setManagers(res.managers || []);
    } catch (err) {
      console.warn('Managers fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleToggleStatus = async (id, name) => {
    try {
      const res = await api.admin.toggleManagerStatus(id);
      addToast('Status Changed', `Manager ${name} account status is now ${res.manager?.status}.`, 'info');
      fetchManagers();
    } catch (err) {
      addToast('Error', err.message || 'Could not toggle manager status', 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.admin.createManager(formData);
      addToast('Manager Created', `Credit Manager ${formData.fullName} added successfully.`, 'success');
      setShowCreateModal(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '+91 98765 22222',
        department: 'Credit Approvals & Disbursement',
        password: 'password123'
      });
      fetchManagers();
    } catch (err) {
      addToast('Creation Error', err.message || 'Could not create manager', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = managers.filter(m =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.employeeId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span>Underwriting & Sanction Managers Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Credit approval authorities, sanctioned portfolio limits, and manager performance analytics
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-500 border-purple-600 text-white font-bold self-start sm:self-auto uppercase tracking-wider"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Credit Manager</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 p-4 text-xs shadow-sm">
        <input
          type="text"
          placeholder="Search by Manager Name, Email, Manager ID..."
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
                <th className="table-header">Manager ID</th>
                <th className="table-header">Full Legal Name</th>
                <th className="table-header">Official Email</th>
                <th className="table-header">Department</th>
                <th className="table-header text-center">Reviewed</th>
                <th className="table-header text-center">Approved</th>
                <th className="table-header text-center">Rejected</th>
                <th className="table-header text-center">Account Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-sans">
                    No credit managers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((mgr) => (
                  <tr key={mgr.id} className="hover:bg-slate-50">
                    <td className="table-cell font-bold text-slate-900">{mgr.employeeId || 'MGR-2001'}</td>
                    <td className="table-cell font-sans font-bold text-slate-900">{mgr.fullName}</td>
                    <td className="table-cell text-slate-600">{mgr.email}</td>
                    <td className="table-cell font-sans">{mgr.department || 'Credit Approvals'}</td>
                    <td className="table-cell text-center font-bold text-slate-900">{mgr.totalReviewed || 0}</td>
                    <td className="table-cell text-center font-bold text-emerald-800">{mgr.approvedCount || 0}</td>
                    <td className="table-cell text-center font-bold text-rose-800">{mgr.rejectedCount || 0}</td>
                    <td className="table-cell text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        mgr.status === 'INACTIVE'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-purple-50 text-purple-800 border-purple-300'
                      }`}>
                        {mgr.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => handleToggleStatus(mgr.id, mgr.fullName)}
                        className={`py-1 px-2.5 text-[10px] font-bold border transition-colors cursor-pointer ${
                          mgr.status === 'INACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        {mgr.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MANAGER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-6 text-xs font-sans shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-purple-700 uppercase font-bold">Executive Authority</span>
                <h3 className="font-bold text-base text-slate-900">Add New Credit Manager</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sumanth Rao"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="sumanth.mgr@demo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-field"
                  >
                    <option value="Credit Approvals & Disbursement">Credit Approvals & Disbursement</option>
                    <option value="Risk & Portfolio Management">Risk & Portfolio Management</option>
                    <option value="Commercial Credit Sanctions">Commercial Credit Sanctions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Temporary Initial Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary py-2 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-6 text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 border-purple-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{submitting ? 'Registering...' : 'Register Manager'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
