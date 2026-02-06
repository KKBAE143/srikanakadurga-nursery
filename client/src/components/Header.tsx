import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu, X, LogOut, Heart, Star, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { products, type Product } from "@/lib/data";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
      .slice(0, 5); // Limit to 5 results
  }, [searchQuery]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleProductClick = (productId: string) => {
    setSearchQuery("");
    setSearchFocused(false);
    setMobileMenuOpen(false);
    setLocation(`/product/${productId}`);
  };

  const handleViewAll = () => {
    const query = searchQuery.trim();
    setSearchQuery("");
    setSearchFocused(false);
    setMobileMenuOpen(false);
    setLocation(`/shop?search=${encodeURIComponent(query)}`);
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

  const SearchDropdown = ({ results, isMobile = false }: { results: Product[]; isMobile?: boolean }) => {
    if (!searchFocused || !searchQuery.trim()) return null;

    return (
      <div
        className={`absolute ${isMobile ? "left-0 right-0 top-full mt-2" : "left-0 right-0 top-full mt-2"} bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50`}
        style={{ minWidth: isMobile ? "100%" : "320px" }}
      >
        {results.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">No plants found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {results.length} plant{results.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[#f8faf7] transition-colors border-b border-gray-50 last:border-0 text-left group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#f8faf7] to-[#EAEFE9] rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#1A1A1A] truncate group-hover:text-[#2F4836] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#2F4836]">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                      <div className="flex items-center gap-0.5 ml-auto">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-500">{product.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2F4836] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
            <button
              onClick={handleViewAll}
              className="w-full px-4 py-3 bg-[#2F4836] text-white text-sm font-medium hover:bg-[#243a2b] transition-colors flex items-center justify-center gap-2"
            >
              View all results
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  };

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
            {/* Desktop Search */}
            <div ref={searchRef} className="hidden md:block relative">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 focus-within:bg-white/20 focus-within:border-white/40 transition-all">
                <Search className="w-4 h-4 text-white/60 mr-2" />
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-32 lg:w-44 font-sans"
                  data-testid="input-search"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 p-0.5 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <SearchDropdown results={searchResults} />
            </div>

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
            {/* Mobile Search */}
            <div ref={mobileSearchRef} className="relative md:hidden mb-4">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2.5 border border-white/20">
                <Search className="w-4 h-4 text-white/60 mr-2" />
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-full font-sans"
                  data-testid="input-search-mobile"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 p-0.5 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <SearchDropdown results={searchResults} isMobile />
            </div>
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
