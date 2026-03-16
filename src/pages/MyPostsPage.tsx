import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button, buttonStyles } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Post } from '../types';
import { formatDate } from '../utils/format';
import { postService } from '../services/postService';

const isOwnedByUser = (post: Post, email?: string, id?: string) => {
  const owner = post.owner || post.user;
  return Boolean((id && owner?.id === id) || (email && owner?.email === email));
};

export const MyPostsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getPosts();
      setPosts(response.filter((post) => isOwnedByUser(post, user?.email, user?.id)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, [user?.email, user?.id]);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const typeMatch = !type || post.type === type;
        const statusMatch = !status || post.status === status;
        return typeMatch && statusMatch;
      }),
    [posts, type, status],
  );

  const handleClose = async (post: Post) => {
    setSubmitting(true);
    try {
      await postService.closePost(post.id);
      showToast({ title: 'Post closed', message: 'The post status has been updated.', variant: 'success' });
      await loadPosts();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setSubmitting(true);
    try {
      await postService.deletePost(selectedPost.id);
      showToast({ title: 'Post deleted', message: 'The post has been removed.', variant: 'success' });
      setSelectedPost(null);
      await loadPosts();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">My posts</h2>
            <p className="mt-2 text-sm text-slate-600">Filter and manage the reports you created.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
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
        </div>
      </Card>

      {filteredPosts.length ? (
        <Card className="overflow-hidden p-2">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-slate-500">
                  <th className="px-4 py-4 font-semibold">Item</th>
                  <th className="px-4 py-4 font-semibold">Type</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Date</th>
                  <th className="px-4 py-4 font-semibold">Location</th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t border-slate-100 text-sm">
                    <td className="px-4 py-4 font-semibold text-ink">{post.category}</td>
                    <td className="px-4 py-4">
                      <Badge variant={post.type === 'LOST' ? 'lost' : 'found'}>{post.type}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={post.status === 'OPEN' ? 'open' : 'closed'}>{post.status}</Badge>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(post.date)}</td>
                    <td className="px-4 py-4 text-slate-600">{post.location}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/posts/${post.id}`}
                          className={buttonStyles({ size: 'sm', variant: 'ghost' })}
                        >
                          View
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => void handleClose(post)}
                          disabled={post.status === 'CLOSED' || submitting}
                        >
                          Close
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setSelectedPost(post)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          title="No posts found"
          description="Create a report to start tracking lost and found activity from your dashboard."
          action={
            <Link to="/posts/new" className={buttonStyles({})}>
              Create your first post
            </Link>
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(selectedPost)}
        title="Delete selected post?"
        description="This permanently removes the selected report from your activity list."
        onCancel={() => setSelectedPost(null)}
        onConfirm={() => void handleDelete()}
        loading={submitting}
      />
    </div>
  );
};
