import { Link } from 'react-router-dom';
import { buttonStyles } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';

const stats = [
  { label: 'Items reported this semester', value: '320+' },
  { label: 'Average time to first response', value: '2.4h' },
  { label: 'Successful campus reunions', value: '87%' },
];

const features = [
  {
    title: 'Fast reporting flow',
    description: 'File a lost or found item report in minutes with a guided form built for campus usage.',
  },
  {
    title: 'Searchable campus feed',
    description: 'Browse and filter reports by type, category, location, and status with clean card layouts.',
  },
  {
    title: 'Match-ready workflow',
    description: 'Stay prepared for service-driven matches and notifications with a dashboard built for updates.',
  },
];

const steps = [
  'Report a lost or found item with clear details, location, date, and optional image.',
  'Browse the live feed to search similar posts and track the current status.',
  'Manage your own activity from the dashboard and close posts when items are returned.',
];

export const HomePage = () => (
  <main>
    <section className="relative overflow-hidden">
      <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.15fr,0.85fr] lg:py-24">
        <div className="relative">
          <div className="absolute -left-8 top-6 -z-10 h-36 w-36 rounded-full bg-coral/20 blur-3xl" />
          <p className="inline-flex rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
            Smart Campus Lost & Found
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-ink sm:text-6xl">
            Find lost campus items faster with a modern smart recovery hub.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            FindIt turns university lost and found reporting into a polished, searchable, dashboard-first experience for students and staff.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/posts/new" className={buttonStyles({ size: 'lg', className: 'w-full sm:w-auto' })}>
              Report Lost Item
            </Link>
            <Link
              to="/posts/new"
              className={buttonStyles({
                size: 'lg',
                variant: 'secondary',
                className: 'w-full sm:w-auto',
              })}
            >
              Report Found Item
            </Link>
            <Link
              to="/posts"
              className={buttonStyles({ size: 'lg', variant: 'ghost', className: 'w-full sm:w-auto' })}
            >
              Browse Items
            </Link>
          </div>
        </div>

        <div className="surface-card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-hero-grid bg-[size:24px_24px] opacity-40" />
          <div className="relative grid gap-4">
            <Card className="border-none bg-gradient-to-br from-ink to-slate-800 p-5 text-white shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Live Campus Snapshot</p>
              <p className="mt-5 text-3xl font-bold">Open items across faculty zones</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-bold">68</p>
                  <p className="mt-1 text-sm text-white/70">Open reports</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-bold">14</p>
                  <p className="mt-1 text-sm text-white/70">New today</p>
                </div>
              </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <p className="text-sm font-semibold text-slate-500">Popular locations</p>
                <p className="mt-3 text-lg font-bold text-ink">Library, Canteen, Main Bus Stop</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm font-semibold text-slate-500">Top categories</p>
                <p className="mt-3 text-lg font-bold text-ink">ID cards, Chargers, Water bottles</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="container-shell py-12">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-4xl font-extrabold text-ink">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="container-shell py-16">
      <SectionHeading
        eyebrow="Feature Highlights"
        title="Built for a polished smart campus experience"
        description="The frontend balances modern visuals with practical lost and found workflows for students and staff."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6">
            <h3 className="text-xl font-bold text-ink">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="bg-ink py-16 text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr,1.2fr]">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple steps for students and staff
          </h2>
          <p className="mt-4 text-base text-white/70">
            From the first report to a successful return, the flow stays clear and easy to use.
          </p>
        </div>
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">Step {index + 1}</p>
              <p className="mt-3 text-lg font-semibold text-white">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);
