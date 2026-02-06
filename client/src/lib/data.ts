export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  careInstructions?: string;
  lightRequirement?: string;
  waterFrequency?: string;
  petFriendly?: boolean;
  inStock: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  content: string;
  author?: string;
  date?: string;
}

export const products: Product[] = [
  {
    id: "areca-palm",
    name: "Areca Palm",
    price: 450,
    image: "/images/plant-areca-palm.webp",
    category: "Indoor Plants",
    rating: 5,
    description: "Beautiful areca palm that purifies air and adds tropical vibes to your living space. Known for its graceful, feathery fronds.",
    careInstructions: "Keep soil moist but not waterlogged. Mist leaves regularly for humidity.",
    lightRequirement: "Bright indirect light",
    waterFrequency: "Every 2-3 days",
    petFriendly: true,
    inStock: true,
  },
  {
    id: "snake-plant",
    name: "Snake Plant",
    price: 350,
    image: "/images/plant-snake-plant.webp",
    category: "Indoor Plants",
    rating: 5,
    description: "Low-maintenance snake plant perfect for beginners. Converts CO2 to oxygen at night, making it ideal for bedrooms.",
    careInstructions: "Allow soil to dry completely between waterings. Tolerates neglect well.",
    lightRequirement: "Low to bright indirect light",
    waterFrequency: "Every 2-3 weeks",
    petFriendly: false,
    inStock: true,
  },
  {
    id: "money-plant",
    name: "Money Plant",
    price: 199,
    image: "/images/plant-money-plant.webp",
    category: "Indoor Plants",
    rating: 4,
    description: "Lucky money plant that brings prosperity to your home. Easy to grow in water or soil.",
    careInstructions: "Can grow in water or soil. Change water weekly if growing in water.",
    lightRequirement: "Bright indirect light",
    waterFrequency: "Every week",
    petFriendly: false,
    inStock: true,
  },
  {
    id: "jade-plant",
    name: "Jade Plant",
    price: 299,
    image: "/images/plant-jade.webp",
    category: "Succulent Plants",
    rating: 5,
    description: "Elegant jade succulent with thick green leaves symbolizing good luck and prosperity.",
    careInstructions: "Allow soil to dry between waterings. Feed with succulent fertilizer monthly.",
    lightRequirement: "Bright direct or indirect light",
    waterFrequency: "Every 2-3 weeks",
    petFriendly: false,
    inStock: true,
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    price: 499,
    image: "/images/plant-peace-lily.webp",
    category: "Flowering Plants",
    rating: 5,
    description: "Graceful peace lily with beautiful white blooms. Excellent air purifier ranked by NASA.",
    careInstructions: "Keep soil consistently moist. Wipe leaves regularly to remove dust.",
    lightRequirement: "Low to moderate indirect light",
    waterFrequency: "Every week",
    petFriendly: false,
    inStock: true,
  },
  {
    id: "tulsi",
    name: "Tulsi",
    price: 149,
    image: "/images/plant-tulsi.webp",
    category: "Medicinal Plants",
    rating: 5,
    description: "Sacred holy basil with medicinal properties. Used in Ayurveda for centuries for immune-boosting benefits.",
    careInstructions: "Water daily. Pinch off flower buds to encourage leaf growth.",
    lightRequirement: "Full sun (6+ hours)",
    waterFrequency: "Daily",
    petFriendly: true,
    inStock: true,
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    price: 249,
    image: "/images/plant-aloe-vera.webp",
    category: "Medicinal Plants",
    rating: 4,
    description: "Natural aloe vera with healing gel for skin. A must-have home remedy plant.",
    careInstructions: "Water deeply but infrequently. Ensure pot has drainage holes.",
    lightRequirement: "Bright indirect to direct light",
    waterFrequency: "Every 2-3 weeks",
    petFriendly: false,
    inStock: true,
  },
  {
    id: "rubber-plant",
    name: "Rubber Plant",
    price: 550,
    image: "/images/plant-rubber-plant.webp",
    category: "Indoor Plants",
    rating: 5,
    description: "Stunning rubber plant with large glossy leaves. Makes a bold statement in any room.",
    careInstructions: "Wipe leaves with damp cloth monthly. Allow top inch of soil to dry between waterings.",
    lightRequirement: "Bright indirect light",
    waterFrequency: "Every 1-2 weeks",
    petFriendly: false,
    inStock: true,
  },
  {
    id: "spider-plant",
    name: "Spider Plant",
    price: 199,
    image: "/images/plant-spider-plant.webp",
    category: "Indoor Plants",
    rating: 4,
    description: "Air-purifying spider plant with graceful arching leaves. Produces baby plantlets for easy propagation.",
    careInstructions: "Keep soil lightly moist. Trim brown tips with clean scissors.",
    lightRequirement: "Bright indirect light",
    waterFrequency: "Every 1-2 weeks",
    petFriendly: true,
    inStock: true,
  },
  {
    id: "zz-plant",
    name: "ZZ Plant",
    price: 399,
    image: "/images/plant-zz-plant.webp",
    category: "Indoor Plants",
    rating: 5,
    description: "Virtually indestructible ZZ plant for low light spaces. Thrives on neglect with glossy, waxy leaves.",
    careInstructions: "Water only when soil is completely dry. Overwatering is the most common issue.",
    lightRequirement: "Low to bright indirect light",
    waterFrequency: "Every 2-4 weeks",
    petFriendly: false,
    inStock: true,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "indoor-plants-guide",
    title: "A Guide to Stunning Indoor Plants",
    excerpt: "Discover the best indoor plants to transform your Hyderabad home into a green paradise. From low-light tolerant species to air-purifying champions, we cover everything you need to know about indoor gardening.",
    image: "/images/blog-indoor-plants.webp",
    content: "Indoor plants have become an essential part of modern home decor. Not only do they add beauty and life to your living spaces, but they also purify the air and boost your mood. In this comprehensive guide, we'll explore the best indoor plants for every room in your home...",
    author: "Priya Sharma",
    date: "2026-01-15",
  },
  {
    id: "rare-plants",
    title: "The World's Rarest Plant: A Journey of Discovery",
    excerpt: "Explore the fascinating world of rare and exotic plant species from around the globe. Learn about endangered species and what conservation efforts are being made to preserve these botanical treasures.",
    image: "/images/blog-bonsai.webp",
    content: "From the high mountains of the Himalayas to the deep jungles of the Amazon, rare plants tell stories of evolution and adaptation. Join us as we explore some of the most extraordinary plant species on Earth...",
    author: "Dr. Ravi Kumar",
    date: "2026-01-20",
  },
  {
    id: "plant-styling",
    title: "Indoor Plant Styling: Elevate Your Interior Decor with Greenery",
    excerpt: "Learn creative ways to style your plants and create an Instagram-worthy green space. Tips from professional interior designers on pairing plants with your home decor style.",
    image: "/images/blog-living-room.webp",
    content: "Plants are nature's decorating accessories. Whether your style is minimalist, bohemian, or modern contemporary, there's a plant arrangement that will complement your space perfectly...",
    author: "Meera Reddy",
    date: "2026-01-25",
  },
  {
    id: "plants-wellbeing",
    title: "Plants and Well-being: Enhancing Mental and Physical Health",
    excerpt: "Understand how plants can improve your mental health and physical well-being. Scientific studies show the remarkable benefits of having plants in your home and workspace.",
    image: "/images/blog-flowering.webp",
    content: "Research from leading universities confirms what plant lovers have always known: being around plants makes us healthier and happier. Studies show that indoor plants can reduce stress, improve focus, and even lower blood pressure...",
    author: "Dr. Anita Rao",
    date: "2026-02-01",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}
