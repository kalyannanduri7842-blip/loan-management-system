import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Briefcase, UserCheck, Landmark } from 'lucide-react';

export function MasterLogin() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white">
            <Landmark className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-wider uppercase">
            Loan Management System
          </h1>
        </div>
        <p className="text-xs text-slate-500 font-mono">
          Institutional Lending & Underwriting Platform
        </p>
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-700 bg-slate-200 py-1 px-4 border border-slate-300 inline-block uppercase tracking-wider">
            Select Your Role-Based Login Gateway
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Customer Login */}
        <div className="bg-white p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-emerald-500 transition-colors">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-none mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Customer Portal</h3>
          <p className="text-slate-500 text-xs mb-6 flex-1">Apply for retail loans, track verification lifecycle, view monthly EMI schedules & pay installments.</p>
          <Link to="/login/customer" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-xs tracking-wider transition-colors">
            Login as Customer →
          </Link>
        </div>

        {/* Employee Login */}
        <div className="bg-white p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-blue-500 transition-colors">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 flex items-center justify-center rounded-none mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Employee Portal</h3>
          <p className="text-slate-500 text-xs mb-6 flex-1">Verify customer identity (Aadhaar/PAN), audit salary proofs, check CIBIL scores & submit loan recommendations.</p>
          <Link to="/login/employee" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs tracking-wider transition-colors">
            Login as Employee →
          </Link>
        </div>

        {/* Manager Login */}
        <div className="bg-white p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-purple-500 transition-colors">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 flex items-center justify-center rounded-none mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Manager Portal</h3>
          <p className="text-slate-500 text-xs mb-6 flex-1">Review employee recommendations, approve loan sanction limits & interest rates, and execute disbursements.</p>
          <Link to="/login/manager" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase text-xs tracking-wider transition-colors">
            Login as Manager →
          </Link>
        </div>

        {/* Admin Login */}
        <div className="bg-white p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-slate-900 transition-colors">
          <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-none mb-4">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Administrator Console</h3>
          <p className="text-slate-500 text-xs mb-6 flex-1">Executive system governance, customer & staff directory management, audit trail inspection, analytics reports & risk settings.</p>
          <Link to="/login/admin" className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase text-xs tracking-wider transition-colors">
            Login as Admin →
          </Link>
        </div>
      </div>
    </div>
  );
}
