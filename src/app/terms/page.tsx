import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D0000] text-white">
      <nav className="bg-[#0D0000]/95 border-b border-red-900/40 px-6 py-4">
        <Logo size="sm" variant="light" href="/" />
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: May 9, 2026</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By creating an account on Screen Entry, you agree to these Terms of Service. If you do not agree, do not use the platform. These terms are governed by the laws of India, including the Information Technology Act, 2000 and IT Rules 2021.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Eligibility</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>You must be at least 18 years old to use this platform</li>
              <li>You must provide accurate and truthful information during signup</li>
              <li>One account per person — multiple accounts are not permitted</li>
              <li>Currently invite-only — you must have a valid invite code to register</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. User Conduct</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Upload obscene, objectionable, or sexually explicit content</li>
              <li>Impersonate another person or misrepresent your identity</li>
              <li>Use the platform to spam, harass, or defraud other users</li>
              <li>Upload content that infringes on intellectual property rights</li>
              <li>Attempt to hack, reverse-engineer, or disrupt the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Content Moderation</h2>
            <p>All photos are reviewed by our moderation team before being made public. We reserve the right to remove any content that violates these terms without prior notice. Objectionable content reported by users will be reviewed within <strong>36 hours</strong> in compliance with IT Rules 2021.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Account Suspension & Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. Suspended accounts are retained for 90 days before permanent deletion. You may also delete your account at any time from your profile settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Subscriptions & Payments</h2>
            <p>Screen Entry may introduce paid subscription plans in the future. Payments will be processed through RBI-approved payment gateways. Pricing and billing terms will be communicated clearly before any charges are made.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Intellectual Property</h2>
            <p>You retain ownership of all content you upload (photos, reels, profile information). By uploading content, you grant Screen Entry a non-exclusive licence to display it on the platform. We do not claim ownership of your content.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Limitation of Liability</h2>
            <p>Screen Entry is a platform connecting actors and recruiters — we are not responsible for the outcome of any casting interactions, agreements, or disputes between users. We provide the platform as-is and make no guarantees of employment or casting opportunities.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Grievances</h2>
            <p>For any complaints or grievances, contact our Grievance Officer via our <Link href="/grievance" className="text-amber-400 hover:underline">Grievance page</Link>. We will acknowledge within 24 hours and resolve within 15 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Contact</h2>
            <p>Email: <a href="mailto:aamohammad0786@gmail.com" className="text-amber-400 hover:underline">aamohammad0786@gmail.com</a></p>
          </section>
        </div>
      </main>
    </div>
  );
}
