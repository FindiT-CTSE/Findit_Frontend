import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export const PublicLayout = () => (
  <div className="relative min-h-screen overflow-hidden bg-slate-50">
    <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-br from-brand-100 via-sand to-slate-50" />
    <Navbar />
    <Outlet />
    <Footer />
  </div>
);
