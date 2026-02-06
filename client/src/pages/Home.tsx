import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Star, Truck, CreditCard, RotateCcw, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, type Product } from "@/lib/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    getProducts().then((p) => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const newArrivals = products.slice(0, 4);
  const bestSellers = products.filter(p => p.rating >= 5).slice(0, 4);
  const allForGrid = products.slice(0, 8);

  const testimonials = [
    { text: "Perfect! They also carry organic options & decorative items as well. Had an amazing experience and supply gardens/fresh! Such a wonderful nursery with beautiful plants and very knowledgeable staff.", name: "Anitha Reddy", location: "Hyderabad" },
    { text: "Absolutely love the quality of plants from Srikanakadurganursery. Every plant arrived healthy and well-packed. The customer service was exceptional and they even gave me care tips!", name: "Ravi Shankar", location: "Secunderabad" },
    { text: "Best nursery in Hyderabad! I've been ordering from them for over a year now. The plants are always fresh and the prices are very reasonable compared to others.", name: "Lakshmi Devi", location: "Kukatpally" },
  ];

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <section className="relative w-full h-[500px] sm:h-[600px] overflow-hidden" data-testid="section-hero">
        <img
          src="/images/hero-leaves.webp"
          alt="Lush green leaves"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
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
          <div className="flex gap-3 mt-6">
            <Link href="/shop">
              <button
                className="bg-[#2F4836] text-white px-8 py-3 rounded-full font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors"
                data-testid="button-shop-now-hero"
              >
                Shop Now
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-white/40 text-white px-8 py-3 rounded-full font-heading text-sm tracking-wider uppercase hover:bg-white/10 transition-colors backdrop-blur-sm" data-testid="button-contact-hero">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-new-arrivals">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
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
              src="/images/new-arrivals-banner.webp"
              alt="New fresh arrivals"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
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
            {loading ? (
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
                src="/images/plant-cluster.webp"
                alt="House plants collection"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
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

      {bestSellers.length > 0 && (
        <section className="bg-white py-16" data-testid="section-bestsellers">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-[#8F9E8B] text-sm font-heading tracking-wider uppercase mb-2">Most Popular</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] uppercase tracking-wide">
                Bestsellers
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="section-categories">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-[220px] rounded-sm overflow-hidden group">
            <img
              src="/images/category-house-shape.webp"
              alt="House Shape Plants"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
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
              src="/images/category-indoor.webp"
              alt="Indoor Life Plants"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
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

      <section className="bg-white py-16" data-testid="section-why-choose">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#8F9E8B] text-sm font-heading tracking-wider uppercase mb-2">Our Promise</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] uppercase tracking-wide">
              Why Choose Us
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🌿", title: "Hand-Picked Quality", desc: "Every plant is carefully selected and inspected before delivery to ensure you receive only the healthiest specimens." },
              { icon: "🚚", title: "Safe Delivery", desc: "Expert packaging and same-day delivery across Hyderabad. Your plants arrive fresh and ready to thrive." },
              { icon: "💬", title: "Expert Guidance", desc: "Our team of plant experts provides personalized care tips and ongoing support for your green journey." },
              { icon: "♻️", title: "Eco-Friendly", desc: "We use sustainable growing practices and biodegradable packaging to minimize our environmental footprint." },
            ].map((item, i) => (
              <div key={i} className="text-center p-6" data-testid={`why-choose-${i}`}>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">{item.title}</h4>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">{item.desc}</p>
              </div>
            ))}
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

      {allForGrid.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-trending">
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div>
              <p className="text-[#8F9E8B] text-sm font-heading tracking-wider uppercase mb-1">Explore</p>
              <h2 className="font-heading text-2xl font-semibold text-[#1A1A1A] tracking-wide uppercase">
                Trending Plants
              </h2>
            </div>
            <Link href="/shop">
              <button className="border border-[#2F4836] text-[#2F4836] px-6 py-2 font-heading text-xs tracking-wider uppercase hover:bg-[#2F4836] hover:text-white transition-colors" data-testid="button-view-all-trending">
                View All
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allForGrid.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-white py-16" data-testid="section-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-[#1A1A1A] text-center tracking-wide mb-10">
            What Our Customers Say!
          </h2>
          <div className="max-w-2xl mx-auto text-center relative">
            <div className="text-5xl text-[#8F9E8B] font-serif mb-4">&ldquo;</div>
            <p className="text-[#4A4A4A] text-sm leading-relaxed italic mb-6 min-h-[80px]" data-testid="text-testimonial">
              {testimonials[testimonialIdx].text}
            </p>
            <p className="font-heading text-sm font-semibold text-[#1A1A1A]">
              {testimonials[testimonialIdx].name}
            </p>
            <p className="text-xs text-[#8F9E8B]">{testimonials[testimonialIdx].location}</p>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setTestimonialIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
                className="p-2 border border-[#dde3dc] text-[#8F9E8B] hover:text-[#2F4836] hover:border-[#2F4836] transition-colors rounded-full"
                data-testid="button-testimonial-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === testimonialIdx ? "bg-[#2F4836]" : "bg-[#dde3dc]"
                    }`}
                    data-testid={`button-testimonial-dot-${i}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1))}
                className="p-2 border border-[#dde3dc] text-[#8F9E8B] hover:text-[#2F4836] hover:border-[#2F4836] transition-colors rounded-full"
                data-testid="button-testimonial-next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#2F4836] py-10" data-testid="section-newsletter-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-white text-lg font-semibold tracking-wide">
                Sign Up for Newsletters
              </h3>
              <p className="text-white/70 text-sm mt-1">
                Get the latest offers, new arrivals, and gardening tips
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 px-4 py-2.5 text-sm rounded-sm outline-none focus:border-white/40 flex-1 sm:w-64"
                data-testid="input-newsletter-email-banner"
              />
              <button
                className="bg-white text-[#2F4836] px-6 py-2.5 text-sm font-heading tracking-wider hover:bg-white/90 transition-colors flex-shrink-0"
                data-testid="button-newsletter-subscribe-banner"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
