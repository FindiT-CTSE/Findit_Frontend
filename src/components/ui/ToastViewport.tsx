import { cn } from '../../utils/cn';

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant: 'success' | 'error' | 'info';
}

export const ToastViewport = ({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) => (
  <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
    {toasts.map((toast) => (
      <button
        key={toast.id}
        type="button"
        onClick={() => onDismiss(toast.id)}
        className={cn(
          'pointer-events-auto rounded-2xl border p-4 text-left shadow-soft backdrop-blur',
          toast.variant === 'success' && 'border-emerald-200 bg-white/95',
          toast.variant === 'error' && 'border-rose-200 bg-white/95',
          toast.variant === 'info' && 'border-sky-200 bg-white/95',
        )}
      >
        <p className="font-semibold text-ink">{toast.title}</p>
        {toast.message ? <p className="mt-1 text-sm text-slate-600">{toast.message}</p> : null}
      </button>
    ))}
  </div>
);
