import { Logo } from '@/components/Logo';
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function GrievancePage() {
  return (
    <div className="min-h-screen bg-[#0D0000] text-white">
      <nav className="bg-[#0D0000]/95 border-b border-red-900/40 px-6 py-4">
        <Logo size="sm" variant="light" href="/" />
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={28} className="text-amber-400" />
          <h1 className="text-3xl font-bold text-amber-400">Grievance Officer</h1>
        </div>
        <p className="text-slate-400 text-sm mb-10">As required under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</p>

        <Card className="bg-[#1a0000] border-red-900/40 p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Grievance Officer Details</h2>
          <div className="space-y-2 text-slate-300">
            <div className="flex gap-3">
              <span className="text-slate-500 w-24 shrink-0">Name</span>
              <span className="font-medium text-white">Screen Entry</span>
            </div>
            <div className="flex gap-3">
              <span className="text-slate-500 w-24 shrink-0">Organisation</span>
              <span>Screen Entry</span>
            </div>
            <div className="flex gap-3">
              <span className="text-slate-500 w-24 shrink-0">Email</span>
              <a href="mailto:aamohammad0786@gmail.com" className="text-amber-400 hover:underline">aamohammad0786@gmail.com</a>
            </div>
            <div className="flex gap-3">
              <span className="text-slate-500 w-24 shrink-0">Address</span>
              <span className="text-amber-500/80 text-sm italic">[Pending — to be updated]</span>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="bg-[#1a0000] border-red-900/40 p-4 text-center">
            <Clock size={24} className="text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">24 hrs</p>
            <p className="text-xs text-slate-400 mt-1">Acknowledgement time</p>
          </Card>
          <Card className="bg-[#1a0000] border-red-900/40 p-4 text-center">
            <CheckCircle2 size={24} className="text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">15 days</p>
            <p className="text-xs text-slate-400 mt-1">Resolution time</p>
          </Card>
          <Card className="bg-[#1a0000] border-red-900/40 p-4 text-center">
            <ShieldCheck size={24} className="text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">36 hrs</p>
            <p className="text-xs text-slate-400 mt-1">Content removal time</p>
          </Card>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">How to File a Grievance</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Email us at <a href="mailto:aamohammad0786@gmail.com" className="text-amber-400 hover:underline">aamohammad0786@gmail.com</a> with the subject line <strong>"Grievance — [brief description]"</strong></li>
              <li>Include your registered email address and a clear description of the issue</li>
              <li>If reporting objectionable content, include the URL or screenshot</li>
              <li>We will acknowledge your grievance within <strong>24 hours</strong></li>
              <li>We will resolve and communicate the outcome within <strong>15 days</strong></li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">What You Can Report</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Objectionable, obscene, or offensive content</li>
              <li>Impersonation or fake profiles</li>
              <li>Harassment or abuse by another user</li>
              <li>Misuse of your personal data</li>
              <li>Content that violates your intellectual property rights</li>
              <li>Any violation of our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Legal Basis</h2>
            <p>This Grievance Officer is appointed in compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, under the Information Technology Act, 2000.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
