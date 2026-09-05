import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { UserCheck, Search, Plus, UserPlus, X, Shield, Phone, Mail, CheckCircle2 } from 'lucide-react';

export function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+91 98765 00000',
    department: 'KYC & Document Audits',
    password: 'password123'
  });
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getEmployees();
      setEmployees(res.employees || []);
    } catch (err) {
      console.warn('Employees fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleToggleStatus = async (id, name) => {
    try {
      const res = await api.admin.toggleEmployeeStatus(id);
      addToast('Status Changed', `Officer ${name} account status is now ${res.employee?.status}.`, 'info');
      fetchEmployees();
    } catch (err) {
      addToast('Error', err.message || 'Could not toggle officer status', 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.admin.createEmployee(formData);
      addToast('Employee Created', `Verification officer ${formData.fullName} added successfully.`, 'success');
      setShowCreateModal(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '+91 98765 00000',
        department: 'KYC & Document Audits',
        password: 'password123'
      });
      fetchEmployees();
    } catch (err) {
      addToast('Creation Error', err.message || 'Could not create employee', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Verification Officers & Staff Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage KYC verification officers, assign departmental roles, and inspect underwriting productivity
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-500 border-blue-600 text-white font-bold self-start sm:self-auto uppercase tracking-wider"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Verification Officer</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 p-4 text-xs shadow-sm">
        <input
          type="text"
          placeholder="Search by Officer Name, Email, Employee ID..."
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
                <th className="table-header">Officer ID</th>
                <th className="table-header">Full Legal Name</th>
                <th className="table-header">Email Address</th>
                <th className="table-header">Assigned Department</th>
                <th className="table-header text-center">Audits Done</th>
                <th className="table-header text-center">Recommended</th>
                <th className="table-header text-center">Rejected</th>
                <th className="table-header text-center">Account Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-sans">
                    No verification officers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="table-cell font-bold text-slate-900">{emp.employeeId || 'EMP-3001'}</td>
                    <td className="table-cell font-sans font-bold text-slate-900">{emp.fullName}</td>
                    <td className="table-cell text-slate-600">{emp.email}</td>
                    <td className="table-cell font-sans">{emp.department || 'KYC Audits'}</td>
                    <td className="table-cell text-center font-bold text-slate-900">{emp.totalProcessed || 0}</td>
                    <td className="table-cell text-center font-bold text-emerald-800">{emp.recommendedCount || 0}</td>
                    <td className="table-cell text-center font-bold text-rose-800">{emp.rejectedCount || 0}</td>
                    <td className="table-cell text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        emp.status === 'INACTIVE'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300'
                      }`}>
                        {emp.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => handleToggleStatus(emp.id, emp.fullName)}
                        className={`py-1 px-2.5 text-[10px] font-bold border transition-colors cursor-pointer ${
                          emp.status === 'INACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        {emp.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EMPLOYEE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-slate-300 p-6 space-y-6 text-xs font-sans shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[10px] text-blue-700 uppercase font-bold">Staff Onboarding</span>
                <h3 className="font-bold text-base text-slate-900">Add New Verification Officer</h3>
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
                  placeholder="e.g. Ankit Verma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ankit.emp@demo.com"
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
                    <option value="KYC & Document Audits">KYC & Document Audits</option>
                    <option value="Retail Loan Underwriting">Retail Loan Underwriting</option>
                    <option value="Credit Bureau Audits">Credit Bureau Audits</option>
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
                  className="btn-primary py-2 px-6 text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-500 border-blue-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{submitting ? 'Creating...' : 'Register Employee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
