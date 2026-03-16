import { Card } from '../ui/Card';

export const StatCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) => (
  <Card className="p-5">
    <div className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${accent}`}>{label}</div>
    <p className="mt-4 text-3xl font-bold text-ink">{value}</p>
  </Card>
);
