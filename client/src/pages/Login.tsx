import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { signInWithGoogle, signInWithEmail, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  if (user) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      toast({ title: "Welcome back!", description: "You have been signed in successfully." });
      setLocation("/");
    } catch (err: any) {
      const message = err.code === "auth/invalid-credential"
        ? "Invalid email or password"
        : err.code === "auth/user-not-found"
        ? "No account found with this email"
        : "Failed to sign in. Please try again.";
      toast({ title: "Sign in failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({ title: "Welcome!", description: "Signed in with Google successfully." });
      setLocation("/");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast({ title: "Sign in failed", description: "Could not sign in with Google.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEFE9]">
      <Header />

      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Leaf className="w-8 h-8 text-[#2F4836]" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] tracking-wide uppercase" data-testid="text-login-title">
              Welcome Back
            </h1>
            <p className="text-[#4A4A4A] text-sm mt-2">
              Sign in to your account
            </p>
          </div>

          <div className="bg-white rounded-sm p-8 shadow-sm">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-[#dde3dc] rounded-sm py-3 px-4 text-sm text-[#4A4A4A] font-medium hover:bg-[#f8f9f7] transition-colors mb-6"
              data-testid="button-google-login"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#eee]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#8F9E8B] uppercase tracking-wider font-heading">
                  Or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#dde3dc] rounded-sm px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#2F4836] transition-colors"
                  placeholder="you@example.com"
                  required
                  data-testid="input-login-email"
                />
              </div>
              <div>
                <label className="block text-xs font-heading font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-[#dde3dc] rounded-sm px-4 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#2F4836] transition-colors pr-10"
                    placeholder="Enter your password"
                    required
                    data-testid="input-login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F9E8B] hover:text-[#4A4A4A]"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2F4836] text-white py-3 font-heading text-sm tracking-wider uppercase hover:bg-[#3a5a44] transition-colors disabled:opacity-50"
                data-testid="button-login-submit"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-[#4A4A4A] mt-6">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-[#2F4836] font-semibold hover:underline cursor-pointer" data-testid="link-signup">
                  Sign Up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
