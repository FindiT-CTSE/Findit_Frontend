import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { buttonStyles } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Post } from '../types';
import { postService } from '../services/postService';
import { formatDate, truncateText } from '../utils/format';

const features = [
  {
    title: 'Fast reporting flow',
    description: 'File a lost or found item report in minutes with a guided form built for campus usage.',
  },
  {
    title: 'Searchable campus feed',
    description: 'Browse and filter reports by type, category, location, and status with clean card layouts.',
  },
  {
    title: 'Match-ready workflow',
    description: 'Stay prepared for service-driven matches and notifications with a dashboard built for updates.',
  },
];

const steps = [
  'Report a lost or found item with clear details, location, date, and optional image.',
  'Browse the live feed to search similar posts and track the current status.',
  'Manage your own activity from the dashboard and close posts when items are returned.',
];

const getTimestamp = (post: Post) => {
  const value = post.createdAt || post.updatedAt || post.date;
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getTopLabel = (posts: Post[], key: 'location' | 'category') => {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    const value = post[key]?.trim();
    if (!value) return;
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] || 'Campus-wide';
};

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedQuery, setFeedQuery] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await postService.getPosts();
        setPosts(response.sort((left, right) => getTimestamp(right) - getTimestamp(left)));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load the community feed.');
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  const filteredFeedPosts = useMemo(() => {
    const query = feedQuery.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) =>
      [post.category, post.location, post.description, post.owner?.name, post.owner?.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [feedQuery, posts]);

  const boardColumns = useMemo(
    () => [
      {
        key: 'lost-open',
        title: 'Lost Items',
        accent: 'bg-amber-100 text-amber-700',
        posts: filteredFeedPosts.filter((post) => post.type === 'LOST' && post.status === 'OPEN').slice(0, 4),
      },
      {
        key: 'found-open',
        title: 'Found Items',
        accent: 'bg-emerald-100 text-emerald-700',
        posts: filteredFeedPosts.filter((post) => post.type === 'FOUND' && post.status === 'OPEN').slice(0, 4),
      },
      {
        key: 'closed-posts',
        title: 'Resolved',
        accent: 'bg-slate-200 text-slate-700',
        posts: filteredFeedPosts.filter((post) => post.status === 'CLOSED').slice(0, 4),
      },
    ],
    [filteredFeedPosts],
  );

  const liveStats = useMemo(() => {
    const openPosts = posts.filter((post) => post.status === 'OPEN').length;
    const todaysPosts = posts.filter((post) => {
      const timestamp = getTimestamp(post);
      if (!timestamp) return false;

      const date = new Date(timestamp);
      const now = new Date();
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      );
    }).length;

    return [
      { label: 'Posts in the feed', value: `${posts.length}` },
      { label: 'Currently open', value: `${openPosts}` },
      { label: 'Shared today', value: `${todaysPosts}` },
    ];
  }, [posts]);

  const topLocation = useMemo(() => getTopLabel(posts, 'location'), [posts]);
  const topCategory = useMemo(() => getTopLabel(posts, 'category'), [posts]);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.15fr,0.85fr] lg:py-24">
          <div className="relative">
            <div className="absolute -left-8 top-6 -z-10 h-36 w-36 rounded-full bg-coral/20 blur-3xl" />
            <p className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
              Smart Campus Lost & Found
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-ink sm:text-6xl">
              Find lost campus items faster with a modern smart recovery hub.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              FindIt turns university lost and found reporting into a polished, searchable, dashboard-first experience for students and staff.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/posts/new" className={buttonStyles({ size: 'lg', className: 'w-full sm:w-auto' })}>
                Report Lost Item
              </Link>
              <Link
                to="/posts/new"
                className={buttonStyles({
                  size: 'lg',
                  variant: 'secondary',
                  className: 'w-full sm:w-auto',
                })}
              >
                Report Found Item
              </Link>
              <Link
                to="/dashboard"
                className={buttonStyles({ size: 'lg', variant: 'ghost', className: 'w-full sm:w-auto' })}
              >
                Browse Items
              </Link>
            </div>
          </div>

          <div className="surface-card relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-hero-grid bg-[size:24px_24px] opacity-40" />
            <div className="relative grid gap-4">
              <Card className="border-none bg-gradient-to-br from-ink to-slate-800 p-5 text-white shadow-none">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Live Campus Snapshot</p>
                <p className="mt-5 text-3xl font-bold">Open items across faculty zones</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-3xl font-bold">{liveStats[1].value}</p>
                    <p className="mt-1 text-sm text-white/70">Open reports</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-3xl font-bold">{liveStats[2].value}</p>
                    <p className="mt-1 text-sm text-white/70">New today</p>
                  </div>
                </div>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5">
                  <p className="text-sm font-semibold text-slate-500">Popular location</p>
                  <p className="mt-3 text-lg font-bold text-ink">{topLocation}</p>
                </Card>
                <Card className="p-5">
                  <p className="text-sm font-semibold text-slate-500">Top category</p>
                  <p className="mt-3 text-lg font-bold text-ink">{topCategory}</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {liveStats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <p className="text-4xl font-extrabold text-ink">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-card">
          <div className="bg-[linear-gradient(90deg,#4f7cff_0%,#6a86ff_100%)] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-300" />
            </div>
          </div>

          <div className="border-b border-slate-200/80 px-5 py-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Community board</p>
                <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">Live lost and found timeline</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex min-w-[240px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-slate-400">Search</span>
                  <input
                    value={feedQuery}
                    onChange={(event) => setFeedQuery(event.target.value)}
                    placeholder="Category, location, owner"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
                  />
                </label>
                <Link to="/dashboard" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
                  Full feed
                </Link>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {liveStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-lg font-bold text-ink">{stat.value}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{stat.label}</p>
                </div>
              ))}
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-lg font-bold text-ink">{topLocation}</p>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Popular location</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-lg font-bold text-ink">{topCategory}</p>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Top category</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/80 p-5">
          {loading ? (
            <div className="grid gap-5 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-[1.75rem] border border-slate-200 bg-white p-4">
                  <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
                  <div className="mt-4 space-y-3">
                    {Array.from({ length: 3 }).map((__, cardIndex) => (
                      <div key={cardIndex} className="rounded-[1.5rem] border border-slate-100 p-4">
                        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-3 h-20 animate-pulse rounded-2xl bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert title="Feed unavailable" message={error} variant="error" />
          ) : filteredFeedPosts.length ? (
            <div className="grid gap-5 xl:grid-cols-3">
              {boardColumns.map((column) => (
                <div key={column.key} className="rounded-[1.75rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-ink">{column.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${column.accent}`}>
                        {column.posts.length}
                      </span>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Updated live</span>
                  </div>

                  <div className="mt-4 space-y-4">
                    {column.posts.length ? (
                      column.posts.map((post) => (
                        <Card key={post.id} className="rounded-[1.5rem] border border-slate-100 p-4 shadow-none">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-lg font-bold text-ink">{post.category}</p>
                              <p className="mt-1 text-sm text-slate-500">
                                {post.location} • {formatDate(post.date)}
                              </p>
                            </div>
                            <Badge variant={post.status === 'OPEN' ? 'open' : 'closed'}>{post.status}</Badge>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant={post.type === 'LOST' ? 'lost' : 'found'}>{post.type}</Badge>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {post.owner?.name || post.owner?.email || 'Community member'}
                            </span>
                          </div>

                          <p className="mt-4 text-sm leading-6 text-slate-600">{truncateText(post.description, 110)}</p>

                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt={post.category}
                              className="mt-4 h-36 w-full rounded-[1rem] object-cover"
                            />
                          ) : null}

                          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                            <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                              Campus post
                            </span>
                            <Link to={`/posts/${post.id}`} className="text-sm font-semibold text-brand-700">
                              View details
                            </Link>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        No posts in this column yet.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert
              title="No matching posts"
              message="Try a different search term or wait for new lost and found posts to appear."
            />
          )}
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <SectionHeading
          eyebrow="Feature Highlights"
          title="Built for a polished smart campus experience"
          description="The frontend balances modern visuals with practical lost and found workflows for students and staff."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <h3 className="text-xl font-bold text-ink">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr,1.2fr]">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              How It Works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Simple steps for students and staff
            </h2>
            <p className="mt-4 text-base text-white/70">
              From the first report to a successful return, the flow stays clear and easy to use.
            </p>
          </div>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">Step {index + 1}</p>
                <p className="mt-3 text-lg font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
