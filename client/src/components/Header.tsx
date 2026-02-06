import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CartItem } from "@shared/schema";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cartItems } = useQuery<(CartItem & { product?: { name: string; price: number; image: string } })[]>({
    queryKey: ["/api/cart"],
  });

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#EAEFE9] border-b border-[#dde3dc]" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" data-testid="link-logo">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Leaf className="w-5 h-5 text-[#2F4836]" />
              <span className="font-heading font-semibold text-[#2F4836] text-sm sm:text-base tracking-wide">
                Srikanakadurganursery
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                <span
                  className={`font-heading text-sm tracking-wide transition-colors ${
                    location === link.href
                      ? "text-[#2F4836] font-semibold underline underline-offset-4"
                      : "text-[#4A4A4A] hover:text-[#2F4836]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-white rounded-full px-3 py-1.5 border border-[#dde3dc]">
              <Search className="w-4 h-4 text-[#8F9E8B] mr-2" />
              <input
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[#4A4A4A] placeholder:text-[#8F9E8B] outline-none w-32 lg:w-44 font-sans"
                data-testid="input-search"
              />
            </div>

            <Link href="/shop" data-testid="link-user-icon">
              <div className="p-2 text-[#4A4A4A] hover:text-[#2F4836] transition-colors">
                <User className="w-5 h-5" />
              </div>
            </Link>

            <Link href="/cart" data-testid="link-cart">
              <div className="relative p-2 text-[#4A4A4A] hover:text-[#2F4836] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-[#2F4836] text-white text-[10px] font-medium w-4 h-4 flex items-center justify-center rounded-full"
                    data-testid="text-cart-count"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <button
              className="md:hidden p-2 text-[#4A4A4A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#dde3dc] pt-3" data-testid="nav-mobile">
            <div className="flex sm:hidden items-center bg-white rounded-full px-3 py-1.5 border border-[#dde3dc] mb-3">
              <Search className="w-4 h-4 text-[#8F9E8B] mr-2" />
              <input
                type="text"
                placeholder="Search products"
                className="bg-transparent text-sm text-[#4A4A4A] placeholder:text-[#8F9E8B] outline-none w-full font-sans"
                data-testid="input-search-mobile"
              />
            </div>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-mobile-${link.label.toLowerCase()}`}>
                  <span
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-heading text-sm tracking-wide block ${
                      location === link.href
                        ? "text-[#2F4836] font-semibold"
                        : "text-[#4A4A4A]"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
