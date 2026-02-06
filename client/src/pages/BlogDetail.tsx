import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogPostById, blogPosts } from "@/lib/data";

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("- ") && !trimmed.includes(". ")) {
      elements.push(
        <h2
          key={i}
          className="font-heading text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-10 mb-4 tracking-wide"
        >
          {trimmed.replace(/\*\*/g, "")}
        </h2>
      );
    } else if (trimmed.match(/^\d+\.\s\*\*/)) {
      const text = trimmed.replace(/\*\*/g, "");
      const match = text.match(/^(\d+\.)\s(.+?)(?:\s-\s)(.+)$/);
      if (match) {
        elements.push(
          <div key={i} className="flex gap-3 mb-3 ml-1">
            <span className="text-[#2F4836] font-heading font-bold text-sm mt-0.5 flex-shrink-0">{match[1]}</span>
            <p className="text-[#4A4A4A] text-sm leading-relaxed">
              <span className="font-semibold text-[#1A1A1A]">{match[2]}</span> - {match[3]}
            </p>
          </div>
        );
      } else {
        elements.push(
          <p key={i} className="text-[#4A4A4A] text-sm leading-relaxed mb-3 ml-1">{text}</p>
        );
      }
    } else if (trimmed.startsWith("- **")) {
      const text = trimmed.replace(/^-\s/, "").replace(/\*\*/g, "");
      const match = text.match(/^(.+?)(?:\s-\s)(.+)$/);
      if (match) {
        elements.push(
          <div key={i} className="flex gap-3 mb-3 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F4836] mt-2 flex-shrink-0" />
            <p className="text-[#4A4A4A] text-sm leading-relaxed">
              <span className="font-semibold text-[#1A1A1A]">{match[1]}</span> - {match[2]}
            </p>
          </div>
        );
      } else {
        elements.push(
          <div key={i} className="flex gap-3 mb-3 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F4836] mt-2 flex-shrink-0" />
            <p className="text-[#4A4A4A] text-sm leading-relaxed">{text}</p>
          </div>
        );
      }
    } else if (trimmed.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex gap-3 mb-3 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F4836] mt-2 flex-shrink-0" />
          <p className="text-[#4A4A4A] text-sm leading-relaxed">{trimmed.replace(/^-\s/, "")}</p>
        </div>
      );
    } else if (trimmed.match(/^\*\*.+?\*\*:/)) {
      const heading = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)/);
      if (heading) {
        elements.push(
          <p key={i} className="text-[#4A4A4A] text-sm leading-relaxed mb-3">
            <span className="font-semibold text-[#1A1A1A]">{heading[1]}:</span> {heading[2]}
          </p>
        );
      }
    } else {
      const parsed = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#1A1A1A]">$1</strong>');
      elements.push(
        <p
          key={i}
          className="text-[#4A4A4A] text-sm sm:text-base leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: parsed }}
        />
      );
    }
  });

  return elements;
}

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:id");
  const post = params?.id ? getBlogPostById(params.id) : undefined;

  const otherPosts = post
    ? blogPosts.filter((p) => p.id !== post.id).slice(0, 3)
    : [];

  if (!post) {
    return (
      <div className="min-h-screen bg-[#EAEFE9]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="font-heading text-xl text-[#1A1A1A]" data-testid="text-blog-not-found">Blog post not found</p>
          <Link href="/blog">
            <button
              className="mt-4 bg-[#2F4836] text-white px-6 py-2 font-heading text-sm tracking-wider uppercase"
              data-testid="button-back-to-blog"
            >
              Back to Blog
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <div className="w-full overflow-hidden" style={{ maxHeight: "480px" }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[480px] object-cover"
          loading="eager"
          data-testid="img-blog-detail-hero"
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
        <Link href="/blog">
          <span
            className="inline-flex items-center gap-2 text-[#8F9E8B] text-xs font-heading uppercase tracking-wider hover:text-[#2F4836] transition-colors cursor-pointer mb-8 group"
            data-testid="link-back-to-blog"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </span>
        </Link>

        <h1
          className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-wide leading-tight mt-6 mb-6"
          data-testid="text-blog-detail-title"
        >
          {post.title}
        </h1>

        {post.author && post.date && (
          <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-[#dde3dc]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#8F9E8B]" />
              <span className="text-sm text-[#4A4A4A] font-heading" data-testid="text-blog-detail-author">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8F9E8B]" />
              <span className="text-sm text-[#4A4A4A]" data-testid="text-blog-detail-date">
                {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        )}

        <article className="mb-16" data-testid="blog-detail-content">
          {renderContent(post.content)}
        </article>
      </div>

      {otherPosts.length > 0 && (
        <div className="border-t border-[#dde3dc]">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16">
            <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] uppercase tracking-[0.12em] mb-10" data-testid="text-more-articles">
              More Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.id}`}>
                  <article className="group cursor-pointer" data-testid={`card-blog-related-${p.id}`}>
                    <div className="overflow-hidden rounded-sm mb-4" style={{ height: "220px" }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    {p.author && p.date && (
                      <p className="text-xs text-[#8F9E8B] mb-2 font-heading">
                        By {p.author} &middot; {new Date(p.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    )}
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] tracking-wide group-hover:text-[#2F4836] transition-colors">
                      {p.title}
                    </h3>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
