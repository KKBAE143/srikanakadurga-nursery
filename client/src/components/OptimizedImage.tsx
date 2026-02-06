import { useState, useRef, useEffect, memo } from "react";
import { getImageUrl, getPlaceholderUrl, generateSrcSet } from "@/lib/images";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
  aspectRatio?: string;
  // Enable blur placeholder
  blur?: boolean;
  // Disable srcset for fixed-size images
  responsive?: boolean;
  // Custom widths for srcset
  srcSetWidths?: number[];
  "data-testid"?: string;
  onClick?: () => void;
}

function OptimizedImageComponent({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  objectFit = "cover",
  aspectRatio,
  blur = true,
  responsive = true,
  srcSetWidths,
  "data-testid": testId,
  onClick,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert local path to ImageKit URL
  const imageUrl = getImageUrl(src);

  // Generate placeholder URL for blur effect
  const placeholderUrl = blur ? getPlaceholderUrl(src.replace("/images/", "")) : undefined;

  // Generate srcset for responsive images
  const srcSet = responsive ? generateSrcSet(src.replace("/images/", ""), srcSetWidths) : undefined;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Preload priority images
  useEffect(() => {
    if (priority && typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = imageUrl;
      if (srcSet) {
        link.setAttribute("imagesrcset", srcSet);
        link.setAttribute("imagesizes", sizes);
      }
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, imageUrl, srcSet, sizes]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const containerStyle: React.CSSProperties = {
    aspectRatio: aspectRatio,
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  }[objectFit];

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
      onClick={onClick}
      data-testid={testId}
    >
      {/* Blur placeholder background */}
      {blur && placeholderUrl && !isLoaded && (
        <div
          className="absolute inset-0 scale-110 blur-lg"
          style={{
            backgroundImage: `url(${placeholderUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !blur && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#e5ebe3] to-[#dde3dc] animate-pulse" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-[#EAEFE9] flex items-center justify-center">
          <div className="text-center text-[#8F9E8B]">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          src={imageUrl}
          srcSet={srcSet}
          sizes={responsive ? sizes : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full ${objectFitClass} transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
const OptimizedImage = memo(OptimizedImageComponent);
export default OptimizedImage;

// Named export for specific use cases
export { OptimizedImage };
