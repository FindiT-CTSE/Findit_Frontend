import { ReactNode } from 'react';
import { Card } from './Card';

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <Card className="p-10 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-2xl">
      ?
    </div>
    <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </Card>
);
