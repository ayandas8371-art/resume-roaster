import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary">Terms of Service</h1>
      <div className="mt-8 space-y-6 text-text-secondary">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2 className="text-xl font-semibold text-text-primary">1. Acceptable Use</h2>
          <p className="mt-2">By using Roast My Resume, you agree not to upload harmful, illegal, or offensive content. We reserve the right to terminate access for users who violate these terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary">2. Subscriptions & Payments</h2>
          <p className="mt-2">Subscriptions are handled through RevenueCat and Stripe. You can cancel at any time through your billing dashboard. Refunds are subject to our refund policy.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary">3. Disclaimer</h2>
          <p className="mt-2">Roast My Resume provides AI-generated feedback for entertainment and educational purposes. We do not guarantee job placement or career outcomes.</p>
        </section>
        <Link href="/" className="inline-block mt-8 text-accent-purple hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
