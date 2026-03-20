import { Link } from 'react-router-dom';
import { MatchItem } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { buttonStyles } from '../ui/Button';

interface MatchResultCardProps {
  match: MatchItem;
  rank: number;
  isTopMatch?: boolean;
}

export const MatchResultCard = ({
  match,
  rank,
  isTopMatch = false,
}: MatchResultCardProps) => {
  const normalizedScore = match.score <= 1 ? match.score * 100 : match.score;
  const scorePercentage = `${Math.round(normalizedScore)}%`;

  return (
    <Card
      className={`p-5 transition-all ${
        isTopMatch
          ? 'border-2 border-emerald-300 bg-emerald-50/40 shadow-lg'
          : 'border border-slate-200'
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isTopMatch ? (
              <Badge variant="found">Best Match</Badge>
            ) : (
              <Badge variant="found">Possible Match</Badge>
            )}

            <Badge variant="open">Score {scorePercentage}</Badge>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Rank #{rank}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-ink">
            {match.post?.category || 'Matched item'}
          </h3>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
            {match.post?.type ? (
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                {match.post.type}
              </span>
            ) : null}

            {match.post?.location ? (
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                {match.post.location}
              </span>
            ) : null}

            {match.post?.status ? (
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                {match.post.status}
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {match.post?.description || 'A possible matching post was found for this item.'}
          </p>
        </div>

        <div className="md:min-w-[160px] md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Match confidence
          </p>
          <p className="mt-2 text-3xl font-bold text-ink">{scorePercentage}</p>

          {isTopMatch ? (
            <p className="mt-2 text-xs font-medium text-emerald-700">
              Highest ranked result
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={`/posts/${match.matchedPostId}`}
          className={buttonStyles({ variant: isTopMatch ? 'primary' : 'ghost' })}
        >
          View matched post
        </Link>
      </div>
    </Card>
  );
};