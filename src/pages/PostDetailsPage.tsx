import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button, buttonStyles } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Spinner } from '../components/ui/Spinner';
import { Textarea } from '../components/ui/Textarea';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { submitClaim } from '../services/claimsApi';
import { Post } from '../types';
import { formatDate, formatDateTime } from '../utils/format';
import { postService } from '../services/postService';

const ownedByUser = (post: Post, userEmail?: string, userId?: string) => {
  const owner = post.owner || post.user;
  return Boolean((userId && owner?.id === userId) || (userEmail && owner?.email === userEmail));
};

export const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimProof, setClaimProof] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await postService.getPostById(id);
        setPost(response);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const isOwner = useMemo(
    () => (post ? ownedByUser(post, user?.email, user?.id) : false),
    [post, user?.email, user?.id],
  );

  const handleClose = async () => {
    if (!post) return;
    setSubmitting(true);
    try {
      const updated = await postService.closePost(post.id);
      setPost(updated);
      showToast({ title: 'Post closed', message: 'This report is now marked as resolved.', variant: 'success' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    setSubmitting(true);
    try {
      await postService.deletePost(post.id);
      showToast({ title: 'Post deleted', message: 'The report has been removed.', variant: 'success' });
      navigate('/my-posts');
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  const handleSubmitClaim = async () => {
    if (!post) return;

    const trimmedMessage = claimMessage.trim();
    const trimmedProof = claimProof.trim();

    if (!trimmedMessage || !trimmedProof) {
      setClaimError('Please provide both a claim message and proof details.');
      setClaimSuccess('');
      return;
    }

    setClaimSubmitting(true);
    setClaimError('');
    setClaimSuccess('');

    try {
      await submitClaim({
        postId: post.id,
        message: trimmedMessage,
        proof: trimmedProof,
      });

      setClaimMessage('');
      setClaimProof('');
      setClaimSuccess('Your claim has been submitted and is waiting for review.');
      showToast({
        title: 'Claim submitted',
        message: 'The post owner can now review your ownership claim.',
        variant: 'success',
      });
    } catch (claimSubmitError) {
      const message =
        claimSubmitError instanceof Error ? claimSubmitError.message : 'Unable to submit this claim.';
      setClaimError(message);
      setClaimSuccess('');
    } finally {
      setClaimSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container-shell flex min-h-[400px] items-center justify-center py-14">
        <Spinner size="lg" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container-shell py-14">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-ink">Post not found</h1>
          <p className="mt-3 text-sm text-slate-600">The requested post could not be loaded.</p>
        </Card>
      </main>
    );
  }

  const owner = post.owner || post.user;

  return (
    <main className="container-shell py-14">
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card className="overflow-hidden p-8">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.category} className="mb-6 h-72 w-full rounded-[2rem] object-cover" />
          ) : (
            <div className="mb-6 flex h-72 items-center justify-center rounded-[2rem] bg-gradient-to-br from-brand-50 to-slate-100 text-lg font-semibold text-slate-500">
              No image provided
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={post.type === 'LOST' ? 'lost' : 'found'}>{post.type}</Badge>
            <Badge variant={post.status === 'OPEN' ? 'open' : 'closed'}>{post.status}</Badge>
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink">{post.category}</h1>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card className="border border-slate-100 p-4 shadow-none">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Location</p>
              <p className="mt-2 font-semibold text-ink">{post.location}</p>
            </Card>
            <Card className="border border-slate-100 p-4 shadow-none">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Date</p>
              <p className="mt-2 font-semibold text-ink">{formatDate(post.date)}</p>
            </Card>
            <Card className="border border-slate-100 p-4 shadow-none">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Created</p>
              <p className="mt-2 font-semibold text-ink">{formatDateTime(post.createdAt || post.date)}</p>
            </Card>
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Description</p>
            <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-slate-700">{post.description}</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-ink">Owner information</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-ink">Name:</span> {owner?.name || 'Not available'}
              </p>
              <p>
                <span className="font-semibold text-ink">Email:</span> {owner?.email || 'Not available'}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-ink">Actions</h2>
            <p className="mt-2 text-sm text-slate-600">
              Owners can close resolved reports or delete them if they were created by mistake.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {isAuthenticated && isOwner ? (
                <Link
                  to={`/my-posts/${post.id}/matches`}
                  className={buttonStyles({ variant: 'secondary', className: 'w-full' })}
                >
                  Check possible matches
                </Link>
              ) : null}

              {isAuthenticated && isOwner ? (
                <>
                  <Button onClick={handleClose} loading={submitting} disabled={post.status === 'CLOSED'}>
                    {post.status === 'CLOSED' ? 'Already closed' : 'Close post'}
                  </Button>
                  <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                    Delete post
                  </Button>
                </>
              ) : (
                <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Only the user who created this post can manage, match-check, close, or delete it.
                </p>
              )}

              <Link to="/dashboard" className={buttonStyles({ variant: 'ghost', className: 'w-full' })}>
                Back to feed
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-ink">Submit Claim</h2>
            <p className="mt-2 text-sm text-slate-600">
              If this item belongs to you, explain why and include proof the owner can verify.
            </p>

            {!isAuthenticated ? (
              <Alert
                title="Login required"
                message="Sign in to submit a claim for this post."
                variant="info"
              />
            ) : post.status === 'CLOSED' ? (
              <Alert
                title="Post closed"
                message="Claims are no longer accepted for resolved posts."
                variant="info"
              />
            ) : isOwner ? (
              <Alert
                title="Owner actions only"
                message="You cannot submit a claim on your own post."
                variant="info"
              />
            ) : (
              <div className="mt-5 space-y-4">
                {claimError ? <Alert title="Claim submission failed" message={claimError} variant="error" /> : null}
                {claimSuccess ? <Alert title="Claim submitted" message={claimSuccess} variant="success" /> : null}

                <Textarea
                  label="Message"
                  placeholder="Explain why you believe this item is yours."
                  value={claimMessage}
                  onChange={(event) => setClaimMessage(event.target.value)}
                />
                <Textarea
                  label="Proof"
                  placeholder="Add specific proof, such as a sticker, serial number, or unique mark."
                  value={claimProof}
                  onChange={(event) => setClaimProof(event.target.value)}
                  className="min-h-28"
                />

                <Button onClick={() => void handleSubmitClaim()} loading={claimSubmitting}>
                  Submit claim
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-ink">Related section</h2>
            <p className="mt-3 text-sm text-slate-600">
              This panel is ready for future similar-item suggestions or automated match recommendations.
            </p>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this post?"
        description="This action removes the post from the feed. Use it only if the report was created by mistake."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={submitting}
      />
    </main>
  );
};
