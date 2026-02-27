import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: { Icon: CheckCircle2, bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#059669', accent: '#10b981', border: '#a7f3d0' },
  error:   { Icon: XCircle,      bg: 'linear-gradient(135deg, #fef2f2, #fee2e2)', color: '#dc2626', accent: '#ef4444', border: '#fca5a5' },
  warning: { Icon: AlertTriangle, bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', color: '#d97706', accent: '#f59e0b', border: '#fcd34d' },
  info:    { Icon: Info,          bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#2563eb', accent: '#3b82f6', border: '#93c5fd' },
};

export default function Notifications() {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col-reverse gap-3 max-w-[380px]" style={{ pointerEvents: 'none' }}>
      {notifications.map((n, i) => {
        const config = icons[n.type as keyof typeof icons] || icons.info;
        const { Icon } = config;
        return (
          <div
            key={n.id}
            className="animate-notification"
            style={{ animationDelay: `${i * 60}ms`, pointerEvents: 'auto' }}
          >
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: 'white',
                border: `1px solid ${config.border}`,
                boxShadow: `0 4px 16px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 8px 24px ${config.accent}15`,
              }}
            >
              {/* Accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: `linear-gradient(180deg, ${config.accent}, ${config.color})` }} />

              <div className="flex items-start gap-3.5 p-4 pl-5">
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: config.bg, border: `1px solid ${config.border}` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: config.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[13px] font-bold text-gray-900 leading-tight">{n.title}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                </div>

                {/* Close */}
                <button
                  onClick={() => removeNotification(n.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="h-[2px] w-full" style={{ background: `${config.border}40` }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${config.accent}, ${config.color})`,
                    animation: 'bar-fill 5s linear forwards reverse',
                    width: '100%',
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
