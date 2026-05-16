import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-text-secondary">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2 className="text-xl font-semibold text-text-primary">1. Information We Collect</h2>
          <p className="mt-2">We collect the resume text you upload to generate roasts. We do not store your original PDF files long-term; they are processed and then discarded.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary">2. How We Use Your Data</h2>
          <p className="mt-2">Your data is used solely to generate AI feedback and improved resume versions. We do not sell your personal information to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-text-primary">3. AI Processing</h2>
          <p className="mt-2">We use third-party AI providers to process resume text. Your data is sent securely and is subject to their respective privacy policies.</p>
        </section>
        <Link href="/" className="inline-block mt-8 text-accent-purple hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
