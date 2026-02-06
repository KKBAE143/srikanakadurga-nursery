import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHero
        image="/images/blog-hero.png"
        title="Glorify the Nature around You"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
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
            {posts?.map((post) => (
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
                    data-testid={`img-blog-${post.id}`}
                  />
                </div>
                <div className="flex flex-col justify-center">
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

        {!isLoading && posts && posts.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12" data-testid="pagination-blog">
            <button className="w-9 h-9 flex items-center justify-center text-sm border bg-[#2F4836] text-white border-[#2F4836]">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center text-sm border border-[#ddd] bg-white text-[#4A4A4A] hover:border-[#2F4836] transition-colors">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center text-sm border border-[#ddd] bg-white text-[#4A4A4A] hover:border-[#2F4836] transition-colors">
              &gt;
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
