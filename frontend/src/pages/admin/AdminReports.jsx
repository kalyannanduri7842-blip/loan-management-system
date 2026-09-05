import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { BarChart3, Download, FileSpreadsheet, Layers, ShieldCheck, PieChart, TrendingUp } from 'lucide-react';

export function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    api.admin.getDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  const handleExportApplications = async () => {
    try {
      const res = await api.admin.getApplications({ limit: 1000 });
      const apps = res.applications || [];
      if (apps.length === 0) return addToast('No Data', 'No application records to export.', 'info');

      const headers = ['Application Number', 'Customer Name', 'Email', 'Loan Type', 'Requested Amount', 'Sanctioned Amount', 'CIBIL Score', 'Status', 'Date'];
      const rows = apps.map(a => [
        a.applicationNumber,
        `"${a.customerName}"`,
        a.customerEmail,
        `"${a.loanDetails?.loanType}"`,
        a.loanDetails?.requestedAmount,
        a.managerDecision?.approvedAmount || 0,
        a.creditScore || 750,
        a.status,
        new Date(a.createdAt).toISOString()
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `loan_applications_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Export Complete', 'Downloaded Applications CSV file.', 'success');
    } catch (e) {
      addToast('Export Error', e.message, 'error');
    }
  };

  const handleExportDisbursements = async () => {
    try {
      const res = await api.admin.getDisbursements();
      const list = res.disbursementHistory || [];
      if (list.length === 0) return addToast('No Data', 'No disbursement records to export.', 'info');

      const headers = ['Disbursement Ref', 'Loan Number', 'Customer Name', 'Amount', 'Bank Name', 'Account Number', 'Disbursed By', 'Date'];
      const rows = list.map(d => [
        d.disbursementRef || d.id,
        d.loanNumber,
        `"${d.customerName}"`,
        d.amount,
        `"${d.bankDetails?.bankName}"`,
        `"${d.bankDetails?.accountNumber}"`,
        `"${d.disbursedBy}"`,
        new Date(d.disbursedAt).toISOString()
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `disbursements_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Export Complete', 'Downloaded Disbursements CSV file.', 'success');
    } catch (e) {
      addToast('Export Error', e.message, 'error');
    }
  };

  const handleExportAuditLogs = async () => {
    try {
      const res = await api.admin.getAuditLogs();
      const logs = res.logs || [];
      if (logs.length === 0) return addToast('No Data', 'No audit logs to export.', 'info');

      const headers = ['Timestamp', 'Action', 'Actor', 'Role', 'Target ID', 'Details'];
      const rows = logs.map(l => [
        new Date(l.timestamp).toISOString(),
        `"${l.action}"`,
        `"${l.actor}"`,
        l.role,
        l.targetId || '',
        `"${(l.details || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `system_audit_trail_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast('Export Complete', 'Downloaded System Audit Trail CSV file.', 'success');
    } catch (e) {
      addToast('Export Error', e.message, 'error');
    }
  };

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Audit Reports & Data Export Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download institutional compliance audit reports, disbursement ledgers, and system event logs
          </p>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 font-bold uppercase text-slate-900">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Loan Applications Registry</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Full ledger of all submitted customer applications with CIBIL score, income proof, and underwriting remarks.
          </p>
          <button
            onClick={handleExportApplications}
            className="btn-primary w-full py-2 flex items-center justify-center gap-1.5 bg-slate-900 text-white font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Applications (.CSV)</span>
          </button>
        </div>

        <div className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 font-bold uppercase text-slate-900">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Disbursements & Principal</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Summary of all NEFT disbursed loans, beneficiary bank account details, and sanctioned limits.
          </p>
          <button
            onClick={handleExportDisbursements}
            className="btn-primary w-full py-2 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 border-emerald-700 text-white font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Disbursements (.CSV)</span>
          </button>
        </div>

        <div className="border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 font-bold uppercase text-slate-900">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Governance Audit Trail</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Complete chronological audit log recording every actor's status changes, verification notes, and approvals.
          </p>
          <button
            onClick={handleExportAuditLogs}
            className="btn-primary w-full py-2 flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-600 border-blue-700 text-white font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (.CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
