// ImageKit Configuration
// Client-side public configuration only

export const IMAGEKIT_CONFIG = {
  publicKey: "public_u4RMvhnxcY+obKITfeCIpskSxPM=",
  urlEndpoint: "https://ik.imagekit.io/vvkwy0zte",
};

// Helper to generate ImageKit URL with transformations
export function getImageKitUrl(path: string, transformations?: string): string {
  const baseUrl = IMAGEKIT_CONFIG.urlEndpoint;
  if (transformations) {
    return `${baseUrl}/tr:${transformations}/${path}`;
  }
  return `${baseUrl}/${path}`;
}

// Common transformations
export const ImageTransformations = {
  thumbnail: "w-150,h-150,fo-auto",
  productCard: "w-400,h-400,fo-auto",
  productDetail: "w-800,h-800,fo-auto",
  blogFeatured: "w-1200,h-630,fo-auto",
  blogThumbnail: "w-400,h-300,fo-auto",
  heroImage: "w-1920,h-1080,fo-auto",
};
