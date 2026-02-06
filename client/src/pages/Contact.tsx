import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { submitContactMessage } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone as PhoneIcon,
  Clock,
  Mail,
  Send,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      await submitContactMessage({
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setSent(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out! We'll get back to you soon.",
      });
      setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const faqs = [
    {
      question: "Do you offer plant delivery?",
      answer: "Yes! Free delivery on orders above ₹500 within Hyderabad. For other locations, please contact us.",
    },
    {
      question: "What if my plant arrives damaged?",
      answer: "We offer a 7-day freshness guarantee. Contact us within 24 hours with photos for a free replacement.",
    },
    {
      question: "Do you offer bulk orders?",
      answer: "Yes! We cater to corporate offices, events, and landscaping projects. Contact us for special pricing.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      <PageHero
        image="/images/contact-hero.webp"
        title="We Love to Hear from You"
      />

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <a
              href="https://maps.google.com/?q=Ramanthapur,Hyderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-5 border border-[#e5ebe3] hover:shadow-lg hover:border-[#2F4836]/30 transition-all group text-center"
            >
              <div className="w-10 h-10 mx-auto mb-3 bg-[#EAEFE9] group-hover:bg-[#2F4836] rounded-lg flex items-center justify-center transition-colors">
                <MapPin className="w-5 h-5 text-[#2F4836] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1">Visit Us</h3>
              <p className="text-xs text-[#8F9E8B]">Ramanthapur, Hyderabad</p>
            </a>

            <a
              href="tel:+919876543210"
              className="bg-white rounded-xl p-5 border border-[#e5ebe3] hover:shadow-lg hover:border-[#2F4836]/30 transition-all group text-center"
            >
              <div className="w-10 h-10 mx-auto mb-3 bg-[#EAEFE9] group-hover:bg-[#2F4836] rounded-lg flex items-center justify-center transition-colors">
                <PhoneIcon className="w-5 h-5 text-[#2F4836] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1">Call Us</h3>
              <p className="text-xs text-[#8F9E8B]">+91 98765 43210</p>
            </a>

            <a
              href="mailto:hello@skdnursery.com"
              className="bg-white rounded-xl p-5 border border-[#e5ebe3] hover:shadow-lg hover:border-[#2F4836]/30 transition-all group text-center"
            >
              <div className="w-10 h-10 mx-auto mb-3 bg-[#EAEFE9] group-hover:bg-[#2F4836] rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5 text-[#2F4836] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1">Email Us</h3>
              <p className="text-xs text-[#8F9E8B]">hello@skdnursery.com</p>
            </a>

            <div className="bg-white rounded-xl p-5 border border-[#e5ebe3] text-center">
              <div className="w-10 h-10 mx-auto mb-3 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#2F4836]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1">Hours</h3>
              <p className="text-xs text-[#8F9E8B]">Mon-Sat: 8AM - 7PM</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e5ebe3]">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[#8F9E8B] mb-4">
                      We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="text-[#2F4836] font-medium hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-6">
                      Send us a message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Your name"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                            data-testid="input-full-name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                            data-testid="input-email"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                            Phone
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                            Subject
                          </label>
                          <select
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, subject: e.target.value }))
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm cursor-pointer"
                          >
                            <option value="">Select topic</option>
                            <option value="general">General Inquiry</option>
                            <option value="order">Order Related</option>
                            <option value="bulk">Bulk Order</option>
                            <option value="care">Plant Care</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="How can we help you?"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, message: e.target.value }))
                          }
                          rows={4}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm resize-none"
                          data-testid="input-message"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-[#2F4836] text-white py-3 rounded-lg font-medium hover:bg-[#243a2b] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        data-testid="button-send"
                      >
                        {sending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Map & Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#e5ebe3]">
                <div className="aspect-[4/3] bg-[#EAEFE9] relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.0!2d78.5!3d17.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI0JzAwLjAiTiA3OMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                    title="Nursery Location"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1A1A1A] text-sm">Sri Kanakadurga Nursery</p>
                      <p className="text-xs text-[#8F9E8B]">Ramanthapur, Hyderabad</p>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Ramanthapur,Hyderabad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#2F4836] text-white text-xs font-medium rounded-lg hover:bg-[#243a2b] transition-colors"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl p-4 transition-colors"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Chat on WhatsApp</p>
                  <p className="text-xs text-white/80">Quick responses</p>
                </div>
              </a>

              {/* FAQs - Accordion */}
              <div className="bg-white rounded-2xl p-5 border border-[#e5ebe3]">
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mb-4">
                  Common Questions
                </h3>
                <div className="space-y-2">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-[#e5ebe3] last:border-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full flex items-center justify-between py-3 text-left"
                      >
                        <span className="text-sm font-medium text-[#1A1A1A] pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#8F9E8B] flex-shrink-0 transition-transform ${
                            openFaq === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openFaq === index && (
                        <p className="text-sm text-[#4A4A4A] pb-3 leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
