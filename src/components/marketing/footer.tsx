import Link from "next/link";
import { Globe, Share2, Info, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#1a0b12] pt-20 pb-12 overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[300px] w-full bg-gradient-to-b from-purple-900/20 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-black shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-110">
                <img 
                  src="/brand/logo.png" 
                  alt="Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Roast<span className="text-purple-500">My</span>Resume</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Transforming career terrorism into professional excellence. Powered by advanced AI to help you land your dream role.
            </p>
            <div className="flex gap-5 text-gray-500">
              <Link href="#" className="hover:text-purple-400 transition-colors p-2 rounded-lg bg-white/5"><Globe className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-purple-400 transition-colors p-2 rounded-lg bg-white/5"><Share2 className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-purple-400 transition-colors p-2 rounded-lg bg-white/5"><Info className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Product</h4>
            <ul className="mt-8 space-y-4 text-sm text-gray-400">
              <li><Link href="#how-it-works" className="hover:text-white transition-colors flex items-center gap-2">How it Works <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" /></Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">Support & FAQ</Link></li>
              <li><Link href="/dashboard" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Member Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Legal</h4>
            <ul className="mt-8 space-y-4 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Shield</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Service Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security Audit</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link></li>
            </ul>
          </div>

          <div className="relative rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
            <h4 className="text-sm font-bold text-white tracking-tight">Stay Competitive</h4>
            <p className="mt-3 text-xs text-gray-400 leading-relaxed">Join 5,000+ candidates getting weekly roast tips and career advice.</p>
            <form className="mt-6 flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all" 
              />
              <button className="w-full rounded-2xl bg-white py-3 text-sm font-bold text-black hover:bg-gray-200 active:scale-[0.98] transition-all shadow-xl shadow-white/10">
                Join Newsletter
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-10 text-[10px] uppercase tracking-widest text-gray-600">
          <p>© {new Date().getFullYear()} Roast My Resume. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-8">
            <span>Built with AI</span>
            <span>Secure PDF Encryption</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
