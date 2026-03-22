import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { approveClaim, fetchReceivedClaims, rejectClaim } from '../services/claimsApi';
import { Claim } from '../types';
import { formatDateTime } from '../utils/format';
import { getClaimStatusLabel, getClaimStatusVariant } from '../utils/claims';

export const ReceivedClaimsPage = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionClaimId, setActionClaimId] = useState<string | null>(null);

  const loadClaims = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchReceivedClaims();
      const sortedClaims = response.claims
        .slice()
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
      setClaims(sortedClaims);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load received claims.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClaims();
  }, [loadClaims]);

  const handleReview = async (claimId: string, decision: 'approve' | 'reject') => {
    setActionClaimId(claimId);
    setError('');

    try {
      const response =
        decision === 'approve' ? await approveClaim(claimId) : await rejectClaim(claimId);

      setClaims((current) =>
        current.map((claim) => (claim.id === claimId ? response.claim : claim)),
      );
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : `Unable to ${decision} this claim.`,
      );
    } finally {
      setActionClaimId(null);
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
            <h2 className="text-3xl font-bold text-ink">Received Claims</h2>
            <p className="mt-2 text-sm text-slate-600">
              Review ownership claims submitted against posts you created.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <p className="font-semibold text-ink">{claims.length}</p>
            <p className="text-slate-500">Claims received</p>
          </div>
        </div>
      </Card>

      {error ? <Alert title="Claims error" message={error} variant="error" /> : null}

      {claims.length ? (
        <div className="grid gap-4">
          {claims.map((claim) => (
            <Card key={claim.id} className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getClaimStatusVariant(claim.status)}>
                      {getClaimStatusLabel(claim.status)}
                    </Badge>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Post {claim.postId}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Claimant {claim.claimantUserId}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink">Claim message</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {claim.message}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink">Ownership proof</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {claim.proof}
                    </p>
                  </div>
                </div>

                <div className="min-w-[240px] space-y-3 rounded-[1.25rem] bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Submitted
                    </p>
                    <p className="mt-2 text-sm text-slate-700">{formatDateTime(claim.createdAt)}</p>
                  </div>

                  {claim.reviewedAt ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Reviewed
                      </p>
                      <p className="mt-2 text-sm text-slate-700">{formatDateTime(claim.reviewedAt)}</p>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    <Link to={`/posts/${claim.postId}`} className="text-sm font-semibold text-brand-700">
                      View related post
                    </Link>
                    {claim.status === 'PENDING' ? (
                      <>
                        <Button
                          onClick={() => void handleReview(claim.id, 'approve')}
                          loading={actionClaimId === claim.id}
                        >
                          Approve claim
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => void handleReview(claim.id, 'reject')}
                          loading={actionClaimId === claim.id}
                        >
                          Reject claim
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No received claims yet"
          description="No one has submitted an ownership claim on your posts yet."
          action={
            <Link to="/my-posts" className="text-sm font-semibold text-brand-700">
              Review my posts
            </Link>
          }
        />
      )}
    </div>
  );
};
