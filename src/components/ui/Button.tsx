import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export const buttonStyles = ({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
}) =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
    variant === 'primary' && 'bg-ink text-white hover:bg-slate-800',
    variant === 'secondary' && 'bg-brand-500 text-white hover:bg-brand-600',
    variant === 'ghost' &&
      'border border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:text-brand-700',
    variant === 'danger' && 'bg-rose-500 text-white hover:bg-rose-600',
    size === 'sm' && 'px-4 py-2 text-sm',
    size === 'md' && 'px-5 py-3 text-sm',
    size === 'lg' && 'px-6 py-3.5 text-base',
    className,
  );

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={buttonStyles({ variant, size, className })}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);
