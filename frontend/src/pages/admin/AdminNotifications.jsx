import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-900" />
            <span>Underwriting & Executive Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time incoming customer loan applications, overdue installment alerts, and system events
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="border border-slate-200 bg-white space-y-2 text-xs">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-slate-900">
            Incoming Notifications ({notifications.length})
          </span>
          {unreadCount > 0 && (
            <span className="text-rose-700 font-bold font-mono text-[11px]">
              {unreadCount} Unread Alerts
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  n.isRead ? 'bg-white hover:bg-slate-50' : 'bg-amber-50/50 border-l-4 border-amber-500'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{n.title}</strong>
                    {!n.isRead && (
                      <span className="bg-amber-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase">
                        Requires Action
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>

                {n.link && (
                  <Link
                    to={n.link}
                    className="btn-primary py-1 px-3 text-[11px] inline-flex items-center gap-1 self-start sm:self-auto shrink-0"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
