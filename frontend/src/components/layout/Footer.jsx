import React from 'react';
import { Landmark, Shield, Clock, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-7 h-7 bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Landmark className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold uppercase tracking-wider text-sm">Loan Management System</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Next-generation retail and commercial lending infrastructure offering transparent digital loan origination, instant credit assessments, and automated EMI management.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="font-bold text-white uppercase text-xs tracking-wider block">Loan Products</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#loans" className="hover:text-white">Personal Loans (12.0% p.a.)</a></li>
              <li><a href="#loans" className="hover:text-white">Home Loans (8.5% p.a.)</a></li>
              <li><a href="#loans" className="hover:text-white">Vehicle Loans (9.5% p.a.)</a></li>
              <li><a href="#loans" className="hover:text-white">Education Loans (10.0% p.a.)</a></li>
              <li><a href="#loans" className="hover:text-white">Business Loans (14.0% p.a.)</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="font-bold text-white uppercase text-xs tracking-wider block">Workflows & Portals</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="/login" className="hover:text-white">Customer Registration & Login</a></li>
              <li><a href="/login?role=admin" className="hover:text-white">Admin Approval Console</a></li>
              <li><a href="#how-it-works" className="hover:text-white">7-Step Application Lifecycle</a></li>
              <li><a href="#calculator" className="hover:text-white">EMI Amortization Calculator</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <span className="font-bold text-white uppercase text-xs tracking-wider block">Contact & Support</span>
            <div className="space-y-1.5 text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>1800-456-7890 (Toll Free)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>support@loanmanagement.com</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-2 font-mono">
                Operating Hours: Mon - Sat, 09:00 - 18:00 IST
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 font-mono gap-2">
          <span>© 2026 Loan Management System (Apex Capital & Lending Services). All rights reserved.</span>
          <span>Regulated NBFC • SOC-2 & ISO 27001 Certified Lending Operations</span>
        </div>
      </div>
    </footer>
  );
}
