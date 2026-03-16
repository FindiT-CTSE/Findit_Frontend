import { useEffect, useMemo, useState } from 'react';
import { PostCard } from '../components/posts/PostCard';
import { PostFilters } from '../components/posts/PostFilters';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Post, PostFilters as Filters } from '../types';
import { postService } from '../services/postService';

const matchesTextFilter = (post: Post, value: string) => {
  const search = value.toLowerCase();
  return (
    post.category.toLowerCase().includes(search) ||
    post.location.toLowerCase().includes(search) ||
    post.description.toLowerCase().includes(search)
  );
};

export const BrowsePostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await postService.getPosts(filters);
        setPosts(response);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [filters.type, filters.category, filters.location, filters.status]);

  const visiblePosts = useMemo(() => {
    if (!filters.search) return posts;
    return posts.filter((post) => matchesTextFilter(post, filters.search || ''));
  }, [posts, filters.search]);

  return (
    <main className="container-shell py-14">
      <SectionHeading
        eyebrow="Browse Posts"
        title="Search the live campus lost & found feed"
        description="Filter by item type, category, location, and status to narrow down the most relevant results."
      />

      <div className="mt-8">
        <PostFilters
          filters={filters}
          onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : visiblePosts.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No posts match your filters"
            description="Try broadening the search or check back later for newly reported items."
          />
        )}
      </div>
    </main>
  );
};
