import { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelClassName?: string;
}

export const Input = ({ label, error, className, labelClassName, ...props }: InputProps) => (
  <label className="block space-y-2">
    <span className={cn('text-sm font-semibold text-slate-700', labelClassName)}>{label}</span>
    <input
      className={cn(
        'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100',
        error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100',
        className,
      )}
      {...props}
    />
    {error && <p className="text-sm text-rose-500">{error}</p>}
  </label>
);
