import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="mt-20 border-t border-slate-200 bg-white">
    <div className="container-shell grid gap-8 py-12 md:grid-cols-3">
      <div>
        <h3 className="text-lg font-bold text-ink">FindIt</h3>
        <p className="mt-3 text-sm text-slate-600">
          A smart campus lost and found experience designed for faster reporting, discovery, and recovery.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Explore</p>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
          <Link to="/posts">Browse Items</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Demo Ready</p>
        <p className="mt-4 text-sm text-slate-600">
          Built for CTSE assignment demos with responsive views, protected routes, and API-ready service layers.
        </p>
      </div>
    </div>
  </footer>
);
