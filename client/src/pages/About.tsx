import { Link } from "wouter";
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Leaf,
  Heart,
  Users,
  Award,
  Truck,
  ShieldCheck,
  Star,
  Quote,
  ChevronRight,
  Mail,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  const stats = [
    { number: "10+", label: "Years Experience", icon: Award },
    { number: "5000+", label: "Happy Customers", icon: Users },
    { number: "500+", label: "Plant Varieties", icon: Leaf },
    { number: "100%", label: "Quality Guarantee", icon: ShieldCheck },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Plants",
      description:
        "Every plant we sell is nurtured with love and care. We believe in building lasting relationships between plants and their owners.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      description:
        "We handpick and inspect each plant to ensure only the healthiest specimens reach your home. Quality is never compromised.",
    },
    {
      icon: Truck,
      title: "Safe Delivery",
      description:
        "Our specially designed packaging ensures your plants arrive fresh and healthy, no matter where you are in Hyderabad.",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description:
        "Our team of horticulturists is always ready to help you choose the right plants and provide care tips for your green companions.",
    },
  ];

  const timeline = [
    {
      year: "2015",
      title: "The Beginning",
      description:
        "Srikanakadurga Nursery was founded in Ramanthapur, Hyderabad, with a humble collection of indoor plants and a dream to make every home greener.",
    },
    {
      year: "2017",
      title: "Growing Strong",
      description:
        "Expanded our collection to include rare succulents, flowering varieties, and medicinal herbs. Became a favorite among local plant enthusiasts.",
    },
    {
      year: "2019",
      title: "Scaling Up",
      description:
        "Established partnerships with wholesalers and landscaping firms across Telangana, reaching more customers while maintaining our quality standards.",
    },
    {
      year: "2021",
      title: "Going Digital",
      description:
        "Launched our online store, making it possible for customers across Hyderabad to browse and order plants from the comfort of their homes.",
    },
    {
      year: "2023",
      title: "Sustainable Future",
      description:
        "Introduced eco-conscious practices including organic soil mixes, biodegradable pots, and water-saving irrigation techniques.",
    },
    {
      year: "Today",
      title: "Growing Together",
      description:
        "Serving thousands of happy customers with an ever-expanding collection of premium plants, pots, and gardening supplies.",
      current: true,
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Interior Designer",
      image: "/images/testimonial-1.jpg",
      text: "The quality of plants from Srikanakadurga is unmatched. They've been my go-to nursery for all my client projects. The plants are always healthy and vibrant!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Home Gardener",
      image: "/images/testimonial-2.jpg",
      text: "I've been buying plants here for 5 years. The staff is incredibly knowledgeable and always helps me pick the right plants for my balcony garden.",
      rating: 5,
    },
    {
      name: "Ananya Reddy",
      role: "Plant Enthusiast",
      image: "/images/testimonial-3.jpg",
      text: "Best nursery in Hyderabad! Their rare plant collection is amazing, and the prices are very reasonable. Highly recommend to all plant lovers.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F4836] via-[#3a5a44] to-[#1a2e1f] py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-[#a8d5a2] text-sm font-semibold uppercase tracking-widest mb-4">
              Our Story
            </span>
            <h1
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              data-testid="text-about-headline"
            >
              Growing Dreams,
              <br />
              <span className="text-[#a8d5a2]">One Plant at a Time</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              From a small nursery in Ramanthapur to Hyderabad's most trusted
              destination for plants, our journey has been rooted in passion,
              quality, and love for all things green.
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8faf7"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-[#e5ebe3] hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-[#EAEFE9] rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[#2F4836]" />
                </div>
                <div className="font-heading text-3xl md:text-4xl font-bold text-[#2F4836] mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-[#8F9E8B]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24" data-testid="section-passion">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src="/images/founder-plants.png"
                      alt="Founder with nursery plants"
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                      loading="eager"
                      data-testid="img-about-collage-1"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src="/images/nursery-2.jpeg"
                      alt="Variety of indoor plants"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      data-testid="img-about-collage-2"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src="/images/nursery-3.jpeg"
                      alt="Flowering plants section"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      data-testid="img-about-collage-3"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src="/images/nursery-4.jpeg"
                      alt="Potted plants arrangement"
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#2F4836] text-white rounded-2xl p-6 shadow-xl hidden md:block">
                <div className="font-heading text-4xl font-bold">10+</div>
                <div className="text-sm text-white/80">
                  Years of
                  <br />
                  Excellence
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-block text-[#2F4836] text-sm font-semibold uppercase tracking-widest mb-4">
                Who We Are
              </span>
              <h2
                className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-6 leading-tight"
                data-testid="text-passion-heading"
              >
                Rooted in Passion,
                <br />
                <span className="text-[#2F4836]">Growing with Purpose</span>
              </h2>
              <p className="text-[#4A4A4A] text-lg leading-relaxed mb-6">
                Driven by a deep-rooted passion for nature, Srikanakadurga
                Nursery's journey from a small plot in Ramanthapur reflects our
                relentless ambition to bring the finest greenery to every home
                in Hyderabad.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed mb-8">
                We believe every space, from a modest balcony to a sprawling
                garden, deserves the transformative touch of nature. Our team of
                expert horticulturists handpicks and nurtures each plant with
                love and care, ensuring that only the healthiest specimens reach
                your doorstep.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <span className="inline-flex items-center gap-2 bg-[#2F4836] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#243a2b] transition-colors cursor-pointer">
                    Explore Plants
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link href="/contact">
                  <span className="inline-flex items-center gap-2 border-2 border-[#2F4836] text-[#2F4836] px-6 py-3 rounded-xl font-medium hover:bg-[#2F4836] hover:text-white transition-colors cursor-pointer">
                    Contact Us
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#2F4836] text-sm font-semibold uppercase tracking-widest mb-4">
              What We Stand For
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Our Core Values
            </h2>
            <p className="text-[#4A4A4A]">
              These principles guide everything we do, from selecting plants to
              serving our customers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-[#f8faf7] rounded-2xl p-6 hover:bg-[#2F4836] transition-all duration-300 border border-[#e5ebe3] hover:border-[#2F4836]"
              >
                <div className="w-14 h-14 mb-5 bg-[#EAEFE9] group-hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
                  <value.icon className="w-7 h-7 text-[#2F4836] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A] group-hover:text-white mb-3 transition-colors">
                  {value.title}
                </h3>
                <p className="text-sm text-[#4A4A4A] group-hover:text-white/80 leading-relaxed transition-colors">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        className="py-16 md:py-24 bg-[#f8faf7]"
        data-testid="section-journey"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#2F4836] text-sm font-semibold uppercase tracking-widest mb-4">
              Our Journey
            </span>
            <h2
              className="font-heading text-3xl md:text-4xl font-bold text-[#1A1A1A]"
              data-testid="text-journey-heading"
            >
              Milestones Along the Way
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2F4836] via-[#2F4836]/50 to-[#2F4836]/20 hidden sm:block md:-translate-x-1/2" />

            <div className="space-y-8 md:space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  data-testid={`timeline-item-${index}`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 md:-translate-x-1/2 hidden sm:block">
                    <div
                      className={`w-4 h-4 rounded-full border-4 ${
                        item.current
                          ? "bg-[#2F4836] border-[#a8d5a2]"
                          : "bg-white border-[#2F4836]"
                      }`}
                    />
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-1 pl-12 sm:pl-16 md:pl-0 ${
                      index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                    }`}
                  >
                    <div
                      className={`bg-white rounded-2xl p-6 shadow-md border border-[#e5ebe3] hover:shadow-lg transition-shadow ${
                        item.current ? "border-[#2F4836] border-2" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`font-heading text-2xl font-bold ${
                            item.current ? "text-[#2F4836]" : "text-[#1A1A1A]"
                          }`}
                        >
                          {item.year}
                        </span>
                        {item.current && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-white bg-[#2F4836] px-2 py-1 rounded-full">
                            Now
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#4A4A4A] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Strip */}
      <section className="py-4" data-testid="section-image-strip">
        <div className="flex gap-4 px-4 overflow-hidden">
          {[
            {
              src: "/images/nursery-5.jpeg",
              alt: "Garden supplies and pots",
            },
            {
              src: "/images/nursery-6.jpeg",
              alt: "Outdoor plants area",
            },
            {
              src: "/images/nursery-7.jpeg",
              alt: "Succulent collection",
            },
            {
              src: "/images/nursery-8.jpeg",
              alt: "Plant care area",
            },
          ].map((photo, i) => (
            <div
              key={i}
              className="flex-1 min-w-[200px] h-64 rounded-2xl overflow-hidden"
              data-testid={`img-strip-${i}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#2F4836] text-sm font-semibold uppercase tracking-widest mb-4">
              Testimonials
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-[#4A4A4A]">
              Don't just take our word for it. Here's what plant lovers in
              Hyderabad have to say about us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#f8faf7] rounded-2xl p-6 border border-[#e5ebe3] relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#2F4836]/10" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-[#4A4A4A] leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#EAEFE9] flex items-center justify-center text-[#2F4836] font-bold text-lg">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-[#8F9E8B]">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 md:py-24 bg-gradient-to-br from-[#2F4836] to-[#1a2e1f]"
        data-testid="section-cta"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your
            <br />
            <span className="text-[#a8d5a2]">Green Journey?</span>
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Visit our nursery in Ramanthapur or browse our collection online.
            Let us help you find the perfect plants for your space.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <span
                className="inline-flex items-center gap-2 bg-white text-[#2F4836] px-8 py-4 rounded-xl font-semibold hover:bg-[#a8d5a2] transition-colors cursor-pointer"
                data-testid="link-cta-shop"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
            <Link href="/contact">
              <span className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors cursor-pointer">
                Get Directions
                <ChevronRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-[#1a2e1f] py-12" data-testid="section-about-info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="text-center md:text-left flex flex-col md:flex-row items-center gap-4"
              data-testid="about-location"
            >
              <div className="w-14 h-14 bg-[#2F4836] rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#a8d5a2]" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-1">
                  Visit Us
                </h3>
                <p className="text-white/70 text-sm">
                  Ramanthapur, Hyderabad
                  <br />
                  Telangana - 500013
                </p>
              </div>
            </div>

            <div
              className="text-center md:text-left flex flex-col md:flex-row items-center gap-4"
              data-testid="about-phone"
            >
              <div className="w-14 h-14 bg-[#2F4836] rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[#a8d5a2]" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-1">
                  Call Us
                </h3>
                <p className="text-white/70 text-sm">
                  +91 98765 43210
                  <br />
                  <a
                    href="mailto:support@srikanakadurganursery.com"
                    className="hover:text-[#a8d5a2] transition-colors"
                  >
                    support@srikanakadurganursery.com
                  </a>
                </p>
              </div>
            </div>

            <div
              className="text-center md:text-left flex flex-col md:flex-row items-center gap-4"
              data-testid="about-hours"
            >
              <div className="w-14 h-14 bg-[#2F4836] rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#a8d5a2]" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-1">
                  Open Hours
                </h3>
                <p className="text-white/70 text-sm">
                  Mon - Sat: 8:00 AM - 7:00 PM
                  <br />
                  Sunday: 9:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
