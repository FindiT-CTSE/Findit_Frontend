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
    <Card className="overflow-hidden p-5">
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.category}
          className={`w-full rounded-2xl object-cover ${compact ? 'mb-4 h-40' : 'mb-5 h-48'}`}
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={post.type === 'LOST' ? 'lost' : 'found'}>{post.type}</Badge>
        <Badge variant={post.status === 'OPEN' ? 'open' : 'closed'}>{post.status}</Badge>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-ink">{post.category}</h3>
          <p className="mt-1 text-sm text-slate-500">{post.location}</p>
        </div>
        <p className="text-sm font-medium text-slate-500">{formatDate(post.date)}</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{truncateText(post.description, compact ? 90 : 140)}</p>
      {owner?.name || owner?.email ? (
        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Posted by {owner.name || owner.email}
        </div>
      ) : null}
      <div className="mt-5">
        <Link to={`/posts/${post.id}`} className={buttonStyles({ variant: 'ghost', className: 'w-full' })}>
          View details
        </Link>
      </div>
    </Card>
  );
};
