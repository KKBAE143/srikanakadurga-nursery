// Block types for the blog editor
export type BlockType =
  | "text"
  | "heading"
  | "image"
  | "gallery"
  | "video"
  | "products"
  | "keypoints"
  | "quote"
  | "divider"
  | "cta";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3;
  text: string;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
}

export interface GalleryBlock extends BaseBlock {
  type: "gallery";
  images: Array<{
    url: string;
    alt: string;
  }>;
  columns: 2 | 3 | 4;
}

export interface VideoBlock extends BaseBlock {
  type: "video";
  url: string;
  title?: string;
}

export interface ProductsBlock extends BaseBlock {
  type: "products";
  productIds: string[];
  title?: string;
}

export interface KeyPointsBlock extends BaseBlock {
  type: "keypoints";
  title?: string;
  points: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  text: string;
  author?: string;
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
}

export interface CTABlock extends BaseBlock {
  type: "cta";
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | GalleryBlock
  | VideoBlock
  | ProductsBlock
  | KeyPointsBlock
  | QuoteBlock
  | DividerBlock
  | CTABlock;

// Blog post data structure
export interface BlogPostData {
  id?: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  blocks: ContentBlock[];
  author: string;
  featured: boolean;
  status: "draft" | "published";
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Block metadata for UI
export const blockMeta: Record<BlockType, { label: string; icon: string; description: string }> = {
  text: {
    label: "Text",
    icon: "Type",
    description: "Add a paragraph of text",
  },
  heading: {
    label: "Heading",
    icon: "Heading",
    description: "Add a section heading",
  },
  image: {
    label: "Image",
    icon: "Image",
    description: "Add a single image",
  },
  gallery: {
    label: "Gallery",
    icon: "Images",
    description: "Add an image gallery",
  },
  video: {
    label: "Video",
    icon: "Youtube",
    description: "Embed a YouTube video",
  },
  products: {
    label: "Products",
    icon: "ShoppingBag",
    description: "Feature products from your shop",
  },
  keypoints: {
    label: "Key Points",
    icon: "ListChecks",
    description: "Highlight important points",
  },
  quote: {
    label: "Quote",
    icon: "Quote",
    description: "Add a highlighted quote",
  },
  divider: {
    label: "Divider",
    icon: "Minus",
    description: "Add a visual separator",
  },
  cta: {
    label: "Call to Action",
    icon: "MousePointerClick",
    description: "Add a call-to-action section",
  },
};
