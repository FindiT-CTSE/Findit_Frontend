import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';

export const QuickActionCard = ({
  to,
  title,
  description,
}: {
  to: string;
  title: string;
  description: string;
}) => (
  <Link to={to}>
    <Card className="h-full p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Card>
  </Link>
);
