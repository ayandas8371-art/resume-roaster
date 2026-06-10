import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { SampleRoast } from "@/components/marketing/sample-roast";
import { Pricing } from "@/components/marketing/pricing";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQ } from "@/components/marketing/faq";

export default function MarketingPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen selection:bg-purple-500/30 overflow-x-hidden">
      <div className="relative overflow-hidden">
        {/* Background Glow Elements for Seamless Blending */}
        <div className="absolute top-[10%] left-[-10%] -z-10 h-[600px] w-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] -z-10 h-[700px] w-[700px] bg-orange-600/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute top-[50%] left-[20%] -z-10 h-[600px] w-[600px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-[70%] right-[10%] -z-10 h-[600px] w-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

        <Hero />
        <div className="relative z-10">
          <SampleRoast />
          <HowItWorks />
          <Pricing />
          <Testimonials />
          <FAQ />
        </div>
      </div>
    </main>
  );
}
