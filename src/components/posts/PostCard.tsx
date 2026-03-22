import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { formatDate, truncateText } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { buttonStyles } from '../ui/Button';
import { Card } from '../ui/Card';

export const PostCard = ({
  post,
  compact = false,
}: {
  post: Post;
  compact?: boolean;
}) => {
  const owner = post.owner || post.user;

  return (
    <Card className="overflow-hidden border border-white/80 bg-white/95 p-0 shadow-card">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-ink text-sm font-bold text-white">
            {(owner?.name || owner?.email || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{owner?.name || owner?.email || 'Community member'}</p>
            <p className="text-xs text-slate-500">{formatDate(post.date)} • {post.location}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={post.type === 'LOST' ? 'lost' : 'found'}>{post.type}</Badge>
          <Badge variant={post.status === 'OPEN' ? 'open' : 'closed'}>{post.status}</Badge>
        </div>
      </div>

      <div className="px-5 pb-4">
        <h3 className="text-xl font-bold text-ink">{post.category}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{truncateText(post.description, compact ? 90 : 140)}</p>
      </div>
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.category}
          className={`w-full object-cover ${compact ? 'h-56' : 'h-72'}`}
        />
      ) : null}
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Visible to campus users</span>
          <span>{post.status === 'OPEN' ? 'Active post' : 'Resolved post'}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <button type="button" className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
            Track
          </button>
          <Link to={`/posts/${post.id}`} className={buttonStyles({ variant: 'ghost', className: 'w-full border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:text-brand-700' })}>
            View
          </Link>
          <Link to={`/posts/${post.id}`} className="rounded-xl bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
            Details
          </Link>
        </div>
      </div>
    </Card>
  );
};
