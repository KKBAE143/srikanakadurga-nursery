import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, ShoppingCart, Truck, CreditCard, RotateCcw, Phone } from "lucide-react";
import type { Product } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const newArrivals = products?.slice(0, 4) || [];
  const featuredProducts = products?.slice(4, 8) || [];

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <section className="relative w-full h-[500px] sm:h-[600px] overflow-hidden" data-testid="section-hero">
        <img
          src="/images/hero-leaves.png"
          alt="Lush green leaves"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/80 text-sm font-heading tracking-[0.2em] uppercase mb-3" data-testid="text-hero-subtitle">
            Shop With Us
          </p>
          <h1
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight max-w-xl uppercase tracking-wide"
            data-testid="text-hero-title"
          >
            Let's Make Your Home Beautiful
          </h1>
          <p className="text-white/80 text-sm sm:text-base mt-4 max-w-md font-sans">
            Premium plants and landscaping in Hyderabad. Transform your living spaces with nature's finest.
          </p>
          <Link href="/shop">
            <button
              className="mt-6 bg-[#2F4836] text-white px-8 py-3 rounded-full font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors"
              data-testid="button-shop-now-hero"
            >
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-new-arrivals">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-semibold text-[#1A1A1A] tracking-wide uppercase" data-testid="text-new-arrivals-title">
            Today's Deal
          </h2>
          <Link href="/shop">
            <span className="text-sm text-[#2F4836] font-heading hover:underline" data-testid="link-view-all">
              View All
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="relative rounded-sm overflow-hidden h-[300px] lg:h-full">
            <img
              src="/images/new-arrivals-banner.png"
              alt="New fresh arrivals"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-6">
              <p className="text-white text-sm font-heading tracking-wider uppercase mb-1">Buy New</p>
              <h3 className="text-white text-xl font-heading font-bold uppercase tracking-wide">
                Fresh Arrivals
              </h3>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-sm animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-house-plants">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-[#dde3dc]">
              <img
                src="/images/plant-cluster.png"
                alt="House plants collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-[#8F9E8B] text-sm font-heading tracking-wider uppercase mb-2">
              A Great Addition
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A1A] uppercase tracking-wide mb-4">
              House Plants
            </h2>
            <p className="text-[#4A4A4A] text-sm leading-relaxed mb-6 max-w-md">
              Explore our curated collection of beautiful house plants that purify air, 
              boost mood, and add natural elegance to every corner of your home. From 
              low-maintenance succulents to lush tropical varieties.
            </p>
            <Link href="/shop">
              <button
                className="bg-[#2F4836] text-white px-8 py-3 font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors"
                data-testid="button-shop-house-plants"
              >
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="section-categories">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-[220px] rounded-sm overflow-hidden group">
            <img
              src="/images/category-house-shape.png"
              alt="House Shape Plants"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex flex-col justify-center px-8">
              <p className="text-white/80 text-xs font-heading tracking-wider uppercase mb-1">Only On Our Store</p>
              <h3 className="text-white text-2xl font-heading font-bold tracking-wide mb-4">
                House Shape<br />Plant
              </h3>
              <Link href="/shop">
                <button
                  className="bg-white text-[#2F4836] px-5 py-2 text-xs font-heading tracking-wider uppercase hover:bg-white/90 transition-colors w-fit"
                  data-testid="button-category-house-shape"
                >
                  Check Now
                </button>
              </Link>
            </div>
          </div>

          <div className="relative h-[220px] rounded-sm overflow-hidden group">
            <img
              src="/images/category-indoor.png"
              alt="Indoor Life Plants"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex flex-col justify-center px-8">
              <p className="text-white/80 text-xs font-heading tracking-wider uppercase mb-1">Only On Our Store</p>
              <h3 className="text-white text-2xl font-heading font-bold tracking-wide mb-4">
                Indoor Life<br />Plants
              </h3>
              <Link href="/shop">
                <button
                  className="bg-white text-[#2F4836] px-5 py-2 text-xs font-heading tracking-wider uppercase hover:bg-white/90 transition-colors w-fit"
                  data-testid="button-category-indoor"
                >
                  Check Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-features">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Phone, title: "Need Help? Call", desc: "+91 98765 43210" },
            { icon: Truck, title: "Delivery On", desc: "Free for orders above ₹999" },
            { icon: CreditCard, title: "Payment", desc: "Secure online payments" },
            { icon: RotateCcw, title: "Return", desc: "Easy exchange & return" },
          ].map((feature, i) => (
            <div key={i} className="text-center" data-testid={`feature-${i}`}>
              <feature.icon className="w-6 h-6 text-[#2F4836] mx-auto mb-2" />
              <h4 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-1">{feature.title}</h4>
              <p className="text-xs text-[#4A4A4A]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-testimonial">
        <h2 className="font-heading text-2xl font-semibold text-[#1A1A1A] text-center tracking-wide mb-10">
          What Our Customer Says!
        </h2>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl text-[#8F9E8B] font-serif mb-4">&ldquo;</div>
          <p className="text-[#4A4A4A] text-sm leading-relaxed italic mb-6">
            Perfect! I wanted to add that they also carry organic options & decorative items as well. 
            Had an amazing experience and supply gardens/fresh! Such a wonderful nursery 
            with beautiful plants and very knowledgeable staff.
          </p>
          <p className="font-heading text-sm font-semibold text-[#1A1A1A]">Anitha Reddy</p>
          <p className="text-xs text-[#8F9E8B]">Hyderabad</p>
        </div>
      </section>

      <section className="bg-[#2F4836] py-6" data-testid="section-newsletter-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-white text-base font-semibold tracking-wide">
              Sign Up for Newsletters
            </h3>
            <p className="text-white/70 text-xs mt-1">
              Get the latest offers, new arrivals, and gardening tips
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 px-4 py-2 text-sm rounded-sm outline-none focus:border-white/40 w-56"
              data-testid="input-newsletter-email-banner"
            />
            <button
              className="bg-white text-[#2F4836] px-5 py-2 text-sm font-heading tracking-wider hover:bg-white/90 transition-colors"
              data-testid="button-newsletter-subscribe-banner"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
