import toast from 'react-hot-toast';
import type { Toast } from 'react-hot-toast';

type NotifyType = 'success' | 'error' | 'warning' | 'info';

const typeConfig: Record<NotifyType, { color: string; icon: string }> = {
  success: { color: '#22c55e', icon: '\u2713' },
  error:   { color: '#ef4444', icon: '\u2715' },
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
        borderRadius: 14,
        padding: '14px 12px 14px 14px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.10)',
        border: '1px solid rgba(0,0,0,0.07)',
        borderLeft: `4px solid ${cfg.color}`,
        minWidth: 290,
        maxWidth: 420,
        animation: `${t.visible ? 'toastIn' : 'toastOut'} 0.32s cubic-bezier(0.34,1.4,0.64,1) forwards`,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: 13,
          color: 'white',
          letterSpacing: '-0.5px',
          flexShrink: 0,
          boxShadow: '0 4px 14px rgba(37,99,235,.45)',
        }}
      >
        A+
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 600, lineHeight: 1.4 }}>
          {message}
        </div>
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: '#f1f5f9',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          color: '#64748b',
          fontWeight: 700,
          padding: 0,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export const notify = {
  success: (msg: string) =>
    toast.custom((t) => <BrandedToast t={t} type="success" message={msg} />, { duration: 5000 }),
  error: (msg: string) =>
    toast.custom((t) => <BrandedToast t={t} type="error" message={msg} />, { duration: 5000 }),
  warning: (msg: string) =>
    toast.custom((t) => <BrandedToast t={t} type="warning" message={msg} />, { duration: 5000 }),
  info: (msg: string) =>
    toast.custom((t) => <BrandedToast t={t} type="info" message={msg} />, { duration: 5000 }),
};
