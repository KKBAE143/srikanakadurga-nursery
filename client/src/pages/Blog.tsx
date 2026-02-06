import { useState, useEffect } from "react";
import { getBlogPosts, type BlogPost } from "@/lib/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then((p) => { setPosts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <PageHero
        image="/images/blog-hero.webp"
        title="Glorify the Nature around You"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-6 animate-pulse">
                <div className="w-full sm:w-64 h-48 bg-gray-200 rounded-sm flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col sm:flex-row gap-6 group"
                data-testid={`article-blog-${post.id}`}
              >
                <div className="w-full sm:w-64 h-48 flex-shrink-0 rounded-sm overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    data-testid={`img-blog-${post.id}`}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  {post.author && post.date && (
                    <p className="text-xs text-[#8F9E8B] mb-2 font-heading">
                      By {post.author} &middot; {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                  <h2
                    className="font-heading text-xl font-semibold text-[#1A1A1A] mb-3 tracking-wide"
                    data-testid={`text-blog-title-${post.id}`}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button
                    className="text-[#2F4836] text-xs font-heading font-semibold tracking-wider uppercase underline underline-offset-4 hover:text-[#3a5a44] transition-colors w-fit"
                    data-testid={`button-continue-reading-${post.id}`}
                  >
                    Continue Reading
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
