import { Post } from '../../types';
import { formatDateTime } from '../../utils/format';

export const ActivityList = ({ posts }: { posts: Post[] }) => (
  <div className="space-y-3">
    {posts.map((post) => (
      <div key={post.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-ink">
              {post.type} report for {post.category}
            </p>
            <p className="text-sm text-slate-500">{post.location}</p>
          </div>
          <p className="text-sm text-slate-500">{formatDateTime(post.createdAt || post.date)}</p>
        </div>
      </div>
    ))}
  </div>
);
