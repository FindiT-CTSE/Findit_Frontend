import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'neutral',
}: {
  children: ReactNode;
  variant?: 'neutral' | 'lost' | 'found' | 'open' | 'closed';
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
      variant === 'neutral' && 'bg-slate-100 text-slate-700',
      variant === 'lost' && 'bg-amber-100 text-amber-700',
      variant === 'found' && 'bg-emerald-100 text-emerald-700',
      variant === 'open' && 'bg-sky-100 text-sky-700',
      variant === 'closed' && 'bg-slate-200 text-slate-700',
    )}
  >
    {children}
  </span>
);
