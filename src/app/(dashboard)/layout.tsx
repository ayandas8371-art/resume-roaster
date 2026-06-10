import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileNav } from "@/components/mobile-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden selection:bg-orange-500/30">
      
      {/* ─── Global Background ─── */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-black overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/fun_roast_bg.png"
          alt=""
          className="h-full w-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[#080510]" style={{ opacity: 0.6 }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_20%,transparent_20%,#05020a_100%)]" />
        
        {/* Hyper-realistic Ambient Light Orbs */}
        <div className="absolute -top-40 -right-40 h-[800px] w-[800px] rounded-full bg-orange-600/20 blur-[150px]" />
        <div className="absolute bottom-0 -left-40 h-[700px] w-[700px] rounded-full bg-purple-700/25 blur-[150px]" />
        <div className="absolute top-[30%] left-[20%] h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[150px]" />
      </div>

      {/* ─── Desktop Sidebar (lg+) ─── */}
      <div className="relative z-10">
        <DashboardSidebar />
      </div>

      {/* ─── Mobile/Tablet content column ─── */}
      <div className="relative z-10 flex flex-1 flex-col min-w-0">
        {/* Mobile top bar + drawer (hidden on lg+) */}
        <MobileNav />

        {/* ─── Main content ─── */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
