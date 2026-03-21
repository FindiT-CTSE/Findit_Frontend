import { useEffect, useMemo, useState } from 'react';
import { ActivityList } from '../components/dashboard/ActivityList';
import { QuickActionCard } from '../components/dashboard/QuickActionCard';
import { StatCard } from '../components/dashboard/StatCard';
import { PostCard } from '../components/posts/PostCard';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { Post } from '../types';
import { postService } from '../services/postService';

const matchesPlaceholder = 4;

const isOwnedByUser = (post: Post, email?: string, id?: string) => {
  const owner = post.owner || post.user;
  return Boolean((id && owner?.id === id) || (email && owner?.email === email));
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const allPosts = await postService.getPosts();
        setPosts(allPosts.filter((post) => isOwnedByUser(post, user?.email, user?.id)));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user?.email, user?.id]);

  const stats = useMemo(() => {
    const openPosts = posts.filter((post) => post.status === 'OPEN').length;
    const closedPosts = posts.filter((post) => post.status === 'CLOSED').length;
    return {
      totalPosts: posts.length,
      openPosts,
      closedPosts,
      possibleMatches: matchesPlaceholder,
    };
  }, [posts]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-ink to-slate-800 p-8 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Welcome back</p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              {user?.name || user?.fullName || 'Campus explorer'}, your lost & found workspace is ready.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
              Create new reports, monitor active posts, and keep track of potential match activity from one dashboard.
            </p>
          </div>
          <Button variant="ghost" className="border-white/20 bg-white/10 text-white hover:border-white/30 hover:text-white" onClick={logout}>
            Logout
          </Button>
        </div>
      </Card>

      {error ? <Alert title="Dashboard data unavailable" message={error} variant="error" /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total posts" value={stats.totalPosts} accent="bg-slate-100 text-slate-700" />
        <StatCard label="Open posts" value={stats.openPosts} accent="bg-sky-100 text-sky-700" />
        <StatCard label="Closed posts" value={stats.closedPosts} accent="bg-slate-200 text-slate-700" />
        <StatCard
          label="Possible matches"
          value={stats.possibleMatches}
          accent="bg-brand-100 text-brand-700"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickActionCard to="/posts/new" title="Create lost post" description="Report a missing item with full details." />
        <QuickActionCard to="/posts/new" title="Create found post" description="Upload a found item and help return it." />
        <QuickActionCard to="/my-posts" title="View my posts" description="Manage your reports and close resolved cases." />
        <QuickActionCard to="/posts" title="Browse all posts" description="Search the campus feed for related items." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-ink">Recent activity</h3>
          <p className="mt-2 text-sm text-slate-500">Latest actions from your reported items.</p>
          <div className="mt-5">
            {posts.length ? (
              <ActivityList posts={posts.slice(0, 4)} />
            ) : (
              <Alert
                title="No activity yet"
                message="Create your first lost or found report to start populating the dashboard."
              />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-ink">Recent posts</h3>
          <p className="mt-2 text-sm text-slate-500">Your latest reports, ready for follow-up.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {posts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))}
            {!posts.length ? (
              <Alert
                title="Nothing to show"
                message="Once you create posts, they will appear here with quick access links."
              />
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
};
