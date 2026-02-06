import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, User, Clock, Facebook, Twitter, Linkedin, ArrowRight, Leaf, BookOpen, TrendingUp, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import TemplateRenderer from "@/components/TemplateRenderer";
import { getBlogPostById, blogPosts, products, Product, fetchBlogPosts, type BlogPost } from "@/lib/data";
import { getImageUrl } from "@/lib/images";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ContentBlock } from "@/admin/components/blocks/types";
import { Star, ShoppingCart } from "lucide-react";

interface BlogTemplate {
  introduction: string;
  section1Title: string;
  section1Content: string;
  section1Type: "paragraph" | "numbered" | "bullets";
  galleryImages: Array<{ url: string; alt: string }>;
  section2Title: string;
  section2Content: string;
  section2Type: "paragraph" | "numbered" | "bullets";
  videoUrl: string;
  videoTitle: string;
  section3Title: string;
  section3Content: string;
  section3Type: "paragraph" | "numbered" | "bullets";
  keyPointsTitle: string;
  keyPoints: string[];
  featuredProductIds: string[];
  conclusion: string;
}

interface FirestoreBlogPost {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  featuredImage?: string;
  content?: string;
  blocks?: ContentBlock[];
  template?: BlogTemplate;
  author?: string;
  date?: string;
  status?: string;
}

function estimateReadTime(content: string | ContentBlock[]): number {
  if (Array.isArray(content)) {
    // Estimate from blocks
    let words = 0;
    content.forEach((block) => {
      if (block.type === "text") {
        words += block.content.split(/\s+/).length;
      } else if (block.type === "heading") {
        words += block.text.split(/\s+/).length;
      } else if (block.type === "quote") {
        words += block.text.split(/\s+/).length;
      } else if (block.type === "keypoints") {
        block.points.forEach((p) => {
          words += p.title.split(/\s+/).length;
          if (p.description) words += p.description.split(/\s+/).length;
        });
      }
    });
    return Math.max(1, Math.ceil(words / 200));
  }
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Legacy embedded media content for old blogs
const blogMedia: Record<string, { images: string[]; videos: string[]; relatedProducts: string[] }> = {
  "indoor-plants-guide": {
    images: ["/images/plant-snake-plant.webp", "/images/plant-areca-palm.webp", "/images/plant-peace-lily.webp"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    relatedProducts: ["snake-plant", "areca-palm", "money-plant", "peace-lily", "spider-plant"],
  },
  "rare-plants": {
    images: ["/images/plant-zz-plant.webp", "/images/plant-jade.webp"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    relatedProducts: ["zz-plant", "jade-plant", "rubber-plant"],
  },
  "plant-styling": {
    images: ["/images/plant-rubber-plant.webp", "/images/plant-money-plant.webp"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    relatedProducts: ["rubber-plant", "areca-palm", "money-plant", "snake-plant"],
  },
  "plants-wellbeing": {
    images: ["/images/plant-tulsi.webp", "/images/plant-aloe-vera.webp"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    relatedProducts: ["tulsi", "aloe-vera", "snake-plant", "peace-lily", "spider-plant"],
  },
};

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group cursor-pointer border border-[#e5ebe3]">
        <div className="relative h-36 overflow-hidden">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.originalPrice && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              Sale
            </span>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-sm text-[#1A1A1A] truncate group-hover:text-[#2F4836]">
            {product.name}
          </h4>
          <div className="flex items-center gap-1 my-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2F4836]">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SidebarProductSlider({ productIds }: { productIds: string[] }) {
  const sidebarProducts = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-5">
      {sidebarProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function renderLegacyContent(content: string, postId: string) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  const media = blogMedia[postId] || { images: [], videos: [], relatedProducts: [] };

  let sectionCount = 0;
  let paragraphCount = 0;

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("- ") && !trimmed.includes(". ")) {
      sectionCount++;

      elements.push(
        <h2 key={i} className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-12 mb-6 tracking-wide">
          {trimmed.replace(/\*\*/g, "")}
        </h2>
      );

      if (sectionCount === 2 && media.images.length > 0) {
        elements.push(
          <div key={`gallery-${i}`} className="my-10 grid grid-cols-2 gap-4">
            {media.images.slice(0, 2).map((img, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden aspect-square shadow-lg">
                <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        );
      }
    } else if (trimmed.match(/^\d+\.\s\*\*/)) {
      const text = trimmed.replace(/\*\*/g, "");
      const match = text.match(/^(\d+\.)\s(.+?)(?:\s-\s)(.+)$/);
      if (match) {
        elements.push(
          <div key={i} className="flex gap-4 mb-4 p-4 bg-[#f0f4ef] rounded-lg border-l-4 border-[#2F4836]">
            <span className="text-[#2F4836] font-heading font-bold text-lg flex-shrink-0">{match[1]}</span>
            <p className="text-[#4A4A4A] leading-relaxed">
              <span className="font-semibold text-[#1A1A1A]">{match[2]}</span> — {match[3]}
            </p>
          </div>
        );
      } else {
        elements.push(
          <p key={i} className="text-[#4A4A4A] leading-relaxed mb-4 ml-1">{text}</p>
        );
      }
    } else if (trimmed.startsWith("- **")) {
      const text = trimmed.replace(/^-\s/, "").replace(/\*\*/g, "");
      const match = text.match(/^(.+?)(?:\s-\s)(.+)$/);
      if (match) {
        elements.push(
          <div key={i} className="flex gap-4 mb-3 ml-2">
            <span className="w-2 h-2 rounded-full bg-[#2F4836] mt-2.5 flex-shrink-0" />
            <p className="text-[#4A4A4A] leading-relaxed">
              <span className="font-semibold text-[#1A1A1A]">{match[1]}</span> — {match[2]}
            </p>
          </div>
        );
      } else {
        elements.push(
          <div key={i} className="flex gap-4 mb-3 ml-2">
            <span className="w-2 h-2 rounded-full bg-[#2F4836] mt-2.5 flex-shrink-0" />
            <p className="text-[#4A4A4A] leading-relaxed">{text}</p>
          </div>
        );
      }
    } else if (trimmed.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex gap-4 mb-3 ml-2">
          <span className="w-2 h-2 rounded-full bg-[#2F4836] mt-2.5 flex-shrink-0" />
          <p className="text-[#4A4A4A] leading-relaxed">{trimmed.replace(/^-\s/, "")}</p>
        </div>
      );
    } else {
      paragraphCount++;
      const parsed = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#1A1A1A] font-semibold">$1</strong>');

      if (paragraphCount === 3) {
        elements.push(
          <blockquote
            key={i}
            className="my-8 pl-6 border-l-4 border-[#2F4836] italic text-xl text-[#4A4A4A] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parsed }}
          />
        );
      } else {
        elements.push(
          <p
            key={i}
            className="text-[#4A4A4A] text-base sm:text-lg leading-relaxed mb-5"
            dangerouslySetInnerHTML={{ __html: parsed }}
          />
        );
      }
    }
  });

  return elements;
}

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:id");
  const [post, setPost] = useState<FirestoreBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<BlogPost[]>(blogPosts);

  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.id) {
        setLoading(false);
        return;
      }

      try {
        // First try Firestore
        const docRef = doc(db, "blogPosts", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({
            id: docSnap.id,
            ...docSnap.data(),
          } as FirestoreBlogPost);
        } else {
          // Fall back to static data
          const staticPost = getBlogPostById(params.id);
          if (staticPost) {
            setPost({
              id: staticPost.id,
              title: staticPost.title,
              excerpt: staticPost.excerpt,
              image: staticPost.image,
              content: staticPost.content,
              author: staticPost.author,
              date: staticPost.date,
            });
          }
        }

        // Fetch all posts for related articles
        const posts = await fetchBlogPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        // Fall back to static data
        const staticPost = getBlogPostById(params.id);
        if (staticPost) {
          setPost({
            id: staticPost.id,
            title: staticPost.title,
            excerpt: staticPost.excerpt,
            image: staticPost.image,
            content: staticPost.content,
            author: staticPost.author,
            date: staticPost.date,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params?.id]);

  const otherPosts = post ? allPosts.filter((p) => p.id !== post.id).slice(0, 3) : [];
  const readTime = post
    ? estimateReadTime(post.blocks && post.blocks.length > 0 ? post.blocks : post.content || "")
    : 0;
  const media = post ? blogMedia[post.id] || { images: [], videos: [], relatedProducts: [] } : { images: [], videos: [], relatedProducts: [] };
  const featuredImage = post?.featuredImage || post?.image || "";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";

  const sidebarProducts = media.relatedProducts
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // Determine if this is a block-based post
  const hasBlocks = post?.blocks && post.blocks.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-[#2F4836] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8faf7]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-[#EAEFE9] rounded-full flex items-center justify-center">
            <ArrowLeft className="w-12 h-12 text-[#8F9E8B]" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-4" data-testid="text-blog-not-found">
            Blog Post Not Found
          </h1>
          <p className="text-[#4A4A4A] mb-8">The article you're looking for doesn't exist or has been moved.</p>
          <Link href="/blog">
            <button
              className="bg-[#2F4836] text-white px-8 py-3 rounded-full font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors"
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
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      {/* Hero Image */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] max-h-[600px] overflow-hidden">
        <img
          src={getImageUrl(featuredImage)}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          data-testid="img-blog-detail-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

        <div className="absolute top-6 left-6 sm:left-10 z-20">
          <Link href="/blog">
            <span
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#2F4836] px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors cursor-pointer shadow-lg"
              data-testid="link-back-to-blog"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16 z-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#2F4836] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Plant Guide
              </span>
              <span className="text-white/80 text-sm">{readTime} min read</span>
            </div>
            <h1
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide leading-tight drop-shadow-lg"
              data-testid="text-blog-detail-title"
            >
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs text-[#8F9E8B] uppercase tracking-wider mb-3 font-semibold">Share</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#EAEFE9] flex items-center justify-center text-[#4A4A4A] hover:bg-[#2F4836] hover:text-white transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#EAEFE9] flex items-center justify-center text-[#4A4A4A] hover:bg-[#2F4836] hover:text-white transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#EAEFE9] flex items-center justify-center text-[#4A4A4A] hover:bg-[#2F4836] hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-[#4A4A4A] mb-3">
                  <Clock className="w-4 h-4 text-[#2F4836]" />
                  <span>{readTime} min read</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                  <BookOpen className="w-4 h-4 text-[#2F4836]" />
                  <span>Beginner friendly</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-7">
            {/* Author bar */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-[#e5ebe3] mb-8">
              {post.author && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2F4836] to-[#4a6b52] flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#1A1A1A] block" data-testid="text-blog-detail-author">
                      {post.author}
                    </span>
                    <span className="text-xs text-[#8F9E8B]">Plant Expert</span>
                  </div>
                </div>
              )}
              {post.date && (
                <div className="flex items-center gap-2 text-[#4A4A4A]">
                  <Calendar className="w-4 h-4 text-[#8F9E8B]" />
                  <span className="text-sm" data-testid="text-blog-detail-date">
                    {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            {/* Article body */}
            <article className="prose-custom" data-testid="blog-detail-content">
              {post.excerpt && (
                <p className="text-xl sm:text-2xl text-[#4A4A4A] leading-relaxed mb-10 font-light border-l-4 border-[#2F4836] pl-6 bg-[#f0f4ef] py-4 rounded-r-lg">
                  {post.excerpt}
                </p>
              )}

              {/* Render template, blocks, or legacy content */}
              {post.template ? (
                <TemplateRenderer template={post.template} />
              ) : hasBlocks ? (
                <BlockRenderer blocks={post.blocks!} />
              ) : post.content ? (
                renderLegacyContent(post.content, post.id)
              ) : null}
            </article>

            {/* Tags/CTA section */}
            <div className="mt-12 pt-8 border-t border-[#e5ebe3]">
              <div className="bg-gradient-to-r from-[#2F4836] to-[#3a5a44] rounded-2xl p-8 sm:p-10 text-center">
                <Leaf className="w-12 h-12 text-white/80 mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-white mb-3">
                  Ready to Start Your Green Journey?
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Visit our nursery in Ramanthapur, Hyderabad or shop online for premium plants delivered to your doorstep.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/shop">
                    <button className="bg-white text-[#2F4836] px-8 py-3 rounded-full font-semibold hover:bg-[#f0f4ef] transition-colors inline-flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Shop Plants
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                      Visit Nursery
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {sidebarProducts.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#2F4836]" />
                    <h3 className="font-heading font-semibold text-[#1A1A1A]">Featured Plants</h3>
                  </div>
                  <SidebarProductSlider productIds={media.relatedProducts} />
                  <Link href="/shop">
                    <button className="w-full mt-4 bg-[#2F4836] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3a5a44] transition-colors flex items-center justify-center gap-2">
                      View All Plants
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              )}

              <div className="bg-gradient-to-br from-[#2F4836] to-[#4a6b52] rounded-xl p-5 text-white">
                <h3 className="font-heading font-semibold mb-2">Get Gardening Tips</h3>
                <p className="text-sm text-white/80 mb-4">Weekly plant care advice delivered to your inbox.</p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-[#1A1A1A] placeholder:text-gray-400 mb-3"
                />
                <button className="w-full bg-white text-[#2F4836] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#f0f4ef] transition-colors">
                  Subscribe
                </button>
              </div>

              {otherPosts.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-heading font-semibold text-[#1A1A1A] mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {otherPosts.slice(0, 2).map((p) => (
                      <Link key={p.id} href={`/blog/${p.id}`}>
                        <div className="flex gap-3 group cursor-pointer">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[#1A1A1A] line-clamp-2 group-hover:text-[#2F4836] transition-colors">
                              {p.title}
                            </h4>
                            <p className="text-xs text-[#8F9E8B] mt-1">{readTime} min read</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Full-width Related Articles Section */}
      {otherPosts.length > 0 && (
        <div className="bg-white border-t border-[#e5ebe3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A]" data-testid="text-more-articles">
                Continue Reading
              </h2>
              <Link href="/blog">
                <span className="text-[#2F4836] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1">
                  All Articles
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.id}`}>
                  <article
                    className="bg-[#f8faf7] rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                    data-testid={`card-blog-related-${p.id}`}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6">
                      {p.author && p.date && (
                        <div className="flex items-center gap-3 text-xs text-[#8F9E8B] mb-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {p.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(p.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      )}
                      <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] tracking-wide group-hover:text-[#2F4836] transition-colors line-clamp-2 mb-3">
                        {p.title}
                      </h3>
                      <p className="text-sm text-[#4A4A4A] line-clamp-2">{p.excerpt}</p>
                    </div>
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
