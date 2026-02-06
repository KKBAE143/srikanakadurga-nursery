import { Link } from "wouter";
import { ArrowRight, MapPin, Phone, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-4" data-testid="section-about-headline">
        <h1
          className="font-heading text-[clamp(3rem,10vw,8rem)] font-bold text-[#1A1A1A] uppercase tracking-wider leading-[0.9]"
          data-testid="text-about-headline"
        >
          Our Story,
          <br />
          <span className="text-[#2F4836]">Our Roots</span>
        </h1>
        <p className="mt-4 text-[#4A4A4A] text-base tracking-wide uppercase font-heading">The Srikanakadurga Story</p>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12" data-testid="section-passion">
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="col-span-12 md:col-span-7 relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 overflow-hidden" style={{ maxHeight: "420px" }}>
                <img
                  src="/images/founder-plants.png"
                  alt="Founder with nursery plants"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="eager"
                  data-testid="img-about-collage-1"
                />
              </div>
              <div className="overflow-hidden" style={{ maxHeight: "220px" }}>
                <img
                  src="/images/nursery-2.jpeg"
                  alt="Variety of indoor plants"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  data-testid="img-about-collage-2"
                />
              </div>
              <div className="overflow-hidden" style={{ maxHeight: "220px" }}>
                <img
                  src="/images/nursery-3.jpeg"
                  alt="Flowering plants section"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  data-testid="img-about-collage-3"
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 flex flex-col justify-center md:pl-4 pt-8 md:pt-16">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] uppercase tracking-[0.15em] mb-6" data-testid="text-passion-heading">
              Rooted in Nature
            </h2>
            <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">
              Driven by a deep-rooted passion, Srikanakadurga Nursery's journey from
              a small plot in Ramanthapur reflects our relentless ambition to bring the
              finest greenery to every home in Hyderabad.
            </p>
            <p className="text-[#4A4A4A] text-sm leading-relaxed">
              We believe every space, from a modest balcony to a sprawling garden,
              deserves the transformative touch of nature. Our team of expert
              horticulturists handpicks and nurtures each plant with care.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12" data-testid="section-the-nursery">
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="col-span-12 md:col-span-5 order-2 md:order-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1 overflow-hidden" style={{ maxHeight: "240px" }}>
                <img
                  src="/images/nursery-4.jpeg"
                  alt="Potted plants arrangement"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  data-testid="img-about-nursery-1"
                />
              </div>
              <div className="col-span-1 row-span-2 overflow-hidden" style={{ maxHeight: "490px" }}>
                <img
                  src="/images/nursery-5.jpeg"
                  alt="Garden supplies and pots"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  data-testid="img-about-nursery-2"
                />
              </div>
              <div className="col-span-1 overflow-hidden" style={{ maxHeight: "240px" }}>
                <img
                  src="/images/nursery-6.jpeg"
                  alt="Outdoor plants area"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  data-testid="img-about-nursery-3"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-[#2F4836]/20 pt-6">
              <p className="font-heading text-xs font-semibold text-[#2F4836] uppercase tracking-[0.2em] mb-3" data-testid="text-the-nursery-label">
                The Nursery
              </p>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Nestled in the heart of Ramanthapur, Hyderabad, our nursery
                has been a haven for plant lovers and gardening enthusiasts for years.
                What started as a humble passion project has grown into one of the
                most trusted green destinations in the city.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 order-1 md:order-2 flex flex-col">
            <div className="overflow-hidden" style={{ maxHeight: "360px" }}>
              <img
                src="/images/nursery-7.jpeg"
                alt="Succulent collection"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
                data-testid="img-about-nursery-4"
              />
            </div>
            <h2
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] uppercase tracking-[0.12em] mt-6 leading-tight"
              data-testid="text-nursery-tagline"
            >
              Srikanakadurga is
              <br />
              <span className="text-[#2F4836]">Where Green Comes to Life</span>
            </h2>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-24" data-testid="section-journey">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A] uppercase tracking-[0.2em] text-center mb-16" data-testid="text-journey-heading">
          Our Journey
        </h2>

        <div className="relative">
          <div className="absolute left-[140px] md:left-[180px] top-0 bottom-0 w-px bg-[#2F4836]/20 hidden sm:block" />

          {[
            {
              year: "2015",
              text: "Srikanakadurga Nursery is founded in Ramanthapur, Hyderabad, starting with a humble collection of indoor plants and a dream to make Hyderabad greener.",
            },
            {
              year: "2017",
              text: "Expansion of our plant collection to include rare succulents, flowering varieties, and medicinal herbs. Quickly becoming a favorite among local plant enthusiasts.",
            },
            {
              year: "2019",
              text: "Established partnerships with wholesale suppliers and landscaping firms across Telangana, scaling our reach while maintaining our commitment to quality.",
              featured: true,
            },
            {
              year: "2021",
              text: "Launched our online presence, making it possible for customers across Hyderabad to browse and order plants from the comfort of their homes.",
            },
            {
              year: "2023",
              text: "Introduced sustainable and eco-conscious gardening practices, including organic soil mixes, biodegradable pots, and water-saving techniques.",
            },
            {
              year: "Present",
              text: "Srikanakadurga continues to grow, serving thousands of happy customers with an ever-expanding collection of premium plants, pots, and gardening supplies.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start mb-10 last:mb-0 group" data-testid={`timeline-item-${i}`}>
              <div className="w-[130px] md:w-[170px] flex-shrink-0 text-right pr-6">
                <span
                  className={`font-heading font-bold text-[#1A1A1A] uppercase tracking-wider ${
                    item.featured
                      ? "text-3xl md:text-4xl"
                      : "text-xl md:text-2xl"
                  }`}
                >
                  {item.year}
                </span>
              </div>

              <div className="relative flex-shrink-0 w-3 mt-2 hidden sm:block">
                <div className="w-3 h-3 rounded-full bg-[#2F4836] border-2 border-[#EAEFE9]" />
              </div>

              <div className="pl-4 sm:pl-8 flex-1 pt-0.5">
                <p className="text-[#4A4A4A] text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full overflow-hidden py-4" data-testid="section-image-strip">
        <div className="flex gap-3 px-4">
          {[
            { src: "/images/nursery-8.jpeg", alt: "Plant care and maintenance area" },
            { src: "/images/nursery-9.jpeg", alt: "Decorative plants display" },
            { src: "/images/nursery-10.jpeg", alt: "Nursery panorama" },
            { src: "/images/plant-delivery.png", alt: "Plant delivery truck" },
          ].map((photo, i) => (
            <div
              key={i}
              className="flex-1 min-w-0 overflow-hidden"
              style={{ maxHeight: "320px" }}
              data-testid={`img-strip-${i}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 text-center" data-testid="section-cta">
        <Link href="/shop">
          <span
            className="inline-flex items-center gap-3 font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] uppercase tracking-[0.15em] group cursor-pointer"
            data-testid="link-cta-shop"
          >
            Visit Our Nursery
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
          </span>
        </Link>
      </section>

      <section className="w-full overflow-hidden border-t border-b border-[#2F4836]/15 py-4" data-testid="section-marquee">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8 font-heading text-sm text-[#8F9E8B] uppercase tracking-[0.3em] flex items-center gap-4">
              From Hyderabad With Green
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2F4836]/40" />
            </span>
          ))}
        </div>
      </section>

      <section className="bg-[#2F4836] py-16" data-testid="section-about-info">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div data-testid="about-location">
              <MapPin className="w-5 h-5 text-white/60 mx-auto mb-3" />
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-[0.2em] mb-2">Location</h3>
              <p className="text-white/60 text-sm">
                Ramanthapur, Hyderabad<br />
                Telangana - 500013
              </p>
            </div>
            <div data-testid="about-phone">
              <Phone className="w-5 h-5 text-white/60 mx-auto mb-3" />
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-[0.2em] mb-2">Contact</h3>
              <p className="text-white/60 text-sm">
                +91 98765 43210<br />
                support@srikanakadurganursery.com
              </p>
            </div>
            <div data-testid="about-hours">
              <Clock className="w-5 h-5 text-white/60 mx-auto mb-3" />
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-[0.2em] mb-2">Open Hours</h3>
              <p className="text-white/60 text-sm">
                Mon - Sat: 8:00 AM - 7:00 PM<br />
                Sunday: 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}