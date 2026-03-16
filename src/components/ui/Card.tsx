import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) => (
  <div className={cn('surface-card', className)} {...props}>
    {children}
  </div>
);
