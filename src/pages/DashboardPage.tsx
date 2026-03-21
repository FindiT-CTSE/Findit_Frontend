import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostCard } from '../components/posts/PostCard';
import { Alert } from '../components/ui/Alert';
import { buttonStyles } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { postService } from '../services/postService';
import { Post } from '../types';

const isOwnedByUser = (post: Post, email?: string, id?: string) => {
  const owner = post.owner || post.user;
  return Boolean((id && owner?.id === id) || (email && owner?.email === email));
};

const matchesSearch = (post: Post, query: string) => {
  const normalized = query.toLowerCase();
  return [post.category, post.location, post.description, post.owner?.name, post.owner?.email]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalized));
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const allPosts = await postService.getPosts();
        setPosts(allPosts);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load campus posts.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const myPosts = useMemo(
    () => posts.filter((post) => isOwnedByUser(post, user?.email, user?.id)),
    [posts, user?.email, user?.id],
  );

  const visiblePosts = useMemo(
    () =>
      posts.filter((post) => {
        const typeMatch = !type || post.type === type;
        const statusMatch = !status || post.status === status;
        const searchMatch = !search.trim() || matchesSearch(post, search.trim());
        return typeMatch && statusMatch && searchMatch;
      }),
    [posts, search, status, type],
  );

  const stats = useMemo(() => {
    const openPosts = posts.filter((post) => post.status === 'OPEN').length;
    const foundPosts = posts.filter((post) => post.type === 'FOUND').length;

    return {
      totalPosts: posts.length,
      openPosts,
      foundPosts,
      myPosts: myPosts.length,
    };
  }, [myPosts.length, posts]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? <Alert title="Dashboard data unavailable" message={error} variant="error" /> : null}

      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Campus feed</p>
            <h3 className="mt-2 text-3xl font-bold text-ink">All lost and found posts</h3>
            <p className="mt-2 text-sm text-slate-600">
              Browse everything reported across campus. Only posts you created can be managed from your account.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/posts/new" className={buttonStyles({ variant: 'secondary', className: 'w-full sm:w-auto' })}>
              Report an item
            </Link>
            <Link to="/my-posts" className={buttonStyles({ variant: 'ghost', className: 'w-full sm:w-auto' })}>
              My posts
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.4rem] bg-slate-50 p-4">
            <p className="text-2xl font-bold text-ink">{stats.totalPosts}</p>
            <p className="mt-1 text-sm text-slate-500">Posts across campus</p>
          </div>
          <div className="rounded-[1.4rem] bg-slate-50 p-4">
            <p className="text-2xl font-bold text-ink">{stats.openPosts}</p>
            <p className="mt-1 text-sm text-slate-500">Open reports</p>
          </div>
          <div className="rounded-[1.4rem] bg-slate-50 p-4">
            <p className="text-2xl font-bold text-ink">{stats.foundPosts}</p>
            <p className="mt-1 text-sm text-slate-500">Found-item posts</p>
          </div>
          <div className="rounded-[1.4rem] bg-slate-50 p-4">
            <p className="text-2xl font-bold text-ink">{stats.myPosts}</p>
            <p className="mt-1 text-sm text-slate-500">Posts you created</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Input
            label="Search"
            placeholder="Category, location, owner"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select label="Type" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">All types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </Select>
          <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </Select>
        </div>
      </Card>

      {myPosts.length ? (
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-ink">Your recent posts</h3>
              <p className="mt-1 text-sm text-slate-600">Quick access to the items you can manage.</p>
            </div>
            <Link to="/my-posts" className="text-sm font-semibold text-brand-700">
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {myPosts.slice(0, 4).map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="block rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4 transition hover:border-brand-200 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{post.category}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      post.status === 'OPEN' ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{post.location}</p>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}

      {visiblePosts.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} compact />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No posts match these filters"
          description="Clear a filter or search term to bring more lost and found posts back into view."
          action={
            <button
              type="button"
              className={buttonStyles({ variant: 'ghost' })}
              onClick={() => {
                setSearch('');
                setType('');
                setStatus('');
              }}
            >
              Reset filters
            </button>
          }
        />
      )}
    </div>
  );
};
