import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">Terms of Service</h1>
      <div className="mt-8 space-y-8 text-neutral-300 leading-relaxed">
        <p className="text-sm text-neutral-400">Last updated: May 18, 2026</p>
        
        <p>
          Welcome to <strong>Hired or Roasted</strong>. Please read these Terms of Service ("Terms") carefully before using our website at <Link href="https://resume-roaster-pi-seven.vercel.app" className="text-purple-400 hover:underline">https://resume-roaster-pi-seven.vercel.app</Link> (the "Service") operated by Hired or Roasted ("us", "we", or "our").
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
          <p>
            Hired or Roasted provides an AI-powered resume analysis, critique, scorecard generation, and career optimization utility. The Service is provided "as is" and is intended for informational, educational, and entertainment purposes. We do not guarantee career placement, job offers, or specific resume performance outcomes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">3. Subscriptions, Payments & Billing</h2>
          <p>
            Our order process and payment transactions are handled securely by our Merchant of Record, <strong>Paddle</strong>. 
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Billing Cycle:</strong> Subscriptions are billed on a recurring monthly or annual basis depending on the plan chosen (Starter or Pro). Your subscription will automatically renew under the same conditions unless cancelled.
            </li>
            <li>
              <strong>Cancellation:</strong> You may cancel your subscription at any time directly through your billing portal in the user dashboard. Upon cancellation, you will retain access to your premium features until the end of your current active billing period.
            </li>
            <li>
              <strong>Price Changes:</strong> We reserve the right to adjust subscription rates at any time. Any rate modifications will be communicated in advance, allowing you ample time to cancel prior to renewal.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">4. Refund Policy</h2>
          <p>
            We want you to be completely satisfied with Hired or Roasted. Because our Service provides immediate digital value (AI processing tokens), our refund rules are structured as follows:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              You are eligible for a full refund within **14 days** of your initial purchase if you have not consumed more than **1 AI resume roast** credit.
            </li>
            <li>
              To request a refund, please contact our support team at <a href="mailto:ayandas8371@gmail.com" className="text-purple-400 hover:underline">ayandas8371@gmail.com</a> with your account email and purchase details. 
            </li>
            <li>
              Refunds will be processed back to your original payment method via Paddle within 5 to 10 business days.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">5. Intellectual Property & Acceptable Use</h2>
          <p>
            You retain all rights to the resume text and files you upload to the Service. By uploading, you grant us a temporary, non-exclusive license to process your resume through our secure server infrastructure and third-party AI models solely to generate your roasts.
          </p>
          <p>
            You agree not to upload any resume containing malicious code, illegal materials, or hate speech. We reserve the right to terminate accounts that violate these guidelines immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">6. Limitation of Liability</h2>
          <p>
            In no event shall Hired or Roasted, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">7. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: <a href="mailto:ayandas8371@gmail.com" className="text-purple-400 hover:underline">ayandas8371@gmail.com</a>
          </p>
        </section>

        <div className="pt-6">
          <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
