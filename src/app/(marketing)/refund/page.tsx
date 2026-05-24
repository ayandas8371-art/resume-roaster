import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
};

export default function RefundPolicy() {
  return (
    <div className="py-24 sm:py-32 bg-[#0a0508] min-h-screen text-gray-300">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 prose prose-invert">
        <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>
        <p>Last updated: May 2026</p>
        
        <h2>1. Returns and Refunds</h2>
        <p>
          Because Hired or Roasted provides immediate access to AI-generated digital content and compute resources, we generally do not offer refunds once a roast or resume generation has been processed. 
        </p>

        <h2>2. Exceptions</h2>
        <p>
          If our system experiences a critical technical failure that prevents your resume from being processed after payment, please contact our support team within 7 days of purchase for a full refund or credit.
        </p>

        <h2>3. Contact Us</h2>
        <p>
          If you have any questions about our Returns and Refunds Policy, please contact us at support@hiredorroasted.online.
        </p>
      </div>
    </div>
  );
}
