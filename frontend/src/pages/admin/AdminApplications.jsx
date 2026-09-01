import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export function AdminApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [loanTypeFilter, setLoanTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getApplications({
        search,
        status: statusFilter,
        loanType: loanTypeFilter,
        page,
        limit: 50
      });
      setApplications(res.applications || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.warn('Error fetching applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setStatusFilter(s);
  }, [searchParams]);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, loanTypeFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-900" />
            <span>Master Loan Applications Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, review underwriting documents, and approve/reject customer applications
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1 self-start sm:self-auto">
          Total Applications: {total}
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 space-y-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Application ID, Customer Name, Email..."
              value={search}
              onChange={(e) => setSearch}
              onInput={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="input-field cursor-pointer font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="ACTIVE">Active / Disbursed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div>
            <select
              value={loanTypeFilter}
              onChange={(e) => { setLoanTypeFilter(e.target.value); setPage(1); }}
              className="input-field cursor-pointer font-semibold"
            >
              <option value="ALL">All Loan Types</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
              <option value="Education Loan">Education Loan</option>
              <option value="Business Loan">Business Loan</option>
            </select>
          </div>
        </form>
      </div>

      {/* Applications Master Table */}
      <div className="border border-slate-200 bg-white space-y-4 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Loan Type</th>
                <th className="table-header text-right">Requested Amount</th>
                <th className="table-header text-center">Tenure</th>
                <th className="table-header text-center">CIBIL & DTI Score</th>
                <th className="table-header">Date</th>
                <th className="table-header">Workflow Status</th>
                <th className="table-header text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No loan applications matching the selected criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="table-cell font-mono font-bold text-slate-900">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell">
                      <strong className="text-slate-900 block">{app.customerName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{app.customerEmail}</span>
                    </td>
                    <td className="table-cell font-semibold">{app.loanDetails?.loanType}</td>
                    <td className="table-cell text-right font-mono font-bold text-slate-900">
                      ₹{app.loanDetails?.requestedAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="table-cell text-center font-mono">
                      {app.loanDetails?.tenureMonths} Mos
                    </td>
                    <td className="table-cell text-center font-mono">
                      <span className="block font-bold text-slate-900">Score: {app.creditAssessment?.creditScore || 780}</span>
                      <StatusBadge status={app.creditAssessment?.eligibilityStatus || 'ELIGIBLE'} />
                    </td>
                    <td className="table-cell font-mono text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="btn-primary py-1 px-3 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View & Underwrite →</span>
                      </Link>
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
