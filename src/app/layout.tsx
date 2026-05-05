import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Screen Entry — Telugu Cinema Casting Platform',
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Screen <span className="text-amber-400">Entry</span>
              </h1>
            </div>
            <p className="text-slate-400 text-sm">© 2026 Screen Entry. Empowering the Telugu film fraternity.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Terms</a>
              <a href="#" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
