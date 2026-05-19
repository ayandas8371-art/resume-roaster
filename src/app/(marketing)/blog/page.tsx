import Link from "next/link";
import { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Career & Resume Blog | Hired or Roasted",
  description: "Read the latest tips, tricks, and savage truths about writing a resume that actually gets you hired in 2026.",
};

export default function BlogIndexPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0508] py-24 sm:py-32">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-4xl bg-purple-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] bg-red-900/10 blur-[100px] rounded-full" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-500">Savage</span> Career Blog
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Stop submitting mid resumes. Learn the brutal truths about what recruiters actually want to see in 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group relative flex flex-col h-full rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:-translate-y-2 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]">
              <div className="flex items-center gap-4 text-xs text-purple-400 font-mono mb-6">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-purple-300 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-400 mb-8 flex-grow leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center text-sm font-bold text-white mt-auto pt-6 border-t border-white/10">
                Read Full Roast
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2 text-purple-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
