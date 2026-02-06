import { Link } from "wouter";
import { Play, ShoppingCart, Star, ArrowRight, Check } from "lucide-react";
import { products as allProducts, type Product } from "@/lib/data";
import type { ContentBlock } from "@/admin/components/blocks/types";

interface BlockRendererProps {
  blocks: ContentBlock[];
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group cursor-pointer border border-[#e5ebe3]">
        <div className="relative h-36 overflow-hidden">
          <img
            src={product.image}
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

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return (
              <div
                key={block.id}
                className="prose prose-lg max-w-none prose-headings:text-[#1A1A1A] prose-p:text-[#4A4A4A] prose-p:leading-relaxed prose-a:text-[#2F4836] prose-strong:text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            );

          case "heading":
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            const headingClass = block.level === 1
              ? "font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-wide"
              : block.level === 2
              ? "font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-wide"
              : "font-heading text-xl sm:text-2xl font-semibold text-[#1A1A1A]";
            return (
              <HeadingTag key={block.id} className={headingClass}>
                {block.text}
              </HeadingTag>
            );

          case "image":
            return (
              <figure key={block.id} className="my-10">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={block.url}
                    alt={block.alt}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-sm text-[#8F9E8B] mt-3">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "gallery":
            return (
              <div
                key={block.id}
                className={`grid gap-4 my-10 ${
                  block.columns === 2
                    ? "grid-cols-2"
                    : block.columns === 3
                    ? "grid-cols-2 sm:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
                }`}
              >
                {block.images.map((image, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-square shadow-lg">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            );

          case "video":
            const videoId = getYouTubeId(block.url);
            return (
              <div key={block.id} className="my-10">
                {videoId ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={block.title || "YouTube video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#2F4836] to-[#4a6b52] flex flex-col items-center justify-center text-white">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-2">
                      {block.title || "Video Coming Soon"}
                    </h3>
                  </div>
                )}
                {block.title && videoId && (
                  <p className="text-center text-sm text-[#8F9E8B] mt-3 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    {block.title}
                  </p>
                )}
              </div>
            );

          case "products":
            const productList = block.productIds
              .map((id) => allProducts.find((p) => p.id === id))
              .filter((p): p is Product => p !== undefined);

            if (productList.length === 0) return null;

            return (
              <div key={block.id} className="my-10 bg-gradient-to-r from-[#f0f4ef] to-[#e8ede7] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-[#2F4836]" />
                  <h3 className="font-heading font-semibold text-[#1A1A1A]">
                    {block.title || "Shop These Plants"}
                  </h3>
                </div>
                <div className={`grid gap-4 ${
                  productList.length <= 2
                    ? "grid-cols-2"
                    : productList.length === 3
                    ? "grid-cols-2 sm:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
                }`}>
                  {productList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );

          case "keypoints":
            return (
              <div key={block.id} className="my-10">
                {block.title && (
                  <h3 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-4">
                    {block.title}
                  </h3>
                )}
                <div className="space-y-3">
                  {block.points.map((point, idx) => (
                    <div
                      key={point.id}
                      className="flex gap-4 p-4 bg-[#f0f4ef] rounded-lg border-l-4 border-[#2F4836]"
                    >
                      <span className="text-[#2F4836] font-heading font-bold text-lg flex-shrink-0">
                        {idx + 1}.
                      </span>
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{point.title}</p>
                        {point.description && (
                          <p className="text-[#4A4A4A] text-sm mt-1">{point.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "quote":
            return (
              <blockquote
                key={block.id}
                className="my-10 pl-6 border-l-4 border-[#2F4836] italic text-xl text-[#4A4A4A] leading-relaxed bg-[#f8faf7] py-6 pr-6 rounded-r-lg"
              >
                <p>"{block.text}"</p>
                {block.author && (
                  <footer className="mt-3 text-sm font-medium text-[#2F4836] not-italic">
                    — {block.author}
                  </footer>
                )}
              </blockquote>
            );

          case "divider":
            return (
              <div key={block.id} className="my-10 flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#e5ebe3] to-transparent" />
              </div>
            );

          case "cta":
            return (
              <div
                key={block.id}
                className="my-10 bg-gradient-to-r from-[#2F4836] to-[#3a5a44] rounded-2xl p-8 sm:p-10 text-center"
              >
                <h3 className="font-heading text-2xl font-bold text-white mb-3">
                  {block.title}
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  {block.description}
                </p>
                <Link href={block.buttonLink}>
                  <button className="bg-white text-[#2F4836] px-8 py-3 rounded-full font-semibold hover:bg-[#f0f4ef] transition-colors inline-flex items-center gap-2">
                    {block.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
