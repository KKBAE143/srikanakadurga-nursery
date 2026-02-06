import { MapPin, Phone, Clock, Leaf, Heart, Users, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

const nurseryPhotos = [
  { src: "/images/nursery-1.jpeg", alt: "Nursery entrance and plant display" },
  { src: "/images/nursery-2.jpeg", alt: "Variety of indoor plants" },
  { src: "/images/nursery-3.jpeg", alt: "Flowering plants section" },
  { src: "/images/nursery-4.jpeg", alt: "Potted plants arrangement" },
  { src: "/images/nursery-5.jpeg", alt: "Garden supplies and pots" },
  { src: "/images/nursery-6.jpeg", alt: "Outdoor plants area" },
  { src: "/images/nursery-7.jpeg", alt: "Succulent collection" },
  { src: "/images/nursery-8.jpeg", alt: "Plant care and maintenance area" },
  { src: "/images/nursery-9.jpeg", alt: "Decorative plants display" },
  { src: "/images/nursery-10.jpeg", alt: "Nursery panorama" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <PageHero
        image="/images/hero-leaves.webp"
        title="About Us"
        subtitle="Our story of growing green since day one"
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-about-story">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#8F9E8B] text-sm font-heading tracking-wider uppercase mb-2">Our Story</p>
            <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] uppercase tracking-wide mb-4">
              Srikanakadurga Nursery
            </h2>
            <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">
              Nestled in the heart of Ramanthapur, Hyderabad, Srikanakadurganursery has been
              a haven for plant lovers and gardening enthusiasts. What started as a small
              passion project has blossomed into one of the most trusted nurseries in the city.
            </p>
            <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">
              We believe every home deserves the touch of nature. Our team of expert horticulturists
              carefully selects and nurtures each plant, ensuring you receive only the healthiest
              and most beautiful specimens for your garden, balcony, or indoor space.
            </p>
            <p className="text-[#4A4A4A] text-sm leading-relaxed">
              From rare succulents to towering palms, from fragrant flowering plants to
              air-purifying indoor varieties, we offer an extensive collection to suit every taste
              and budget. Visit us and let us help you bring nature closer to your everyday life.
            </p>
          </div>

          <div className="rounded-sm overflow-hidden">
            <img
              src="/images/nursery-1.jpeg"
              alt="Srikanakadurga Nursery"
              className="w-full h-[350px] object-cover"
              loading="lazy"
              decoding="async"
              data-testid="img-about-main"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16" data-testid="section-about-values">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#8F9E8B] text-sm font-heading tracking-wider uppercase mb-2">What We Stand For</p>
            <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] uppercase tracking-wide">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Leaf,
                title: "Quality Plants",
                desc: "Every plant is handpicked and nurtured by our team of expert gardeners.",
              },
              {
                icon: Heart,
                title: "Passion for Green",
                desc: "We are driven by a deep love for nature and sustainable gardening practices.",
              },
              {
                icon: Users,
                title: "Community First",
                desc: "We educate and support our customers with free gardening tips and workshops.",
              },
              {
                icon: Award,
                title: "Trusted Service",
                desc: "Years of experience delivering healthy plants with a satisfaction guarantee.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6" data-testid={`about-value-${i}`}>
                <div className="w-12 h-12 bg-[#EAEFE9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-[#2F4836]" />
                </div>
                <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-nursery-gallery">
        <div className="text-center mb-10">
          <p className="text-[#8F9E8B] text-sm font-heading tracking-wider uppercase mb-2">Visit Our Space</p>
          <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] uppercase tracking-wide">
            Our Nursery
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {nurseryPhotos.slice(0, 4).map((photo, i) => (
            <div
              key={i}
              className={`rounded-sm overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              data-testid={`img-nursery-${i}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
                style={{ minHeight: i === 0 ? "300px" : "150px" }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
          {nurseryPhotos.slice(4).map((photo, i) => (
            <div
              key={i + 4}
              className="rounded-sm overflow-hidden aspect-square"
              data-testid={`img-nursery-${i + 4}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#2F4836] py-16" data-testid="section-about-info">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wide">
              Visit Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div data-testid="about-location">
              <MapPin className="w-6 h-6 text-white/80 mx-auto mb-3" />
              <h3 className="font-heading text-sm font-semibold text-white mb-2">Location</h3>
              <p className="text-white/70 text-sm">
                Ramanthapur, Hyderabad<br />
                Telangana - 500013
              </p>
            </div>
            <div data-testid="about-phone">
              <Phone className="w-6 h-6 text-white/80 mx-auto mb-3" />
              <h3 className="font-heading text-sm font-semibold text-white mb-2">Contact</h3>
              <p className="text-white/70 text-sm">
                +91 98765 43210<br />
                support@srikanakadurganursery.com
              </p>
            </div>
            <div data-testid="about-hours">
              <Clock className="w-6 h-6 text-white/80 mx-auto mb-3" />
              <h3 className="font-heading text-sm font-semibold text-white mb-2">Open Hours</h3>
              <p className="text-white/70 text-sm">
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
