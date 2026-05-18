import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">Privacy Policy</h1>
      <div className="mt-8 space-y-8 text-neutral-300 leading-relaxed">
        <p className="text-sm text-neutral-400">Last updated: May 18, 2026</p>

        <p>
          At <strong>Hired or Roasted</strong>, accessible from <Link href="https://hiredorroasted.online" className="text-purple-400 hover:underline">https://hiredorroasted.online</Link>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Hired or Roasted and how we use it.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
          <p>
            When you use our Service, we collect the following categories of data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Resume Content:</strong> When you upload a resume, we extract and process the text content. **We do not store your raw uploaded PDF or Word files long-term.** They are held securely in a temporary server cache, processed through our AI analysis model, and then immediately discarded.
            </li>
            <li>
              <strong>Account Data:</strong> We use <strong>Clerk</strong> for secure user authentication. Clerk collects and stores your email address, profile photo, and name to create your secure dashboard.
            </li>
            <li>
              <strong>Usage & Analytics:</strong> We collect standard telemetry data (like IP addresses, browser types, and pages visited) to optimize our server performance.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
          <p>
            We use the information we collect in the following ways:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, operate, and maintain your resume roasting dashboard.</li>
            <li>To generate tailored resume feedback, scores, and re-written action items.</li>
            <li>To process your recurring subscription purchases via Paddle.</li>
            <li>To detect, prevent, and address technical bugs or abuse patterns.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">3. Third-Party Data Processors</h2>
          <p>
            To deliver a premium, secure SaaS experience, we partner with trusted global services that process data under strict confidentiality:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Paddle (Merchant of Record):</strong> Paddle processes your secure card, Google Pay, and billing details. We never see or store your raw credit card numbers.
            </li>
            <li>
              <strong>Clerk (User Authentication):</strong> Securely registers, encrypts, and handles your user login credentials.
            </li>
            <li>
              <strong>Supabase (Database):</strong> Stores your completed resume roasts history and usage quota metrics securely.
            </li>
            <li>
              <strong>OpenAI / DeepSeek / NVIDIA NIM (AI Models):</strong> Extracted resume text is sent securely to these advanced model APIs to generate feedback. This text is processed ephemerally and is not used to train global public models.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">4. Data Security</h2>
          <p>
            We implement industry-standard encryption protocols (SSL/HTTPS) to protect all data in transit. However, please remember that no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute absolute security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">5. Cookies and Tracking</h2>
          <p>
            We use essential security cookies (handled by Clerk) to keep you logged into your dashboard session safely. We do not use intrusive cross-site tracking cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">6. Children's Privacy</h2>
          <p>
            Our Service is not directed to anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us so that we can delete it immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">7. Your Data Rights</h2>
          <p>
            You have the right to request access to, correction of, or permanent deletion of your personal data stored in our database. You can instantly delete your account and history directly from your user dashboard or by emailing us.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">8. Contact Information</h2>
          <p>
            If you have any questions or require more information about our Privacy Policy, do not hesitate to contact us at:
            <br />
            Email: <a href="mailto:ayandas8371@gmail.com" className="text-purple-400 hover:text-purple-300 hover:underline">ayandas8371@gmail.com</a>
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
