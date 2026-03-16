import { cn } from '../../utils/cn';

export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => (
  <span
    className={cn(
      'inline-block animate-spin rounded-full border-2 border-current border-r-transparent',
      size === 'sm' && 'h-4 w-4',
      size === 'md' && 'h-6 w-6',
      size === 'lg' && 'h-8 w-8',
    )}
  />
);
