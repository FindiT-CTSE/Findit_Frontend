import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { cancelClaim, fetchMyClaims } from '../services/claimsApi';
import { Claim } from '../types';
import { formatDateTime } from '../utils/format';
import { getClaimStatusLabel, getClaimStatusVariant } from '../utils/claims';

export const MyClaimsPage = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionClaimId, setActionClaimId] = useState<string | null>(null);

  const loadClaims = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchMyClaims();
      const sortedClaims = response.claims
        .slice()
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
      setClaims(sortedClaims);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load your claims.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClaims();
  }, [loadClaims]);

  const handleCancel = async (claimId: string) => {
    setActionClaimId(claimId);
    setError('');

    try {
      const response = await cancelClaim(claimId);
      setClaims((current) =>
        current.map((claim) => (claim.id === claimId ? response.claim : claim)),
      );
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Unable to cancel this claim.');
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
            <h2 className="text-3xl font-bold text-ink">My Claims</h2>
            <p className="mt-2 text-sm text-slate-600">
              Review the claims you have submitted on lost and found posts.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <p className="font-semibold text-ink">{claims.length}</p>
            <p className="text-slate-500">Claims submitted</p>
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
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink">Message</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {claim.message}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink">Proof</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {claim.proof}
                    </p>
                  </div>
                </div>

                <div className="min-w-[220px] space-y-3 rounded-[1.25rem] bg-slate-50 p-4">
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
                      <Button
                        variant="ghost"
                        onClick={() => void handleCancel(claim.id)}
                        loading={actionClaimId === claim.id}
                      >
                        Cancel claim
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No claims submitted yet"
          description="You have not submitted any claims on campus posts yet."
          action={
            <Link to="/dashboard" className="text-sm font-semibold text-brand-700">
              Browse campus feed
            </Link>
          }
        />
      )}
    </div>
  );
};
