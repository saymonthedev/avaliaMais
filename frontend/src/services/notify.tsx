import toast from 'react-hot-toast';
import type { Toast } from 'react-hot-toast';

type NotifyType = 'success' | 'error' | 'warning' | 'info';

const typeConfig: Record<NotifyType, { color: string; icon: string }> = {
  success: { color: '#22c55e', icon: '✓' },
  error:   { color: '#ef4444', icon: '✕' },
  warning: { color: '#f59e0b', icon: '!' },
  info:    { color: '#2563eb', icon: 'i' },
};

function BrandedToast({ t, type, message }: { t: Toast; type: NotifyType; message: string }) {
  const cfg = typeConfig[type];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#ffffff',
        borderRadius: 12,
        padding: '12px 14px 12px 12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
        borderLeft: `4px solid ${cfg.color}`,
        minWidth: 260,
        maxWidth: 380,
        opacity: t.visible ? 1 : 0,
        transform: t.visible ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.96)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: 12,
          color: 'white',
          letterSpacing: '-0.5px',
          flexShrink: 0,
          boxShadow: '0 4px 10px rgba(37,99,235,.35)',
        }}
      >
        A+
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500, lineHeight: 1.45 }}>
          {message}
        </div>
      </div>

      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: cfg.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </div>
    </div>
  );
}

export const notify = {
  success: (msg: string) =>
    toast.custom((t) => <BrandedToast t={t} type="success" message={msg} />, { duration: 3500 }),
  error: (msg: string) =>
    toast.custom((t) => <BrandedToast t={t} type="error" message={msg} />, { duration: 4000 }),
  warning: (msg: string) =>
    toast.custom((t) => <BrandedToast t={t} type="warning" message={msg} />, { duration: 3500 }),
  info: (msg: string) =>
    toast.custom((t) => <BrandedToast t={t} type="info" message={msg} />, { duration: 3000 }),
};
