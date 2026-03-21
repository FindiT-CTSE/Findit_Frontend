import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.fullName || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register({ fullName: form.fullName, email: form.email, password: form.password });
      showToast({ title: 'Account created', message: 'Your account is ready to use.', variant: 'success' });
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to register.');
    }
  };

  return (
    <main className="container-shell py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr,1fr]">
        <Card className="order-2 p-8 lg:order-1">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              placeholder="Bhanuka Fernando"
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              placeholder="student@university.edu"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((current) => ({ ...current, confirmPassword: event.target.value }))
              }
            />
            {error ? <Alert title="Registration failed" message={error} variant="error" /> : null}
            <Button type="submit" className="w-full" loading={isLoading}>
              Create account
            </Button>
          </form>
          <p className="mt-6 text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-brand-700">
              Login here
            </Link>
          </p>
        </Card>

        <div className="order-1 flex flex-col justify-center lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">Register</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">Create your campus recovery account</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Start reporting lost and found items, monitor possible matches, and keep your campus community connected.
          </p>
        </div>
      </div>
    </main>
  );
};
