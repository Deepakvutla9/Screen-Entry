import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D0000] text-white">
      <nav className="bg-[#0D0000]/95 border-b border-red-900/40 px-6 py-4">
        <Logo size="sm" variant="light" href="/" />
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: May 9, 2026</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Who We Are</h2>
            <p>Screen Entry is a professional casting platform for the Telugu film industry, connecting actors with casting directors, production houses, and recruiters. We are operated by <strong>Screen Entry</strong>, based in India.</p>
            <p className="mt-2 text-amber-500/80 text-sm">⚠️ Business address: <em>[Pending — to be updated]</em></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. What Data We Collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Name, email address, and password (via Supabase Auth)</li>
              <li>Profile information: location, age, height, skills, languages</li>
              <li>Profile photo and portfolio photos (stored in Supabase Storage)</li>
              <li>Video reel links (YouTube/Vimeo URLs)</li>
              <li>Social media links (Instagram, Twitter, YouTube, Website)</li>
              <li>Role on the platform (actor or recruiter)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To display your profile to casting directors and recruiters</li>
              <li>To allow you to apply for casting calls</li>
              <li>To communicate platform updates and notifications</li>
              <li>To moderate content and ensure platform safety</li>
              <li>To comply with applicable Indian laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Data Retention</h2>
            <p>Active accounts retain data indefinitely while the account is active. Suspended accounts are retained for <strong>90 days</strong> after suspension, then permanently deleted. You may request deletion of your data at any time — we will process it within <strong>72 hours</strong> as required under IT Rules 2021.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Your Rights</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Access the data we hold about you</li>
              <li>Correct inaccurate information via your profile settings</li>
              <li>Request deletion of your account and all associated data</li>
              <li>File a grievance if you believe your data was misused</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Data Sharing</h2>
            <p>We do not sell your personal data. Your profile information (name, photos, skills, reel) is visible to other registered users of the platform. We use Supabase (database and storage) and Vercel (hosting) as infrastructure providers — both comply with international data protection standards.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Content Moderation</h2>
            <p>All photos uploaded to the platform are reviewed by our moderation team before being made public. Objectionable content is removed within <strong>36 hours</strong> of being flagged, in compliance with IT Rules 2021.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Grievances</h2>
            <p>If you have any concerns about your data or content on the platform, contact our Grievance Officer. See our <Link href="/grievance" className="text-amber-400 hover:underline">Grievance page</Link> for details.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Contact</h2>
            <p>Email: <a href="mailto:aamohammad0786@gmail.com" className="text-amber-400 hover:underline">aamohammad0786@gmail.com</a></p>
          </section>
        </div>
      </main>
    </div>
  );
}
