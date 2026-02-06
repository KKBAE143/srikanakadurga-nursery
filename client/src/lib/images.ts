// ImageKit Image URLs
// All images are hosted on ImageKit for optimal performance
// URL Endpoint: https://ik.imagekit.io/vvkwy0zte

const IMAGEKIT_BASE = "https://ik.imagekit.io/vvkwy0zte";

// Image transformation presets
export const Transformations = {
  // Auto format, quality, and width optimizations
  thumbnail: "tr:w-150,h-150,fo-auto,q-80,f-auto",
  productCard: "tr:w-400,h-400,fo-auto,q-80,f-auto",
  productDetail: "tr:w-800,h-800,fo-auto,q-85,f-auto",
  blogFeatured: "tr:w-1200,h-630,fo-auto,q-85,f-auto",
  blogThumbnail: "tr:w-400,h-300,fo-auto,q-80,f-auto",
  heroImage: "tr:w-1920,h-1080,fo-auto,q-85,f-auto",
  galleryImage: "tr:w-600,h-400,fo-auto,q-80,f-auto",
  avatar: "tr:w-100,h-100,fo-face,q-80,f-auto",
  // Low quality placeholder for blur effect
  placeholder: "tr:w-20,h-20,bl-10,q-20,f-auto",
};

// Responsive breakpoints for srcset
export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Generate srcset for responsive images
export function generateSrcSet(
  path: string,
  widths: number[] = [400, 640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map((w) => `${IMAGEKIT_BASE}/tr:w-${w},f-auto,q-80/${path} ${w}w`)
    .join(", ");
}

// Generate placeholder URL for blur effect
export function getPlaceholderUrl(path: string): string {
  return `${IMAGEKIT_BASE}/${Transformations.placeholder}/${path}`;
}

// Get optimized URL with transformations
export function getOptimizedUrl(
  path: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    focus?: "auto" | "face" | "center";
    blur?: number;
  }
): string {
  const transforms: string[] = [];

  if (options?.width) transforms.push(`w-${options.width}`);
  if (options?.height) transforms.push(`h-${options.height}`);
  if (options?.quality) transforms.push(`q-${options.quality}`);
  if (options?.format) transforms.push(`f-${options.format}`);
  if (options?.focus) transforms.push(`fo-${options.focus}`);
  if (options?.blur) transforms.push(`bl-${options.blur}`);

  // Always add auto format if not specified
  if (!options?.format) transforms.push("f-auto");
  if (!options?.quality) transforms.push("q-80");

  if (transforms.length === 0) {
    return `${IMAGEKIT_BASE}/${path}`;
  }

  return `${IMAGEKIT_BASE}/tr:${transforms.join(",")}/${path}`;
}

// All site images mapped to ImageKit paths
export const Images = {
  // Hero images
  hero: {
    leaves: "hero-leaves.webp",
    tropical: "hero-tropical.png",
    collection: "hero-collection.png",
  },

  // Blog images
  blog: {
    indoor: "blog-indoor-plants.webp",
    bonsai: "blog-bonsai.webp",
    livingRoom: "blog-living-room.webp",
    flowering: "blog-flowering.webp",
    hero: "blog-hero.webp",
  },

  // Product images
  products: {
    arecaPalm: "plant-areca-palm.webp",
    snakePlant: "plant-snake-plant.webp",
    moneyPlant: "plant-money-plant.webp",
    jade: "plant-jade.webp",
    peaceLily: "plant-peace-lily.webp",
    tulsi: "plant-tulsi.webp",
    aloeVera: "plant-aloe-vera.webp",
    rubberPlant: "plant-rubber-plant.webp",
    spiderPlant: "plant-spider-plant.webp",
    zzPlant: "plant-zz-plant.webp",
  },

  // Nursery gallery images
  nursery: {
    photo1: "nursery-1.jpeg",
    photo2: "nursery-2.jpeg",
    photo3: "nursery-3.jpeg",
    photo4: "nursery-4.jpeg",
    photo5: "nursery-5.jpeg",
    photo6: "nursery-6.jpeg",
    photo7: "nursery-7.jpeg",
    photo8: "nursery-8.jpeg",
    photo9: "nursery-9.jpeg",
    photo10: "nursery-10.jpeg",
  },

  // Category images
  categories: {
    houseShape: "category-house-shape.webp",
    indoor: "category-indoor.webp",
  },

  // Other images
  misc: {
    newArrivalsBanner: "new-arrivals-banner.webp",
    plantCluster: "plant-cluster.webp",
    plantDelivery: "plant-delivery.png",
    founderPlants: "founder-plants.png",
    shopHero: "shop-hero.webp",
    cartHero: "cart-hero.webp",
    contactHero: "contact-hero.webp",
  },

  // Logo and branding
  branding: {
    logo: "logo.png",
    favicon: "favicon.png",
  },
};

// Helper to get full ImageKit URL for an image path
export function getImageUrl(imagePath: string): string {
  // If already an ImageKit URL, return as-is
  if (imagePath.startsWith("https://ik.imagekit.io")) {
    return imagePath;
  }

  // If it's a local path like /images/xxx.webp, convert to ImageKit path
  if (imagePath.startsWith("/images/")) {
    const filename = imagePath.replace("/images/", "");
    return `${IMAGEKIT_BASE}/${filename}`;
  }

  // Otherwise return the path as-is (might be from Firestore)
  return imagePath;
}

// Get image URL with specific transformation
export function getTransformedUrl(
  imagePath: string,
  transformation: keyof typeof Transformations
): string {
  const cleanPath = imagePath.startsWith("/images/")
    ? imagePath.replace("/images/", "")
    : imagePath;

  // If already ImageKit URL, extract path
  if (cleanPath.startsWith("https://ik.imagekit.io")) {
    const urlParts = cleanPath.split("/");
    const path = urlParts[urlParts.length - 1];
    return `${IMAGEKIT_BASE}/${Transformations[transformation]}/${path}`;
  }

  return `${IMAGEKIT_BASE}/${Transformations[transformation]}/${cleanPath}`;
}
