import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { submitContactMessage } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone as PhoneIcon, Clock, Mail } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      toast({ title: "Missing fields", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      await submitContactMessage({
        ...formData,
        createdAt: new Date().toISOString(),
      });
      toast({ title: "Message Sent", description: "Thank you for reaching out! We'll get back to you soon." });
      setFormData({ fullName: "", email: "", message: "" });
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <PageHero
        image="/images/contact-hero.webp"
        title="We Love to Hear from You"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div data-testid="contact-form-section">
            <h2 className="font-serif text-3xl italic text-[#1A1A1A] mb-8" data-testid="text-lets-talk">
              Let's Talk
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#ddd] text-sm text-[#1A1A1A] placeholder:text-[#999] py-3 outline-none focus:border-[#2F4836] transition-colors font-sans"
                  data-testid="input-full-name"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#ddd] text-sm text-[#1A1A1A] placeholder:text-[#999] py-3 outline-none focus:border-[#2F4836] transition-colors font-sans"
                  data-testid="input-email"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  rows={1}
                  className="w-full bg-transparent border-b border-[#ddd] text-sm text-[#1A1A1A] placeholder:text-[#999] py-3 outline-none focus:border-[#2F4836] transition-colors font-sans resize-none"
                  data-testid="input-message"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="bg-[#2F4836] text-white px-10 py-3 font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors disabled:opacity-60"
                data-testid="button-send"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>

          <div className="space-y-8" data-testid="contact-info-section">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#2F4836] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-heading text-base font-bold text-[#1A1A1A] mb-1 tracking-wide">Address</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Ramanthapur, Hyderabad,<br />
                  Telangana - 500013
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <PhoneIcon className="w-5 h-5 text-[#2F4836] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-heading text-base font-bold text-[#1A1A1A] mb-1 tracking-wide">Contact</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  +91 98765 43210<br />
                  support@srikanakadurganursery.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#2F4836] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-heading text-base font-bold text-[#1A1A1A] mb-1 tracking-wide">Timings</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Monday to Saturday: 8 am - 8 pm<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#2F4836] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-heading text-base font-bold text-[#1A1A1A] mb-1 tracking-wide">Follow Us</h3>
                <p className="text-sm text-[#4A4A4A]">
                  Instagram &middot; Facebook &middot; YouTube
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
