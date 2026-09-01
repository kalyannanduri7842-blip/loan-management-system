import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { User, Lock, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export function CustomerProfile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    monthlyIncome: user?.monthlyIncome || 75000,
    newPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.updateProfile(formData);
      updateUser(res.user);
      addToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
      setFormData(prev => ({ ...prev, newPassword: '' }));
    } catch (err) {
      addToast('Error', err.message || 'Could not update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-900" />
          <span>My Customer Profile & Security</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage personal contact details, residential address, and account password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-slate-200 bg-white p-6 space-y-5 text-xs shadow-sm">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address (Immutable)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="input-field bg-slate-100 font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
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
          <label className="block font-semibold text-slate-700 mb-1">Monthly In-Hand Income (₹)</label>
          <input
            type="number"
            required
            value={formData.monthlyIncome}
            onChange={(e) => setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) || 0 })}
            className="input-field font-mono font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
          <textarea
            rows={3}
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="pt-3 border-t border-slate-100">
          <label className="block font-semibold text-slate-700 mb-1">Change Account Password (Leave blank to keep unchanged)</label>
          <input
            type="password"
            placeholder="New password (min. 6 characters)"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="input-field font-mono"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-2 px-6 text-xs uppercase cursor-pointer"
          >
            {loading ? 'Saving Profile...' : 'Save Profile Changes →'}
          </button>
        </div>
      </form>
    </div>
  );
}
