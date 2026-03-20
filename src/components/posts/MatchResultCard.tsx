import { Link } from 'react-router-dom';
import { useState } from 'react';
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
  const [imageError, setImageError] = useState(false);

  const normalizedScore = match.score <= 1 ? match.score * 100 : match.score;
  const scorePercentage = `${Math.round(normalizedScore)}%`;

  const postType = match.post?.type;
  const hasValidImage = !!match.post?.imageUrl && !imageError;

  return (
    <Card
      className={`overflow-hidden p-5 transition-all ${
        isTopMatch
          ? 'border-2 border-emerald-300 bg-emerald-50/40 shadow-lg'
          : 'border border-slate-200'
      }`}
    >
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          {hasValidImage ? (
            <img
              src={match.post?.imageUrl}
              alt={match.post?.category || 'Matched item'}
              className="h-52 w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-52 flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 text-center">
              <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                No Image
              </div>
              <p className="mt-4 text-base font-semibold text-slate-700">
                {match.post?.category || 'Matched item'}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Image preview not available
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
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

                {postType === 'LOST' ? (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    LOST
                  </span>
                ) : postType === 'FOUND' ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    FOUND
                  </span>
                ) : null}
              </div>

              <h3 className="mt-4 text-2xl font-bold text-ink">
                {match.post?.category || 'Matched item'}
              </h3>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
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

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/posts/${match.matchedPostId}`}
              className={buttonStyles({ variant: isTopMatch ? 'primary' : 'ghost' })}
            >
              View matched post
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};