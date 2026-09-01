import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sliders, Save } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getSettings();
      setSettings(res.settings || {});
    } catch (err) {
      console.warn('Settings error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.admin.updateSettings(settings);
      addToast('Settings Saved', 'Interest rates and risk parameters updated successfully.', 'success');
    } catch (err) {
      addToast('Error', err.message || 'Could not save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-xs text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-slate-900" />
          <span>Lending Parameters & Interest Rates Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure annual interest rates (% p.a.), underwriting thresholds, and maximum tenures
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Interest Rates per Loan Product */}
        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <span className="font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
            Base Annual Interest Rates (% p.a.)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(settings.interestRates || {}).map(([key, val]) => (
              <div key={key}>
                <label className="block font-semibold text-slate-700 mb-1">{key}</label>
                <input
                  type="number"
                  step="0.1"
                  min={1.0}
                  max={30.0}
                  value={val}
                  onChange={(e) => setSettings({
                    ...settings,
                    interestRates: { ...settings.interestRates, [key]: parseFloat(e.target.value) || 0 }
                  })}
                  className="input-field font-mono font-bold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Risk & Credit Criteria */}
        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <span className="font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
            Underwriting & Risk Thresholds
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Minimum CIBIL Score</label>
              <input
                type="number"
                min={300}
                max={900}
                value={settings.minCreditScore || 600}
                onChange={(e) => setSettings({ ...settings, minCreditScore: parseInt(e.target.value) || 600 })}
                className="input-field font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Debt-to-Income Ratio (%)</label>
              <input
                type="number"
                min={20}
                max={90}
                value={settings.maxDtiRatio || 65}
                onChange={(e) => setSettings({ ...settings, maxDtiRatio: parseInt(e.target.value) || 65 })}
                className="input-field font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standard Processing Fee (%)</label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={settings.processingFeePercent || 1.0}
                onChange={(e) => setSettings({ ...settings, processingFeePercent: parseFloat(e.target.value) || 1.0 })}
                className="input-field font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2 px-6 text-xs uppercase flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Configuration Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
