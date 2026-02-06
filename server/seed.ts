import { db } from "./db";
import { products, blogPosts } from "@shared/schema";

export async function seedDatabase() {
  const existingProducts = await db.select().from(products);
  if (existingProducts.length > 0) {
    return;
  }

  await db.insert(products).values([
    {
      name: "Areca Palm",
      price: 450,
      image: "/images/plant-areca-palm.png",
      category: "Indoor Plants",
      rating: 5,
      description: "Beautiful areca palm that purifies air and adds tropical vibes",
      inStock: true,
    },
    {
      name: "Snake Plant",
      price: 350,
      image: "/images/plant-snake-plant.png",
      category: "Indoor Plants",
      rating: 5,
      description: "Low-maintenance snake plant perfect for beginners",
      inStock: true,
    },
    {
      name: "Money Plant",
      price: 199,
      image: "/images/plant-money-plant.png",
      category: "Indoor Plants",
      rating: 4,
      description: "Lucky money plant that brings prosperity to your home",
      inStock: true,
    },
    {
      name: "Jade Plant",
      price: 299,
      image: "/images/plant-jade.png",
      category: "Succulent Plants",
      rating: 5,
      description: "Elegant jade succulent with thick green leaves",
      inStock: true,
    },
    {
      name: "Peace Lily",
      price: 499,
      image: "/images/plant-peace-lily.png",
      category: "Flowering Plants",
      rating: 5,
      description: "Graceful peace lily with beautiful white blooms",
      inStock: true,
    },
    {
      name: "Tulsi",
      price: 149,
      image: "/images/plant-tulsi.png",
      category: "Medicinal Plants",
      rating: 5,
      description: "Sacred holy basil with medicinal properties",
      inStock: true,
    },
    {
      name: "Aloe Vera",
      price: 249,
      image: "/images/plant-aloe-vera.png",
      category: "Medicinal Plants",
      rating: 4,
      description: "Natural aloe vera with healing gel for skin",
      inStock: true,
    },
    {
      name: "Rubber Plant",
      price: 550,
      image: "/images/plant-rubber-plant.png",
      category: "Indoor Plants",
      rating: 5,
      description: "Stunning rubber plant with large glossy leaves",
      inStock: true,
    },
    {
      name: "Spider Plant",
      price: 199,
      image: "/images/plant-spider-plant.png",
      category: "Indoor Plants",
      rating: 4,
      description: "Air-purifying spider plant with graceful arching leaves",
      inStock: true,
    },
    {
      name: "ZZ Plant",
      price: 399,
      image: "/images/plant-zz-plant.png",
      category: "Indoor Plants",
      rating: 5,
      description: "Virtually indestructible ZZ plant for low light spaces",
      inStock: true,
    },
  ]);

  await db.insert(blogPosts).values([
    {
      title: "A Guide to Stunning Indoor Plants",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo, ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Discover the best indoor plants to transform your Hyderabad home into a green paradise.",
      image: "/images/blog-indoor-plants.png",
      content: "Full article content about indoor plants...",
    },
    {
      title: "The World's Rarest Plant: A Journey of Discovery",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo, ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Explore the fascinating world of rare and exotic plant species from around the globe.",
      image: "/images/blog-bonsai.png",
      content: "Full article content about rare plants...",
    },
    {
      title: "Indoor Plant Styling: Elevate Your Interior Decor with Greenery",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo, ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Learn creative ways to style your plants and create an Instagram-worthy green space.",
      image: "/images/blog-living-room.png",
      content: "Full article content about plant styling...",
    },
    {
      title: "Plants and Well-being: Enhancing Mental and Physical Health",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo, ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Understand how plants can improve your mental health and physical well-being.",
      image: "/images/blog-flowering.png",
      content: "Full article content about plants and well-being...",
    },
  ]);

  console.log("Database seeded successfully!");
}
