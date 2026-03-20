import { Link } from 'react-router-dom';
import { MatchItem } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { buttonStyles } from '../ui/Button';

interface MatchResultCardProps {
  match: MatchItem;
}

export const MatchResultCard = ({ match }: MatchResultCardProps) => {
  const normalizedScore = match.score <= 1 ? match.score * 100 : match.score;
const scorePercentage = `${Math.round(normalizedScore)}%`;

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="found">Possible Match</Badge>
            <Badge variant="open">Score {scorePercentage}</Badge>
          </div>

          <h3 className="mt-4 text-xl font-bold text-ink">
            {match.post?.category || `Matched Post ${match.matchedPostId}`}
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            {match.post?.location || 'Location not available'}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {match.post?.description || 'No post preview available from matching service response.'}
          </p>
        </div>

        <div className="md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Matched Post ID
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">{match.matchedPostId}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-ink">Why this matched</p>
        {match.reasons.length ? (
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {match.reasons.map((reason, index) => (
              <li key={`${reason}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
                {reason}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No matching reasons were returned.</p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={`/posts/${match.matchedPostId}`}
          className={buttonStyles({ variant: 'ghost' })}
        >
          View matched post
        </Link>
      </div>
    </Card>
  );
};