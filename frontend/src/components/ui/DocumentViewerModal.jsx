import React from 'react';
import { FileText, Download, CheckCircle, XCircle, X } from 'lucide-react';

export function DocumentViewerModal({ docType, doc, onClose, onVerify, onReject, isAdmin = false }) {
  if (!doc) return null;

  const docTitleMap = {
    aadhaar: 'Aadhaar Card Proof',
    pan: 'Permanent Account Number (PAN) Card',
    salarySlip: 'Latest Salary Slip / Income Proof',
    bankStatement: 'Last 6 Months Bank Statement',
    addressProof: 'Address / Utility Bill Proof'
  };

  const title = docTitleMap[docType] || docType;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full border border-slate-300 p-6 space-y-5 text-xs shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Document Verification</span>
            <h3 className="font-bold text-sm text-slate-900">{title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-black font-bold p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Document Preview Box */}
        <div className="border border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center space-y-3">
          <FileText className="w-12 h-12 text-slate-700 stroke-1" />
          <div className="text-center">
            <span className="font-bold text-slate-900 block">{doc.name || 'Uploaded_Document.pdf'}</span>
            <span className="text-[10px] text-slate-500 font-mono">Format: PDF Document • 2.4 MB</span>
          </div>
          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
            doc.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
            doc.status === 'REJECTED' ? 'bg-rose-50 text-rose-800 border-rose-300' :
            'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            Current Status: {doc.status || 'PENDING'}
          </span>
        </div>

        {/* Admin Verification Controls */}
        {isAdmin && (
          <div className="p-3 bg-slate-100 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-800 block">Review & Verify Document:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onVerify && onVerify(docType)}
                className="btn-success py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark Verified</span>
              </button>
              <button
                type="button"
                onClick={() => onReject && onReject(docType)}
                className="btn-danger py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Document</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => alert(`Downloading "${doc.name}" for offline audit verification...`)}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Document</span>
          </button>
          <button type="button" onClick={onClose} className="btn-secondary py-1.5 px-4 text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
