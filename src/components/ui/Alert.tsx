import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export const Alert = ({
  title,
  message,
  variant = 'info',
}: {
  title: string;
  message?: ReactNode;
  variant?: 'info' | 'success' | 'error';
}) => (
  <div
    className={cn(
      'rounded-2xl border px-4 py-3 text-sm',
      variant === 'info' && 'border-sky-200 bg-sky-50 text-sky-800',
      variant === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-800',
      variant === 'error' && 'border-rose-200 bg-rose-50 text-rose-800',
    )}
  >
    <p className="font-semibold text-current">{title}</p>
    {message ? <div className="mt-1 text-current/90">{message}</div> : null}
  </div>
);
