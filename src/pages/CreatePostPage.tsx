import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../hooks/useToast';
import { CreatePostPayload } from '../types';
import { postService } from '../services/postService';

const categories = ['Electronics', 'ID Card', 'Wallet', 'Bag', 'Keys', 'Books', 'Accessories', 'Other'];

export const CreatePostPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState<CreatePostPayload>({
    type: 'LOST',
    category: '',
    location: '',
    date: '',
    description: '',
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.type || !form.category || !form.location || !form.date || !form.description) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const created = await postService.createPost(form);
      showToast({
        title: 'Post created',
        message: 'Your item report is now live in the campus feed.',
        variant: 'success',
      });
      navigate(`/posts/${created.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
      <Card className="p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">Create a post</p>
        <h2 className="mt-3 text-3xl font-bold text-ink">Report a lost or found item</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Add enough detail so students and staff can quickly identify the item and act on it.
        </p>
        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <Select
            label="Post type"
            value={form.type}
            onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as 'LOST' | 'FOUND' }))}
          >
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </Select>
          <Select
            label="Category"
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Input
            label="Location"
            placeholder="Library, Lab 2, Main Gate"
            value={form.location}
            onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
          />
          <div className="md:col-span-2">
            <Input
              label="Image URL"
              placeholder="https://example.com/item.jpg"
              value={form.imageUrl}
              onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Description"
              placeholder="Describe appearance, identifying features, and relevant notes."
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </div>
          {error ? (
            <div className="md:col-span-2">
              <Alert title="Could not create post" message={error} variant="error" />
            </div>
          ) : null}
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="lg" loading={submitting}>
              Publish report
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-8">
        <h3 className="text-2xl font-bold text-ink">Preview tips</h3>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-ink">Use precise locations</p>
            <p className="mt-2 text-sm text-slate-600">Specific places like “Faculty of Computing Lab 3” improve match quality.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-ink">Highlight unique details</p>
            <p className="mt-2 text-sm text-slate-600">Mention sticker colors, initials, or marks that can verify ownership.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-ink">Keep the status updated</p>
            <p className="mt-2 text-sm text-slate-600">Close the post once the item is returned so the feed stays accurate.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
