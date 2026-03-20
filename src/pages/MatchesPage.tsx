import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MatchResultCard } from '../components/posts/MatchResultCard';
import { Alert } from '../components/ui/Alert';
import { Button, buttonStyles } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { postService } from '../services/postService';
import { matchingService } from '../services/matchingService';
import { MatchResponse, Post } from '../types';

export const MatchesPage = () => {
  const { id } = useParams();
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

  const loadMatches = async (selectedPost: Post) => {
    setLoadingMatches(true);
    setError('');

    try {
      const result = await matchingService.getMatchesForPost(selectedPost);
      setMatchData(result);
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-brand-700">Matching workspace</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Possible matches for your post</h2>
            <p className="mt-2 text-sm text-slate-600">
              This page checks your selected lost or found report against the matching service.
            </p>
          </div>

          <Button
            onClick={() => post && void loadMatches(post)}
            loading={loadingMatches}
          >
            Refresh matches
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-ink">Selected post</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Type</p>
            <p className="mt-2 font-semibold text-ink">{post.type}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Category</p>
            <p className="mt-2 font-semibold text-ink">{post.category}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Location</p>
            <p className="mt-2 font-semibold text-ink">{post.location}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</p>
            <p className="mt-2 font-semibold text-ink">{post.status}</p>
          </div>
        </div>
      </Card>

      {error ? <Alert title="Matching error" message={error} variant="error" /> : null}

      {loadingMatches ? (
        <div className="flex min-h-[220px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : matchData && matchData.matches.length ? (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-xl font-bold text-ink">Match results</h3>
            <p className="mt-2 text-sm text-slate-600">
              {matchData.count} possible match{matchData.count === 1 ? '' : 'es'} found for this post.
            </p>
          </Card>

          {matchData.matches.map((match) => (
            <MatchResultCard key={match.matchedPostId} match={match} />
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