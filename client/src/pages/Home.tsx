import { Link } from "wouter";
import { useState, useEffect, useCallback, useRef } from "react";
import { Truck, CreditCard, RotateCcw, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getImageUrl } from "@/lib/images";

interface HeroSlide {
  id: string;
  image: string;
  alt?: string;
  subtitle: string;
  title: string;
  description: string;
  primaryLink: string;
  primaryLabel: string;
  secondaryLink?: string;
  secondaryLabel?: string;
}

const defaultHeroSlides: HeroSlide[] = [
  {
    id: "1",
    image: "/images/hero-leaves.webp",
    alt: "Lush green leaves",
    subtitle: "Shop With Us",
    title: "Let's Make Your Home Beautiful",
    description: "Premium plants and landscaping in Hyderabad. Transform your living spaces with nature's finest.",
    primaryLink: "/shop",
    primaryLabel: "Shop Now",
    secondaryLink: "/contact",
    secondaryLabel: "Contact Us",
  },
  {
    id: "2",
    image: "/images/hero-tropical.png",
    alt: "Tropical indoor plants in modern home",
    subtitle: "Bring Nature Indoors",
    title: "Transform Your Space with Greenery",
    description: "Discover our handpicked collection of tropical and indoor plants that purify air and elevate your decor.",
    primaryLink: "/shop",
    primaryLabel: "Explore Plants",
    secondaryLink: "/about",
    secondaryLabel: "Our Story",
  },
  {
    id: "3",
    image: "/images/hero-collection.png",
    alt: "Curated plant collection",
    subtitle: "Curated for You",
    title: "Plants That Grow with You",
    description: "From low-maintenance succulents to statement palms, find the perfect green companion for every corner.",
    primaryLink: "/shop",
    primaryLabel: "Browse Collection",
    secondaryLink: "/blog",
    secondaryLabel: "Read Blog",
  },
];

const SLIDE_INTERVAL = 5000;

export default function Home() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch hero slides from Firestore
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const docRef = doc(db, "settings", "homepage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroSlides && data.heroSlides.length > 0) {
            setHeroSlides(data.heroSlides);
          }
        }
      } catch (error) {
        console.error("Error fetching hero slides:", error);
      }
    };
    fetchHeroSlides();
  }, []);

  const newArrivals = products.slice(0, 4);
  const bestSellers = products.filter(p => p.rating >= 5).slice(0, 4);
  const allForGrid = products.slice(0, 8);

  const clearTimers = useCallback(() => {
    if (autoTimerRef.current) { clearTimeout(autoTimerRef.current); autoTimerRef.current = null; }
    if (fadeTimerRef.current) { clearTimeout(fadeTimerRef.current); fadeTimerRef.current = null; }
  }, []);

  const changeSlide = useCallback((getNext: (prev: number) => number) => {
    clearTimers();
    setTextVisible(false);
    fadeTimerRef.current = setTimeout(() => {
      setHeroIdx(getNext);
      setTextVisible(true);
    }, 300);
  }, [clearTimers]);

  const goToSlide = useCallback((idx: number) => changeSlide(() => idx), [changeSlide]);
  const nextSlide = useCallback(() => changeSlide((prev) => (prev + 1) % heroSlides.length), [changeSlide]);
  const prevSlide = useCallback(() => changeSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length), [changeSlide]);

  useEffect(() => {
    if (paused) {
      if (autoTimerRef.current) { clearTimeout(autoTimerRef.current); autoTimerRef.current = null; }
      return;
    }
    autoTimerRef.current = setTimeout(() => {
      changeSlide((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_INTERVAL);
    return () => { clearTimers(); };
  }, [heroIdx, paused, changeSlide, clearTimers]);

  const testimonials = [
    { text: "Perfect! They also carry organic options & decorative items as well. Had an amazing experience and supply gardens/fresh! Such a wonderful nursery with beautiful plants and very knowledgeable staff.", name: "Anitha Reddy", location: "Hyderabad" },
    { text: "Absolutely love the quality of plants from Srikanakadurganursery. Every plant arrived healthy and well-packed. The customer service was exceptional and they even gave me care tips!", name: "Ravi Shankar", location: "Secunderabad" },
    { text: "Best nursery in Hyderabad! I've been ordering from them for over a year now. The plants are always fresh and the prices are very reasonable compared to others.", name: "Lakshmi Devi", location: "Kukatpally" },
  ];

  const currentSlide = heroSlides[heroIdx];

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <section
        className="relative w-full h-[500px] sm:h-[600px] overflow-hidden"
        data-testid="section-hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {heroSlides.map((slide, i) => (
          <img
            key={slide.image}
            src={getImageUrl(slide.image)}
            alt={slide.alt || "Hero image"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              i === heroIdx ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            data-testid={`img-hero-slide-${i}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10" />

        <div className="relative z-20 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className={`text-white/80 text-sm font-heading tracking-[0.2em] uppercase mb-3 transition-all duration-300 ${
              textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            data-testid="text-hero-subtitle"
          >
            {currentSlide.subtitle}
          </p>
          <h1
            className={`font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight max-w-xl uppercase tracking-wide transition-all duration-300 delay-75 ${
              textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            data-testid="text-hero-title"
          >
            {currentSlide.title}
          </h1>
          <p
            className={`text-white/80 text-sm sm:text-base mt-4 max-w-md font-sans transition-all duration-300 delay-150 ${
              textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {currentSlide.description}
          </p>
          <div
            className={`flex gap-3 mt-6 transition-all duration-300 delay-200 ${
              textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <Link href={currentSlide.primaryLink}>
              <button
                className="bg-[#2F4836] text-white px-8 py-3 rounded-full font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors"
                data-testid="button-hero-primary"
              >
                {currentSlide.primaryLabel}
              </button>
            </Link>
            <Link href={currentSlide.secondaryLink}>
              <button
                className="border border-white/40 text-white px-8 py-3 rounded-full font-heading text-sm tracking-wider uppercase hover:bg-white/10 transition-colors backdrop-blur-sm"
                data-testid="button-hero-secondary"
              >
                {currentSlide.secondaryLabel}
              </button>
            </Link>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/20 text-white/80 backdrop-blur-sm hover:bg-black/40"
          data-testid="button-hero-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/20 text-white/80 backdrop-blur-sm hover:bg-black/40"
          data-testid="button-hero-next"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === heroIdx
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              }`}
              data-testid={`button-hero-dot-${i}`}
            />
          ))}
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
              src={getImageUrl("/images/new-arrivals-banner.webp")}
              alt="New fresh arrivals"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end p-6">
              <p className="text-white text-sm font-heading tracking-wider uppercase mb-1">Buy New</p>
              <h3 className="text-white text-xl font-heading font-bold uppercase tracking-wide">
                Fresh Arrivals
              </h3>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-house-plants">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-[#dde3dc]">
              <img
                src={getImageUrl("/images/plant-cluster.webp")}
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
              src={getImageUrl("/images/category-house-shape.webp")}
              alt="House Shape Plants"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/20 z-10" />
            <div className="relative z-20 h-full flex flex-col justify-center px-8">
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
              src={getImageUrl("/images/category-indoor.webp")}
              alt="Indoor Life Plants"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/20 z-10" />
            <div className="relative z-20 h-full flex flex-col justify-center px-8">
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
