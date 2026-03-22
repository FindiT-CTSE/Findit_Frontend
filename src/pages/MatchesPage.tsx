import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MatchResultCard } from '../components/posts/MatchResultCard';
import { Alert } from '../components/ui/Alert';
import { Button, buttonStyles } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { postService } from '../services/postService';
import { matchingService } from '../services/matchingService';
import { MatchItem, MatchResponse, Post } from '../types';

const isOwnedByUser = (post: Post, email?: string, id?: string) => {
  const owner = post.owner || post.user;
  return Boolean((id && owner?.id === id) || (email && owner?.email === email));
};

export const MatchesPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [matchData, setMatchData] = useState<MatchResponse | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState('');

  const loadPost = async () => {
    if (!id) return;

    setLoadingPost(true);
    setError('');

    try {
      const result = await postService.getPostById(id);
      setPost(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load the selected post.');
    } finally {
      setLoadingPost(false);
    }
  };

  const enrichMatchesWithPostDetails = async (matches: MatchItem[]) => {
    const enrichedMatches = await Promise.all(
      matches.map(async (match) => {
        try {
          const matchedPost = await postService.getPostById(match.matchedPostId);

          return {
            ...match,
            post: matchedPost,
          };
        } catch (err) {
          console.error(`Failed to load matched post ${match.matchedPostId}`, err);

          return {
            ...match,
            post: undefined,
          };
        }
      })
    );

    return enrichedMatches;
  };

  const loadMatches = async (selectedPost: Post) => {
    setLoadingMatches(true);
    setError('');

    try {
      const result = await matchingService.getMatchesForPost(selectedPost);

      const enrichedMatches = await enrichMatchesWithPostDetails(result.matches);

      setMatchData({
        ...result,
        matches: enrichedMatches,
        count: enrichedMatches.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch matches.');
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    void loadPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      void loadMatches(post);
    }
  }, [post]);

  const isOwner = useMemo(
    () => (post ? isOwnedByUser(post, user?.email, user?.id) : false),
    [post, user?.email, user?.id],
  );

  const sortedMatches =
    matchData?.matches
      ?.slice()
      .sort((a, b) => {
        const scoreA = a.score <= 1 ? a.score * 100 : a.score;
        const scoreB = b.score <= 1 ? b.score * 100 : b.score;
        return scoreB - scoreA;
      }) || [];

  const topMatchScore =
    sortedMatches.length > 0
      ? Math.round(sortedMatches[0].score <= 1 ? sortedMatches[0].score * 100 : sortedMatches[0].score)
      : 0;

  if (loadingPost) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <EmptyState
        title="Post not found"
        description="The selected post could not be loaded."
        action={
          <Link to="/my-posts" className={buttonStyles({})}>
            Back to my posts
          </Link>
        }
      />
    );
  }

  if (!isOwner) {
    return (
      <EmptyState
        title="Owner access only"
        description="You can view all campus posts, but only the user who created this post can open its matching workspace."
        action={
          <Link to={`/posts/${post.id}`} className={buttonStyles({})}>
            Back to post
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-700">
              Matching workspace
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">
              Possible matches for your post
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This page checks your selected lost or found report against the matching service.
            </p>
          </div>

          <Button onClick={() => post && void loadMatches(post)} loading={loadingMatches}>
            Refresh matches
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-ink">Selected post</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Type
            </p>
            <p className="mt-2 font-semibold text-ink">{post.type}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Category
            </p>
            <p className="mt-2 font-semibold text-ink">{post.category}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Location
            </p>
            <p className="mt-2 font-semibold text-ink">{post.location}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Status
            </p>
            <p className="mt-2 font-semibold text-ink">{post.status}</p>
          </div>
        </div>
      </Card>

      {error ? <Alert title="Matching error" message={error} variant="error" /> : null}

      {loadingMatches ? (
        <div className="flex min-h-[220px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : matchData && sortedMatches.length ? (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-ink">Match results</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {sortedMatches.length} possible match{sortedMatches.length === 1 ? '' : 'es'} found for this post.
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Top match score
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-800">
                  {topMatchScore}%
                </p>
              </div>
            </div>
          </Card>

          {sortedMatches.map((match, index) => (
            <MatchResultCard
              key={match.matchedPostId}
              match={match}
              rank={index + 1}
              isTopMatch={index === 0}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matches found"
          description="The matching service did not return any possible matches for this post yet."
          action={
            <Button onClick={() => post && void loadMatches(post)}>
              Try again
            </Button>
          }
        />
      )}
    </div>
  );
};
