import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { PostHogProvider } from "@/lib/posthog";
import { RevenueCatProvider } from "@/components/providers/revenuecat-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-roaster-pi-seven.vercel.app"),
  title: {
    default: "Hired or Roasted — Savage AI Resume Roaster & Critique",
    template: "%s | Hired or Roasted",
  },
  description:
    "Get roasted by our savage AI recruiter. Receive brutally honest critiques, metrics-driven fixes, a shareable scorecard, and priority feedback. Upload your resume now!",
  keywords: [
    "resume roast",
    "roast my resume",
    "hired or roasted",
    "AI resume feedback",
    "resume score checker",
    "CV critique",
    "CV roaster",
    "savage resume audit",
    "career reality check",
  ],
  authors: [{ name: "Hired or Roasted Team" }],
  creator: "Hired or Roasted",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume-roaster-pi-seven.vercel.app",
    title: "Hired or Roasted — Savage AI Resume Roaster & Critique",
    description:
      "Get roasted by our savage AI recruiter. Receive brutally honest critiques, metrics-driven fixes, and a shareable scorecard. Upload your resume now!",
    siteName: "Hired or Roasted",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hired or Roasted — Savage AI Resume Roaster & Critique",
    description:
      "Get roasted by our savage AI recruiter. Receive brutally honest critiques, metrics-driven fixes, and a shareable scorecard. Upload your resume now!",
    creator: "@HiredOrRoasted",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Rich Search Schemas (JSON-LD)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Hired or Roasted",
  "url": "https://resume-roaster-pi-seven.vercel.app",
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hired or Roasted",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the roast actually helpful?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Behind every savage burn is an actionable improvement. The humor makes you pay attention. The fixes make you employable."
      }
    },
    {
      "@type": "Question",
      "name": "What AI model do you use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We use multiple advanced AI models, including DeepSeek and other state-of-the-art systems. The result? Faster, funnier, and more accurate roasts."
      }
    },
    {
      "@type": "Question",
      "name": "Is my resume data safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. We don't store your resume text long-term. PDFs are processed server-side and text is only kept for generating your roast. We never sell or share your data."
      }
    },
    {
      "@type": "Question",
      "name": "Can I share my roast?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Every roast generates a shareable card with your score and funniest burn. Share it on Twitter, LinkedIn, or wherever you want to publicly humiliate yourself."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Structured Data Script Injections for rich search snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <PostHogProvider>
            <RevenueCatProvider>
              {children}
            </RevenueCatProvider>
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
