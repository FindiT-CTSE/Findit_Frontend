import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      await login(form);
      showToast({ title: 'Welcome back', message: 'You are now signed in.', variant: 'success' });
      navigate((location.state as { from?: string } | null)?.from || '/dashboard');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to login.');
    }
  };

  return (
    <main className="container-shell py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr,0.95fr]">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">Login</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">Access your FindIt dashboard</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Track your reported items, browse current posts, and manage activity from one clean workspace.
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
            {error ? <Alert title="Login failed" message={error} variant="error" /> : null}
            <Button type="submit" className="w-full" loading={isLoading}>
              Sign in
            </Button>
          </form>
          <p className="mt-6 text-sm text-slate-600">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-brand-700">
              Register here
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
};
