import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BarChart3, Download, FileSpreadsheet, Layers, ShieldCheck } from 'lucide-react';

export function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  const handleExportCsv = (type) => {
    alert(`Generating and downloading ${type} CSV report from active database records...`);
  };

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-900" />
            <span>Audit Reports & Data Export Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download regulatory compliance audit reports, disbursement summaries, and loan performance data
          </p>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center space-x-2 font-bold uppercase text-slate-900">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Loan Applications Registry</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Full ledger of all submitted customer applications with CIBIL score, income proof, and underwriting remarks.
          </p>
          <button
            onClick={() => handleExportCsv('Applications Registry')}
            className="btn-primary w-full py-2 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Applications (.CSV)</span>
          </button>
        </div>

        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center space-x-2 font-bold uppercase text-slate-900">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Disbursements & Principal</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Summary of all NEFT disbursed loans, beneficiary bank account details, and first installment schedules.
          </p>
          <button
            onClick={() => handleExportCsv('Disbursements & Principal')}
            className="btn-primary w-full py-2 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Disbursements (.CSV)</span>
          </button>
        </div>

        <div className="border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center space-x-2 font-bold uppercase text-slate-900">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>EMI Collections & Overdue</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Transaction receipts, customer payment modes, overdue interest, and remaining balance sheet ledger.
          </p>
          <button
            onClick={() => handleExportCsv('EMI Collections')}
            className="btn-primary w-full py-2 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Collections (.CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
