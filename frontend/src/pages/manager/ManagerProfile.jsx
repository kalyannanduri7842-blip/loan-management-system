import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Briefcase, Lock, Mail, Phone, Building } from 'lucide-react';

export function ManagerProfile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.updateProfile(formData);
      updateUser(res.user);
      addToast('Profile Saved', 'Manager credentials updated successfully.', 'success');
      setFormData(prev => ({ ...prev, newPassword: '' }));
    } catch (err) {
      addToast('Error', err.message || 'Could not update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          <span>Underwriting Manager Profile & Credentials</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manager authorization parameters and security key configuration
        </p>
      </div>

      <div className="border border-slate-200 bg-white p-6 space-y-6 text-xs shadow-sm">
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border font-mono">
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Manager ID</span>
            <strong className="text-slate-900">{user?.employeeId || 'MGR-2001'}</strong>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Department</span>
            <strong className="text-slate-900">{user?.department || 'Credit Approvals & Disbursement'}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="input-field bg-slate-100 font-mono text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Direct Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Update Security Key / Password</label>
            <input
              type="password"
              placeholder="Leave blank to retain current password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="input-field font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2 px-6 text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 border-purple-600 text-white font-bold"
            >
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
