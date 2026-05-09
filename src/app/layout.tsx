import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Screen Entry - Telugu Cinema Casting Platform',
  description: 'Connecting talent with big screens. The premium casting platform for the Telugu film industry.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen font-sans text-slate-900 bg-white selection:bg-amber-100 selection:text-amber-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-red-900/20 bg-[#0D0000] py-12 px-6 mt-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" variant="light" href="/" />
            <p className="text-slate-400 text-sm">&copy; 2026 Screen Entry. Empowering the Telugu film fraternity.</p>
            <div className="flex gap-6 flex-wrap justify-center">
              <a href="/privacy" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Terms</a>
              <a href="/grievance" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Grievance Officer</a>
              <a href="/contact" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
