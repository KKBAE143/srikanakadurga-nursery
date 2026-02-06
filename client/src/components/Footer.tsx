import { Leaf } from "lucide-react";
import { Link } from "wouter";
import { SiInstagram, SiX, SiFacebook, SiWhatsapp } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#2F4836] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="font-heading font-semibold text-base mb-4 tracking-wide">Contact Us</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>Ramanthapur, Hyderabad</p>
              <p>Telangana - 500013</p>
              <p className="mt-3">+91 98765 43210</p>
              <p>support@srikanakadurganursery.com</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-base mb-4 tracking-wide">Quick Links</h3>
            <div className="space-y-2 text-sm text-white/80">
              <Link href="/shop"><span className="block hover:text-white transition-colors" data-testid="link-footer-shop">Shop All</span></Link>
              <Link href="/blog"><span className="block hover:text-white transition-colors" data-testid="link-footer-blog">Blog</span></Link>
              <Link href="/contact"><span className="block hover:text-white transition-colors" data-testid="link-footer-contact">Contact</span></Link>
              <p>Privacy Policy</p>
              <p>Terms of Use</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-base mb-4 tracking-wide">My Account</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>My Profile</p>
              <p>My Orders</p>
              <Link href="/cart"><span className="block hover:text-white transition-colors" data-testid="link-footer-cart">My Cart</span></Link>
              <p>Wishlist</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-base mb-4 tracking-wide">Newsletter</h3>
            <p className="text-sm text-white/80 mb-4">Join to receive gardening tips, offers, news & more</p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent border-b border-white/40 text-white placeholder:text-white/50 text-sm py-2 outline-none focus:border-white transition-colors"
                data-testid="input-newsletter-email"
              />
              <button
                className="bg-[#8F9E8B] text-white py-2.5 px-6 text-sm font-heading tracking-wide hover:bg-[#7a8b76] transition-colors w-fit"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm text-white/80 mb-3">Follow us</p>
              <div className="flex items-center gap-3">
                <SiInstagram className="w-5 h-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
                <SiX className="w-5 h-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
                <SiFacebook className="w-5 h-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
                <SiWhatsapp className="w-5 h-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-sm text-white/60" data-testid="text-copyright">
            Powered by Srikanakadurganursery &copy; 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
