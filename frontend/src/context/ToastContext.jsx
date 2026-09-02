import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
 const [toasts, setToasts] = useState([]);

 const addToast = useCallback((title, message = '', type = 'info', duration = 4000) => {
 const id = `toast-${Date.now()}-${Math.random()}`;
 const newToast = { id, title, message, type };

 setToasts(prev => [newToast, ...prev]);

 if (duration > 0) {
 setTimeout(() => {
 removeToast(id);
 }, duration);
 }
 }, []);

 const removeToast = useCallback((id) => {
 setToasts(prev => prev.filter(t => t.id !== id));
 }, []);

 return (
 <ToastContext.Provider value={{ addToast, removeToast }}>
 {children}
 {/* Toast Render Area */}
 <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
 {toasts.map(toast => {
 let borderCol = 'border-slate-800 bg-slate-900 text-white';
 let Icon = Info;

 if (toast.type === 'success') {
 borderCol = 'border-emerald-800 bg-slate-900 text-white';
 Icon = CheckCircle2;
 } else if (toast.type === 'error') {
 borderCol = 'border-rose-800 bg-slate-900 text-white';
 Icon = AlertCircle;
 }

 return (
 <div
 key={toast.id}
 className={`p-3.5 border text-xs pointer-events-auto flex items-start justify-between gap-3 ${borderCol}`}
 >
 <div className="flex items-start gap-2.5">
 <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${
 toast.type === 'success' ? 'text-emerald-400' : toast.type === 'error' ? 'text-rose-400' : 'text-slate-300'
 }`} />
 <div className="space-y-0.5">
 <strong className="font-bold block text-white">{toast.title}</strong>
 {toast.message && <p className="text-[11px] text-slate-300 leading-relaxed">{toast.message}</p>}
 </div>
 </div>

 <button
 onClick={() => removeToast(toast.id)}
 className="text-slate-400 hover:text-white p-0.5"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>
 );
 })}
 </div>
 </ToastContext.Provider>
 );
}

export function useToast() {
 const ctx = useContext(ToastContext);
 if (!ctx) throw new Error('useToast must be used within ToastProvider');
 return ctx;
}
