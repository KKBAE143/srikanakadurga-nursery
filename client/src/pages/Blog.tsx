import { Link } from "wouter";
import { blogPosts } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <PageHero
        image="/images/blog-hero.webp"
        title="Glorify the Nature around You"
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="space-y-12">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <article
                className="flex flex-col sm:flex-row gap-6 group cursor-pointer"
                data-testid={`article-blog-${post.id}`}
              >
                <div className="w-full sm:w-72 h-52 flex-shrink-0 rounded-sm overflow-hidden">
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
                    className="font-heading text-xl font-semibold text-[#1A1A1A] mb-3 tracking-wide group-hover:text-[#2F4836] transition-colors"
                    data-testid={`text-blog-title-${post.id}`}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span
                    className="text-[#2F4836] text-xs font-heading font-semibold tracking-wider uppercase underline underline-offset-4 hover:text-[#3a5a44] transition-colors w-fit"
                    data-testid={`link-continue-reading-${post.id}`}
                  >
                    Continue Reading
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
