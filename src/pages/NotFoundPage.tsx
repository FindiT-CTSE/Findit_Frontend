import { Link } from 'react-router-dom';
import { buttonStyles } from '../components/ui/Button';

export const NotFoundPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,155,117,0.15),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4">
    <div className="max-w-xl rounded-[2rem] border border-white/80 bg-white/90 p-10 text-center shadow-soft backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">404</p>
      <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-ink">Page not found</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        The page you requested does not exist or may have moved. Return to the main FindIt experience.
      </p>
      <Link to="/" className={`mt-8 inline-block ${buttonStyles({ size: 'lg' })}`}>
        Back to home
      </Link>
    </div>
  </main>
);
