import React from 'react';

export function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let style = 'bg-slate-100 text-slate-700 border-slate-300';
  let label = status;

  switch (normalized) {
    case 'SUBMITTED':
    case 'PENDING_EMPLOYEE_REVIEW':
    case 'PENDING_REVIEW':
    case 'PENDING':
      style = 'bg-amber-50 text-amber-900 border-amber-300';
      label = 'Pending Review';
      break;
    case 'EMPLOYEE_REVIEW':
    case 'UNDER_REVIEW':
      style = 'bg-blue-50 text-blue-900 border-blue-300';
      label = 'Employee Review';
      break;
    case 'EMPLOYEE_RECOMMENDED':
      style = 'bg-teal-50 text-teal-900 border-teal-300 font-semibold';
      label = 'Employee Recommended';
      break;
    case 'EMPLOYEE_REJECTED':
      style = 'bg-rose-50 text-rose-900 border-rose-300 font-semibold';
      label = 'Employee Rejected';
      break;
    case 'MANAGER_REVIEW':
      style = 'bg-purple-50 text-purple-900 border-purple-300';
      label = 'Manager Review';
      break;
    case 'MANAGER_APPROVED':
      style = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold';
      label = 'Manager Approved';
      break;
    case 'MANAGER_REJECTED':
      style = 'bg-rose-50 text-rose-900 border-rose-300 font-semibold';
      label = 'Manager Rejected';
      break;
    case 'DISBURSEMENT_PENDING':
      style = 'bg-indigo-50 text-indigo-900 border-indigo-300 font-semibold';
      label = 'Disbursement Pending';
      break;
    case 'DISBURSED':
      style = 'bg-purple-50 text-purple-900 border-purple-300 font-semibold';
      label = 'Disbursed';
      break;
    case 'ACTIVE':
      style = 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold';
      label = 'Active Loan';
      break;
    case 'REJECTED':
      style = 'bg-rose-50 text-rose-900 border-rose-300';
      label = 'Rejected';
      break;
    case 'CLOSED':
      style = 'bg-slate-200 text-slate-800 border-slate-400 font-bold';
      label = 'Closed';
      break;
    case 'PAID':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
      label = 'Paid';
      break;
    case 'UPCOMING':
      style = 'bg-slate-100 text-slate-700 border-slate-200';
      label = 'Upcoming';
      break;
    case 'OVERDUE':
      style = 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
      label = 'Overdue';
      break;
    case 'ELIGIBLE':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      label = 'Eligible';
      break;
    case 'MANUAL_REVIEW':
      style = 'bg-amber-50 text-amber-800 border-amber-300';
      label = 'Manual Review';
      break;
    case 'NOT_ELIGIBLE':
      style = 'bg-rose-50 text-rose-800 border-rose-300';
      label = 'Not Eligible';
      break;
    case 'VERIFIED':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
      label = 'Verified';
      break;
    default:
      label = status;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide border rounded-none ${style} ${className}`}>
      {label}
    </span>
  );
}
