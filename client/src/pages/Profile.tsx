import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCartItems, getWishlistItems } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Heart,
  ShoppingCart,
  ChevronRight,
  Shield,
  Settings,
  Bell,
  HelpCircle,
  Phone,
  MapPin,
  Package,
  Leaf,
  Star,
  Clock,
  Check,
  X,
} from "lucide-react";

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const { toast } = useToast();

  // Settings state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    plantCare: true,
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "Telangana",
    pincode: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) setLocation("/login");
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (!user) return;
    const loadCounts = async () => {
      const [cart, wishlist] = await Promise.all([
        getCartItems(user.uid),
        getWishlistItems(user.uid),
      ]);
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      setWishlistCount(wishlist.length);
    };
    loadCounts();
  }, [user]);

  if (authLoading || !user) return null;

  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handleSaveAddress = () => {
    if (!address.street || !address.city || !address.pincode) {
      toast({
        title: "Missing fields",
        description: "Please fill in all address fields.",
        variant: "destructive",
      });
      return;
    }
    setShowAddressModal(false);
    toast({
      title: "Address saved",
      description: "Your delivery address has been updated.",
    });
  };

  const createdDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const lastSignIn = user.metadata.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const quickLinks = [
    {
      icon: ShoppingCart,
      label: "My Cart",
      description: `${cartCount} item${cartCount !== 1 ? "s" : ""} in cart`,
      href: "/cart",
    },
    {
      icon: Heart,
      label: "Wishlist",
      description: `${wishlistCount} saved plant${wishlistCount !== 1 ? "s" : ""}`,
      href: "/wishlist",
    },
    {
      icon: Package,
      label: "Shop Plants",
      description: "Browse our collection",
      href: "/shop",
    },
    {
      icon: HelpCircle,
      label: "Need Help?",
      description: "Contact support",
      href: "/contact",
    },
  ];

  const accountStats = [
    { icon: Calendar, label: "Member Since", value: createdDate },
    { icon: Clock, label: "Last Sign In", value: lastSignIn },
    { icon: Shield, label: "Account Status", value: "Verified", valueColor: "text-[#2F4836]" },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2F4836] to-[#1a2e1f] pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || ""}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-white/20 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#a8d5a2] to-[#7cb876] text-[#1a2e1f] flex items-center justify-center text-4xl font-bold ring-4 ring-white/20 shadow-xl">
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2F4836] rounded-full flex items-center justify-center ring-4 ring-[#1a2e1f]">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1
                  className="font-heading text-2xl sm:text-3xl font-bold text-white"
                  data-testid="text-profile-name"
                >
                  {user.displayName || "Welcome"}
                </h1>
                <span className="px-2 py-0.5 bg-[#a8d5a2]/20 text-[#a8d5a2] text-xs font-medium rounded-full">
                  Member
                </span>
              </div>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-white/40 text-xs mt-2 flex items-center gap-2">
                <Leaf className="w-3 h-3" />
                Thank you for being part of our green family
              </p>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
              data-testid="button-profile-signout"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Main Content - Overlapping Cards */}
      <section className="-mt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className="bg-white rounded-xl p-5 border border-[#e5ebe3] hover:border-[#2F4836]/30 hover:shadow-lg transition-all cursor-pointer group"
                  data-testid={`link-profile-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  <div className="w-10 h-10 bg-[#EAEFE9] rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#2F4836] transition-colors">
                    <link.icon className="w-5 h-5 text-[#2F4836] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-0.5">
                    {link.label}
                  </h4>
                  <p className="text-xs text-[#8F9E8B]">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Account Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-xl border border-[#e5ebe3] overflow-hidden">
                <div className="flex border-b border-[#e5ebe3]">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "overview"
                        ? "text-[#2F4836] border-b-2 border-[#2F4836] bg-[#f8faf7]"
                        : "text-[#8F9E8B] hover:text-[#1A1A1A]"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "settings"
                        ? "text-[#2F4836] border-b-2 border-[#2F4836] bg-[#f8faf7]"
                        : "text-[#8F9E8B] hover:text-[#1A1A1A]"
                    }`}
                  >
                    Settings
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "overview" ? (
                    <div className="space-y-6">
                      {/* Account Details */}
                      <div>
                        <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#2F4836]" />
                          Account Details
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="bg-[#f8faf7] rounded-lg p-4">
                            <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider font-medium mb-1">
                              Full Name
                            </p>
                            <p className="text-sm text-[#1A1A1A] font-medium">
                              {user.displayName || "Not set"}
                            </p>
                          </div>
                          <div className="bg-[#f8faf7] rounded-lg p-4">
                            <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider font-medium mb-1">
                              Email Address
                            </p>
                            <p className="text-sm text-[#1A1A1A] font-medium truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="bg-[#f8faf7] rounded-lg p-4">
                            <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider font-medium mb-1">
                              Phone Number
                            </p>
                            <p className="text-sm text-[#1A1A1A] font-medium">
                              {user.phoneNumber || "Not set"}
                            </p>
                          </div>
                          <div className="bg-[#f8faf7] rounded-lg p-4">
                            <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider font-medium mb-1">
                              Account Type
                            </p>
                            <p className="text-sm text-[#1A1A1A] font-medium">
                              {user.providerData[0]?.providerId === "google.com"
                                ? "Google Account"
                                : "Email Account"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account Stats */}
                      <div>
                        <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                          <Star className="w-4 h-4 text-[#2F4836]" />
                          Account Activity
                        </h3>
                        <div className="space-y-3">
                          {accountStats.map((stat, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-3 border-b border-[#e5ebe3] last:border-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
                                  <stat.icon className="w-4 h-4 text-[#2F4836]" />
                                </div>
                                <span className="text-sm text-[#8F9E8B]">{stat.label}</span>
                              </div>
                              <span
                                className={`text-sm font-medium ${stat.valueColor || "text-[#1A1A1A]"}`}
                              >
                                {stat.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Notifications Section */}
                      <div>
                        <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                          <Bell className="w-4 h-4 text-[#2F4836]" />
                          Notification Preferences
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-[#f8faf7] rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-[#1A1A1A]">Order Updates</p>
                              <p className="text-xs text-[#8F9E8B]">Get notified about your orders</p>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle("orderUpdates")}
                              className={`w-12 h-6 rounded-full transition-colors relative ${
                                notifications.orderUpdates ? "bg-[#2F4836]" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                  notifications.orderUpdates ? "right-1" : "left-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-[#f8faf7] rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-[#1A1A1A]">Promotions & Offers</p>
                              <p className="text-xs text-[#8F9E8B]">Receive special deals and discounts</p>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle("promotions")}
                              className={`w-12 h-6 rounded-full transition-colors relative ${
                                notifications.promotions ? "bg-[#2F4836]" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                  notifications.promotions ? "right-1" : "left-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-[#f8faf7] rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-[#1A1A1A]">Plant Care Tips</p>
                              <p className="text-xs text-[#8F9E8B]">Weekly tips for your plants</p>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle("plantCare")}
                              className={`w-12 h-6 rounded-full transition-colors relative ${
                                notifications.plantCare ? "bg-[#2F4836]" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                  notifications.plantCare ? "right-1" : "left-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Address Section */}
                      <div>
                        <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#2F4836]" />
                          Delivery Address
                        </h3>

                        {showAddressModal ? (
                          <div className="bg-[#f8faf7] rounded-lg p-4 space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-[#8F9E8B] uppercase tracking-wider mb-1.5">
                                Street Address
                              </label>
                              <input
                                type="text"
                                value={address.street}
                                onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
                                placeholder="123 Green Street, Apt 4B"
                                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-white text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-[#8F9E8B] uppercase tracking-wider mb-1.5">
                                  City
                                </label>
                                <input
                                  type="text"
                                  value={address.city}
                                  onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                                  placeholder="Hyderabad"
                                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-white text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#8F9E8B] uppercase tracking-wider mb-1.5">
                                  Pincode
                                </label>
                                <input
                                  type="text"
                                  value={address.pincode}
                                  onChange={(e) => setAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                                  placeholder="500013"
                                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-white text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={handleSaveAddress}
                                className="flex-1 bg-[#2F4836] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#243a2b] transition-colors"
                              >
                                Save Address
                              </button>
                              <button
                                onClick={() => setShowAddressModal(false)}
                                className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#8F9E8B] border border-[#e5ebe3] hover:bg-[#EAEFE9] transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAddressModal(true)}
                            className="w-full flex items-center justify-between p-4 bg-[#f8faf7] rounded-lg hover:bg-[#EAEFE9] transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#e5ebe3]">
                                <MapPin className="w-5 h-5 text-[#2F4836]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#1A1A1A]">
                                  {address.street ? address.street : "Add Delivery Address"}
                                </p>
                                <p className="text-xs text-[#8F9E8B]">
                                  {address.city ? `${address.city}, ${address.pincode}` : "No address saved yet"}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#8F9E8B]" />
                          </button>
                        )}
                      </div>

                      {/* Other Settings */}
                      <div>
                        <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-[#2F4836]" />
                          Other Settings
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-[#f8faf7] rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#e5ebe3]">
                                <Shield className="w-5 h-5 text-[#2F4836]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#1A1A1A]">Privacy & Security</p>
                                <p className="text-xs text-[#8F9E8B]">Your account is secure</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-[#EAEFE9] text-[#2F4836] text-xs font-medium rounded-full">
                              Secure
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-[#f8faf7] rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#e5ebe3]">
                                <Settings className="w-5 h-5 text-[#2F4836]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#1A1A1A]">Language</p>
                                <p className="text-xs text-[#8F9E8B]">English (India)</p>
                              </div>
                            </div>
                            <span className="text-xs text-[#8F9E8B]">EN-IN</span>
                          </div>
                        </div>
                      </div>

                      {/* Sign Out - Mobile */}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left md:hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-red-100">
                            <LogOut className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-600">Sign Out</p>
                            <p className="text-xs text-red-400">Log out of your account</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Need Help Card */}
              <div className="bg-gradient-to-br from-[#2F4836] to-[#1a2e1f] rounded-xl p-6 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-white/70 text-sm mb-4">
                  Our team is here to help you with any questions about plants or orders.
                </p>
                <Link href="/contact">
                  <button className="w-full bg-white text-[#2F4836] py-2.5 rounded-lg text-sm font-medium hover:bg-[#a8d5a2] transition-colors">
                    Contact Support
                  </button>
                </Link>
              </div>

              {/* Membership Benefits */}
              <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
                <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#2F4836]" />
                  Member Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 bg-[#EAEFE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#2F4836]" />
                    </div>
                    <span className="text-[#4A4A4A]">Free delivery on orders above ₹500</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 bg-[#EAEFE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#2F4836]" />
                    </div>
                    <span className="text-[#4A4A4A]">7-day freshness guarantee</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 bg-[#EAEFE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#2F4836]" />
                    </div>
                    <span className="text-[#4A4A4A]">Expert plant care support</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 bg-[#EAEFE9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#2F4836]" />
                    </div>
                    <span className="text-[#4A4A4A]">Early access to new arrivals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
