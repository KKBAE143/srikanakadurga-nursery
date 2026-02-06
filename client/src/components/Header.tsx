import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Leaf, Menu, X, LogOut, Heart } from "lucide-react";
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
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-white rounded-full px-3 py-1.5 border border-[#dde3dc]">
              <Search className="w-4 h-4 text-[#8F9E8B] mr-2" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[#4A4A4A] placeholder:text-[#8F9E8B] outline-none w-32 lg:w-44 font-sans"
                data-testid="input-search"
              />
            </form>

            {user ? (
              <>
                <Link href="/wishlist" data-testid="link-wishlist">
                  <div className="p-2 text-[#4A4A4A] hover:text-[#2F4836] transition-colors">
                    <Heart className="w-5 h-5" />
                  </div>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 text-[#4A4A4A] hover:text-[#2F4836] transition-colors"
                    data-testid="button-user-menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || ""}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#2F4836] text-white flex items-center justify-center text-xs font-semibold">
                        {(user.displayName || user.email || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-sm shadow-lg border border-[#dde3dc] min-w-[180px] py-1 z-50" data-testid="user-dropdown">
                      <div className="px-4 py-2 border-b border-[#eee]">
                        <p className="text-xs font-heading font-semibold text-[#1A1A1A] truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-[10px] text-[#8F9E8B] truncate">{user.email}</p>
                      </div>
                      <Link href="/profile">
                        <span
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-[#4A4A4A] hover:bg-[#f8f9f7] cursor-pointer"
                          data-testid="link-profile"
                        >
                          My Profile
                        </span>
                      </Link>
                      <Link href="/wishlist">
                        <span
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-[#4A4A4A] hover:bg-[#f8f9f7] cursor-pointer"
                          data-testid="link-wishlist-menu"
                        >
                          Wishlist
                        </span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#f8f9f7] flex items-center gap-2"
                        data-testid="button-signout"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login" data-testid="link-user-icon">
                <div className="p-2 text-[#4A4A4A] hover:text-[#2F4836] transition-colors">
                  <User className="w-5 h-5" />
                </div>
              </Link>
            )}

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
            <form onSubmit={handleSearch} className="flex sm:hidden items-center bg-white rounded-full px-3 py-1.5 border border-[#dde3dc] mb-3">
              <Search className="w-4 h-4 text-[#8F9E8B] mr-2" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[#4A4A4A] placeholder:text-[#8F9E8B] outline-none w-full font-sans"
                data-testid="input-search-mobile"
              />
            </form>
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
