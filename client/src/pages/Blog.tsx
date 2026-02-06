import { useState, useEffect } from "react";
import { Link } from "wouter";
import { blogPosts as staticBlogs, fetchBlogPosts, type BlogPost } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getImageUrl } from "@/lib/images";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";

export default function Blog() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(staticBlogs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await fetchBlogPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Feature the first post
  const featuredPost = allPosts[0];
  const otherPosts = allPosts.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7]">
        <Header />
        <PageHero
          image="/images/blog-hero.webp"
          title="Glorify the Nature around You"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#2F4836] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      <PageHero
        image="/images/blog-hero.webp"
        title="Glorify the Nature around You"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.id}`}>
            <article
              className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 mb-16 group"
              data-testid={`article-blog-${featuredPost.id}`}
            >
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={getImageUrl(featuredPost.image)}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                    data-testid={`img-blog-${featuredPost.id}`}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#2F4836] text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-[#8F9E8B] mb-4">
                    {featuredPost.author && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </span>
                    )}
                    {featuredPost.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h2
                    className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4 group-hover:text-[#2F4836] transition-colors"
                    data-testid={`text-blog-title-${featuredPost.id}`}
                  >
                    {featuredPost.title}
                  </h2>
                  <p className="text-[#4A4A4A] leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-[#2F4836] font-semibold group-hover:gap-3 transition-all"
                    data-testid={`link-continue-reading-${featuredPost.id}`}
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Section Header */}
        <div className="flex items-center gap-4 mb-10">
          <h3 className="font-heading text-xl font-semibold text-[#1A1A1A]">
            Latest Articles
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-[#2F4836]/20 to-transparent" />
        </div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <article
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
                data-testid={`article-blog-${post.id}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    data-testid={`img-blog-${post.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-[#8F9E8B] mb-3">
                    {post.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                    )}
                    {post.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h2
                    className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#2F4836] transition-colors line-clamp-2"
                    data-testid={`text-blog-title-${post.id}`}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[#2F4836] text-sm font-semibold group-hover:gap-2.5 transition-all"
                    data-testid={`link-continue-reading-${post.id}`}
                  >
                    Continue Reading
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {allPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#EAEFE9] rounded-full flex items-center justify-center">
              <Calendar className="w-10 h-10 text-[#8F9E8B]" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-2">
              No Articles Yet
            </h3>
            <p className="text-[#4A4A4A]">
              Check back soon for gardening tips and plant care guides!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
