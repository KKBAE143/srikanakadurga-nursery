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
    content: `Indoor plants have become an essential part of modern home decor, especially in cities like Hyderabad where green spaces are shrinking. Not only do they add beauty and life to your living spaces, but they also purify the air and boost your mood.

**Why Indoor Plants Matter**

Studies show that having plants indoors can reduce stress by up to 37%, improve concentration, and even lower blood pressure. For families in Hyderabad, where summer temperatures soar above 40°C, indoor plants also help cool down rooms naturally through transpiration.

**Best Indoor Plants for Hyderabad Homes**

1. **Snake Plant (Sansevieria)** - Nearly indestructible, thrives in low light, and is one of the best air purifiers. Perfect for bedrooms as it releases oxygen at night.

2. **Money Plant (Pothos)** - A favourite in Indian households, it grows beautifully in water or soil. Believed to bring prosperity and good luck.

3. **Areca Palm** - A natural humidifier that adds a tropical feel to any room. Great for living rooms and drawing areas.

4. **Peace Lily** - Elegant white blooms that thrive in shade. Excellent for bathrooms and kitchens as it absorbs mould spores.

5. **Spider Plant** - Produces baby plantlets that you can share with neighbours and friends. Very forgiving for beginners.

**Care Tips for Beginners**

- Water your plants early in the morning or late evening to avoid evaporation
- Use well-draining soil mix - we recommend a blend of red soil, cocopeat, and vermicompost
- Rotate your plants every few weeks so all sides get light
- Wipe leaves with a damp cloth monthly to keep them dust-free and breathing well
- Don't overwater! More indoor plants die from overwatering than underwatering

**Where to Place Your Plants**

Think about the light each room gets. North-facing windows in Hyderabad get gentle, indirect light - perfect for ferns and peace lilies. South and west-facing spots get strong afternoon sun, ideal for succulents and cacti. East-facing windows provide the best morning light for most flowering plants.

Visit Srikanakadurga Nursery in Ramanthapur to handpick the perfect indoor plants for your home. Our team will help you choose varieties that match your space and lifestyle.`,
    author: "Priya Sharma",
    date: "2026-01-15",
  },
  {
    id: "rare-plants",
    title: "The World's Rarest Plant: A Journey of Discovery",
    excerpt: "Explore the fascinating world of rare and exotic plant species from around the globe. Learn about endangered species and what conservation efforts are being made to preserve these botanical treasures.",
    image: "/images/blog-bonsai.webp",
    content: `The world of rare plants is full of wonder and mystery. From ancient species that have survived millions of years to delicate orchids found only on a single mountaintop, these botanical treasures remind us of nature's incredible diversity.

**India's Own Rare Plants**

India is home to over 18,000 plant species, and many of them are found nowhere else on Earth. The Western Ghats alone harbour around 7,402 species of flowering plants, of which 2,116 are endemic.

1. **Neelakurinji (Strobilanthes kunthiana)** - This stunning purple flower blooms only once every 12 years, covering entire hillsides in Kerala and Tamil Nadu in a breathtaking purple carpet.

2. **Brahma Kamal (Saussurea obvallata)** - Sacred in Hindu mythology, this rare flower blooms only at night and is found in the high altitudes of Uttarakhand and Himachal Pradesh.

3. **Ghost Orchid (Dendrophylax lindenii)** - One of the rarest orchids in the world, it appears to float in mid-air as its roots cling to tree bark.

**Conservation Efforts in Telangana**

Closer to home, Telangana has its own stories of plant conservation. The state forest department has been working to protect native species like the Terminalia pallida and various wild medicinal herbs found in the Nallamala Hills.

At Srikanakadurga Nursery, we play our small part by cultivating and distributing native species that are becoming hard to find. We believe every plant lover can be a conservationist.

**How You Can Help**

- Choose native plants for your garden - they support local pollinators and wildlife
- Avoid buying plants collected from the wild - always buy nursery-propagated specimens
- Share seeds and cuttings with fellow gardeners to spread plant diversity
- Support local nurseries that practise sustainable growing methods

**Starting Your Rare Plant Collection**

If you're interested in growing something unique, start with hardy rare varieties like the ZZ plant, String of Pearls, or Monstera deliciosa. These are readily available at our nursery and make excellent conversation starters.

The world of rare plants is endlessly fascinating. Every leaf tells a story, and every bloom is a small miracle worth celebrating.`,
    author: "Dr. Ravi Kumar",
    date: "2026-01-20",
  },
  {
    id: "plant-styling",
    title: "Indoor Plant Styling: Elevate Your Interior Decor with Greenery",
    excerpt: "Learn creative ways to style your plants and create an Instagram-worthy green space. Tips from professional interior designers on pairing plants with your home decor style.",
    image: "/images/blog-living-room.webp",
    content: `Plants are nature's decorating accessories. Whether your style is minimalist, bohemian, or modern contemporary, there's a plant arrangement that will complement your space perfectly. Here's how to style your plants like a pro.

**The Art of Plant Placement**

The secret to great plant styling is thinking in layers. Place tall plants like fiddle leaf figs or areca palms in corners to add height. Use medium plants like rubber plants or peace lilies on side tables. And finish with trailing plants like pothos or string of pearls on shelves and window sills.

**Choosing the Right Planters**

Your planter is just as important as the plant itself. Here are some ideas that work beautifully in Indian homes:

- **Terracotta pots** - Timeless and breathable, they suit traditional and contemporary interiors alike. The earthy tones complement the sage and green palette of most plants.
- **Brass and copper urlis** - A truly Indian touch. Float flowers in a brass urli for a pooja room, or use a copper vessel for money plants.
- **Woven baskets** - Jute and cane baskets add warmth and texture. Perfect for boho-style living rooms.
- **Ceramic pots** - Clean lines and modern colours work well in minimalist spaces.

**Room-by-Room Styling Guide**

**Living Room:** Create a focal point with a large statement plant like a Monstera or Bird of Paradise. Group smaller plants in odd numbers (3 or 5) on a plant stand for visual interest.

**Bedroom:** Choose calming plants like lavender, jasmine, or snake plants. These promote better sleep and add a serene atmosphere.

**Kitchen:** Grow herbs like tulsi, mint, and curry leaves on your kitchen windowsill. They're practical, fragrant, and add a lovely green touch.

**Balcony:** If you have a Hyderabad balcony that gets direct sun, go for bougainvillea, hibiscus, or jasmine creepers. For shaded balconies, ferns and peace lilies work wonderfully.

**Bathroom:** Pothos, ferns, and air plants love the humidity. Hang them near windows for a spa-like feel.

**Styling Tips from Our Team**

- Mix different leaf shapes and textures for visual interest
- Use plants of varying heights to create depth
- Don't be afraid of empty space - let each plant breathe
- Group plants with similar care needs together for easier maintenance

Visit us at Srikanakadurga Nursery for personalised styling advice. Bring photos of your space and our team will help you pick the perfect plants and planters.`,
    author: "Meera Reddy",
    date: "2026-01-25",
  },
  {
    id: "plants-wellbeing",
    title: "Plants and Well-being: Enhancing Mental and Physical Health",
    excerpt: "Understand how plants can improve your mental health and physical well-being. Scientific studies show the remarkable benefits of having plants in your home and workspace.",
    image: "/images/blog-flowering.webp",
    content: `Research from leading universities confirms what plant lovers have always known: being around plants makes us healthier and happier. In a world where screen time is increasing and outdoor time is decreasing, plants offer a simple, accessible path to better health.

**The Science Behind Plant Therapy**

A landmark study by NASA found that indoor plants can remove up to 87% of air toxins in just 24 hours. Plants like spider plants, peace lilies, and snake plants are particularly effective at filtering harmful chemicals like formaldehyde, benzene, and trichloroethylene from indoor air.

But the benefits go far beyond air quality:

- **Reduced stress:** A study published in the Journal of Physiological Anthropology found that interacting with plants can reduce both physiological and psychological stress.
- **Better focus:** Research from the University of Michigan showed that spending time near plants can improve memory and attention by up to 20%.
- **Faster healing:** Hospital patients with plants in their rooms recovered faster and needed fewer painkillers than those without, according to a study in HortScience.

**Plants in Indian Wellness Traditions**

India has known about the healing power of plants for thousands of years. Ayurveda, our ancient system of medicine, is built on the wisdom of plant-based healing.

- **Tulsi (Holy Basil)** - Revered in every Indian household, tulsi purifies the air and is used to treat colds, coughs, and digestive issues.
- **Aloe Vera** - Known as "kumari" in Ayurveda, it heals skin, aids digestion, and boosts immunity.
- **Neem** - The "village pharmacy" of India, neem has antibacterial, antifungal, and anti-inflammatory properties.
- **Jasmine** - Its fragrance is proven to reduce anxiety and improve sleep quality. A staple in South Indian homes and temples.

**Creating a Healing Garden at Home**

You don't need a large garden to experience the therapeutic benefits of plants. Even a small collection on your balcony or windowsill can make a meaningful difference.

Start with these five plants for a wellness corner:
1. Tulsi - for respiratory health and spiritual well-being
2. Aloe Vera - for skin care and first aid
3. Lavender - for stress relief and better sleep
4. Mint - for digestion and fresh breath
5. Snake Plant - for clean air, especially in bedrooms

**Plant Care as Self-Care**

The act of caring for plants is itself therapeutic. The routine of watering, pruning, and repotting creates a mindful practice that grounds us in the present moment. Many of our customers at Srikanakadurga Nursery tell us that their morning plant care routine has become their favourite part of the day.

Whether you're looking to improve your air quality, reduce stress, or simply bring more beauty into your life, plants are the answer. Visit us in Ramanthapur to start your green wellness journey.`,
    author: "Dr. Anita Rao",
    date: "2026-02-01",
  },
];

export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts.find((p) => p.id === id);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}
