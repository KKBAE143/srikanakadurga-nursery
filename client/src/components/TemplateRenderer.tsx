import { Link } from "wouter";
import { Play, ShoppingCart, Star, ArrowRight } from "lucide-react";
import { products as allProducts, type Product } from "@/lib/data";

// Template structure from admin
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

interface TemplateRendererProps {
  template: BlogTemplate;
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
        <div className="relative h-32 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <h4 className="font-semibold text-sm text-[#1A1A1A] truncate group-hover:text-[#2F4836]">
            {product.name}
          </h4>
          <div className="flex items-center gap-1 my-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="font-bold text-[#2F4836] text-sm">₹{product.price}</span>
        </div>
      </div>
    </Link>
  );
}

function renderContent(content: string, type: "paragraph" | "numbered" | "bullets") {
  if (!content.trim()) return null;

  const lines = content.split("\n").filter((l) => l.trim());

  if (type === "paragraph") {
    return (
      <div className="space-y-4">
        {lines.map((line, i) => (
          <p key={i} className="text-[#4A4A4A] text-base sm:text-lg leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    );
  }

  if (type === "numbered") {
    return (
      <div className="space-y-3">
        {lines.map((line, i) => {
          // Check if line already starts with a number
          const hasNumber = /^\d+\.?\s/.test(line);
          const cleanLine = hasNumber ? line.replace(/^\d+\.?\s*/, "") : line;

          // Try to parse "Title - Description" format
          const match = cleanLine.match(/^(.+?)\s*[-–—]\s*(.+)$/);

          return (
            <div key={i} className="flex gap-4 p-4 bg-[#f0f4ef] rounded-lg border-l-4 border-[#2F4836]">
              <span className="text-[#2F4836] font-heading font-bold text-lg flex-shrink-0">
                {i + 1}.
              </span>
              <p className="text-[#4A4A4A] leading-relaxed">
                {match ? (
                  <>
                    <span className="font-semibold text-[#1A1A1A]">{match[1]}</span>
                    {" — "}
                    {match[2]}
                  </>
                ) : (
                  cleanLine
                )}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === "bullets") {
    return (
      <div className="space-y-2">
        {lines.map((line, i) => {
          const cleanLine = line.replace(/^[-•]\s*/, "");
          const match = cleanLine.match(/^(.+?)\s*[-–—]\s*(.+)$/);

          return (
            <div key={i} className="flex gap-4 ml-2">
              <span className="w-2 h-2 rounded-full bg-[#2F4836] mt-2.5 flex-shrink-0" />
              <p className="text-[#4A4A4A] leading-relaxed">
                {match ? (
                  <>
                    <span className="font-semibold text-[#1A1A1A]">{match[1]}</span>
                    {" — "}
                    {match[2]}
                  </>
                ) : (
                  cleanLine
                )}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export default function TemplateRenderer({ template }: TemplateRendererProps) {
  const videoId = template.videoUrl ? getYouTubeId(template.videoUrl) : null;

  const featuredProducts = template.featuredProductIds
    ?.map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined) || [];

  return (
    <div className="space-y-10">
      {/* Introduction */}
      {template.introduction && (
        <p className="text-[#4A4A4A] text-base sm:text-lg leading-relaxed">
          {template.introduction}
        </p>
      )}

      {/* Section 1 */}
      {(template.section1Title || template.section1Content) && (
        <div>
          {template.section1Title && (
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-6 tracking-wide">
              {template.section1Title}
            </h2>
          )}
          {renderContent(template.section1Content, template.section1Type)}
        </div>
      )}

      {/* Image Gallery */}
      {template.galleryImages && template.galleryImages.length > 0 && (
        <div className={`grid gap-4 ${
          template.galleryImages.length === 1 ? "grid-cols-1" :
          template.galleryImages.length === 2 ? "grid-cols-2" :
          "grid-cols-2 sm:grid-cols-3"
        }`}>
          {template.galleryImages.filter(img => img.url).map((img, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden aspect-square shadow-lg">
              <img
                src={img.url}
                alt={img.alt || ""}
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Section 2 */}
      {(template.section2Title || template.section2Content) && (
        <div>
          {template.section2Title && (
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-6 tracking-wide">
              {template.section2Title}
            </h2>
          )}
          {renderContent(template.section2Content, template.section2Type)}
        </div>
      )}

      {/* Video */}
      {template.videoUrl && (
        <div className="my-10">
          {videoId ? (
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={template.videoTitle || "YouTube video"}
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
                {template.videoTitle || "Video Coming Soon"}
              </h3>
            </div>
          )}
          {template.videoTitle && videoId && (
            <p className="text-center text-sm text-[#8F9E8B] mt-3 flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              {template.videoTitle}
            </p>
          )}
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="bg-gradient-to-r from-[#f0f4ef] to-[#e8ede7] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-[#2F4836]" />
            <h3 className="font-heading font-semibold text-[#1A1A1A]">Shop These Plants</h3>
          </div>
          <div className={`grid gap-4 ${
            featuredProducts.length <= 2 ? "grid-cols-2" :
            featuredProducts.length === 3 ? "grid-cols-2 sm:grid-cols-3" :
            "grid-cols-2 sm:grid-cols-4"
          }`}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Section 3 */}
      {(template.section3Title || template.section3Content) && (
        <div>
          {template.section3Title && (
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-6 tracking-wide">
              {template.section3Title}
            </h2>
          )}
          {renderContent(template.section3Content, template.section3Type)}
        </div>
      )}

      {/* Key Points */}
      {template.keyPoints && template.keyPoints.filter(p => p.trim()).length > 0 && (
        <div>
          {template.keyPointsTitle && (
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-6 tracking-wide">
              {template.keyPointsTitle}
            </h2>
          )}
          <div className="space-y-2">
            {template.keyPoints.filter(p => p.trim()).map((point, i) => (
              <div key={i} className="flex gap-4 ml-2">
                <span className="w-2 h-2 rounded-full bg-[#2F4836] mt-2.5 flex-shrink-0" />
                <p className="text-[#4A4A4A] leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conclusion */}
      {template.conclusion && (
        <p className="text-[#4A4A4A] text-base sm:text-lg leading-relaxed">
          {template.conclusion}
        </p>
      )}
    </div>
  );
}
