import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0D0000] text-white">
      <nav className="bg-[#0D0000]/95 border-b border-red-900/40 px-6 py-4">
        <Logo size="sm" variant="light" href="/" />
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Contact Us</h1>
        <p className="text-slate-400 text-sm mb-10">We're here to help. Reach out for any questions, support, or feedback.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-[#1a0000] border-red-900/40 p-6">
            <Mail size={22} className="text-amber-400 mb-3" />
            <h2 className="font-bold text-white mb-1">General Enquiries</h2>
            <p className="text-slate-400 text-sm mb-3">For questions about the platform, your account, or partnerships.</p>
            <a href="mailto:aamohammad0786@gmail.com" className="text-amber-400 hover:underline text-sm">aamohammad0786@gmail.com</a>
          </Card>

          <Card className="bg-[#1a0000] border-red-900/40 p-6">
            <ShieldCheck size={22} className="text-amber-400 mb-3" />
            <h2 className="font-bold text-white mb-1">Grievances & Reports</h2>
            <p className="text-slate-400 text-sm mb-3">To report objectionable content or file a formal grievance.</p>
            <Link href="/grievance" className="text-amber-400 hover:underline text-sm">View Grievance Officer details →</Link>
          </Card>

          <Card className="bg-[#1a0000] border-red-900/40 p-6 md:col-span-2">
            <MapPin size={22} className="text-amber-400 mb-3" />
            <h2 className="font-bold text-white mb-1">Address</h2>
            <p className="text-amber-500/80 text-sm italic">Screen Entry, India</p>
            <p className="text-slate-500 text-xs mt-1">[Full address pending — to be updated]</p>
          </Card>
        </div>

        <div className="text-slate-400 text-sm space-y-1">
          <p>For legal notices, please email us with the subject line <strong className="text-white">"Legal Notice — Screen Entry"</strong>.</p>
          <p>We respond to all emails within <strong className="text-white">2 business days</strong>. Grievances are acknowledged within <strong className="text-white">24 hours</strong>.</p>
        </div>
      </main>
    </div>
  );
}
