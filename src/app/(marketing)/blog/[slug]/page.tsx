import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

// Generate static params for all blog posts so they are lightning fast
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Dynamic SEO Metadata for each article
export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Hired or Roasted Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // JSON-LD Schema specifically for Google Search and AdSense optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": "https://hiredorroasted.online/og.png",
    "datePublished": `${post.date}T08:00:00Z`,
    "author": [{
        "@type": "Organization",
        "name": post.author,
        "url": "https://hiredorroasted.online"
    }]
  };

  return (
    <article className="relative min-h-screen bg-[#0a0508] py-24 sm:py-32 overflow-hidden">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-4xl bg-purple-900/10 blur-[120px] rounded-full" />
      
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to all roasts
        </Link>
        
        <header className="mb-16">
          <div className="flex items-center gap-6 text-sm text-purple-400 font-mono mb-8 border-b border-white/10 pb-6">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {post.date}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {post.readTime}</span>
            <span className="flex items-center gap-2 text-gray-500">By {post.author}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-8">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed font-light">
            {post.excerpt}
          </p>
        </header>

        {/* Prose Content */}
        {/* We use a custom prose configuration to make the HTML content look incredible and readable */}
        <div 
          className="prose prose-invert prose-lg max-w-none
                     prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
                     prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
                     prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                     prose-strong:text-white prose-strong:font-bold
                     prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
                     prose-li:text-gray-300 prose-ul:mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Footer Author Block */}
        <footer className="mt-20 pt-10 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-600 to-red-600 flex items-center justify-center text-white font-black text-xl">
              HR
            </div>
            <div>
              <p className="text-white font-bold">{post.author}</p>
              <p className="text-sm text-gray-500">Building the savage standard for hiring.</p>
            </div>
          </div>
          
          <Link href="/" className="hidden sm:inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-black hover:bg-gray-200 transition-colors">
            Roast My Resume
          </Link>
        </footer>
      </div>
    </article>
  );
}
