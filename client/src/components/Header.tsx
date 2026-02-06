import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X, LogOut, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    const cartRef = collection(db, "users", user.uid, "cart");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const count = snapshot.docs.reduce((sum, doc) => sum + (doc.data().quantity || 0), 0);
      setCartCount(count);
    }, () => setCartCount(0));
    return () => unsubscribe();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    setLocation("/");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1a2e1f] to-[#2F4836] shadow-lg" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" data-testid="link-logo">
            <div className="flex items-center gap-3 flex-shrink-0 group">
              <img
                src="/logo.png"
                alt="Srikanakadurganursery"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-full bg-white/10 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200"
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-heading font-bold text-white text-base lg:text-lg tracking-wide leading-tight">
                  Sri Kanakadurga
                </span>
                <span className="font-heading text-[#a8d5a2] text-xs lg:text-sm tracking-widest uppercase">
                  Nursery
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                <span
                  className={`font-heading text-sm tracking-wide transition-all duration-200 px-3 py-1.5 rounded-full ${
                    location === link.href
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 focus-within:bg-white/20 transition-colors">
              <Search className="w-4 h-4 text-white/60 mr-2" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-32 lg:w-40 font-sans"
                data-testid="input-search"
              />
            </form>

            {user ? (
              <>
                <Link href="/wishlist" data-testid="link-wishlist">
                  <div className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                    <Heart className="w-5 h-5" />
                  </div>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-1.5 text-white/80 hover:text-white transition-colors"
                    data-testid="button-user-menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || ""}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#a8d5a2] text-[#1a2e1f] flex items-center justify-center text-sm font-bold">
                        {(user.displayName || user.email || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 min-w-[200px] py-2 z-50" data-testid="user-dropdown">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-heading font-semibold text-[#1A1A1A] truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/profile">
                        <span
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          data-testid="link-profile"
                        >
                          My Profile
                        </span>
                      </Link>
                      <Link href="/wishlist">
                        <span
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          data-testid="link-wishlist-menu"
                        >
                          Wishlist
                        </span>
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                          data-testid="button-signout"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login" data-testid="link-user-icon">
                <div className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                  <User className="w-5 h-5" />
                </div>
              </Link>
            )}

            <Link href="/cart" data-testid="link-cart">
              <div className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-[#a8d5a2] text-[#1a2e1f] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    data-testid="text-cart-count"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <button
              className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10 pt-4" data-testid="nav-mobile">
            <form onSubmit={handleSearch} className="flex md:hidden items-center bg-white/10 rounded-full px-4 py-2.5 border border-white/20 mb-4">
              <Search className="w-4 h-4 text-white/60 mr-2" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-full font-sans"
                data-testid="input-search-mobile"
              />
            </form>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-mobile-${link.label.toLowerCase()}`}>
                  <span
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-heading text-sm tracking-wide block px-3 py-2.5 rounded-lg transition-colors ${
                      location === link.href
                        ? "bg-white/20 text-white font-semibold"
                        : "text-white/80 hover:bg-white/10"
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
