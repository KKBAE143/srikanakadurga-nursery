import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Mail, Calendar, LogOut, Heart, ShoppingCart } from "lucide-react";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) setLocation("/login");
  }, [user, setLocation]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
  };

  const createdDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "N/A";

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] tracking-wide uppercase mb-8" data-testid="text-profile-title">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          <div className="bg-white rounded-sm p-6 text-center h-fit">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || ""}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#2F4836] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]" data-testid="text-profile-name">
              {user.displayName || "User"}
            </h2>
            <p className="text-xs text-[#8F9E8B] mt-1">{user.email}</p>

            <button
              onClick={handleSignOut}
              className="mt-6 w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 py-2.5 font-heading text-xs tracking-wider uppercase hover:bg-red-50 transition-colors"
              data-testid="button-profile-signout"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-sm p-6">
              <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">
                Account Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#8F9E8B]" />
                  <div>
                    <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider font-heading">Name</p>
                    <p className="text-sm text-[#1A1A1A]">{user.displayName || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#8F9E8B]" />
                  <div>
                    <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider font-heading">Email</p>
                    <p className="text-sm text-[#1A1A1A]">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#8F9E8B]" />
                  <div>
                    <p className="text-[10px] text-[#8F9E8B] uppercase tracking-wider font-heading">Member Since</p>
                    <p className="text-sm text-[#1A1A1A]">{createdDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/cart">
                <div className="bg-white rounded-sm p-6 hover:shadow-md transition-shadow cursor-pointer" data-testid="link-profile-cart">
                  <ShoppingCart className="w-6 h-6 text-[#2F4836] mb-3" />
                  <h4 className="font-heading text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    My Cart
                  </h4>
                  <p className="text-xs text-[#8F9E8B] mt-1">View your shopping cart</p>
                </div>
              </Link>
              <Link href="/wishlist">
                <div className="bg-white rounded-sm p-6 hover:shadow-md transition-shadow cursor-pointer" data-testid="link-profile-wishlist">
                  <Heart className="w-6 h-6 text-[#2F4836] mb-3" />
                  <h4 className="font-heading text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    My Wishlist
                  </h4>
                  <p className="text-xs text-[#8F9E8B] mt-1">View saved plants</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
