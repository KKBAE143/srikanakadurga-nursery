import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, type ReactNode } from "react";
import { Shield, Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !adminLoading) {
      if (!user) {
        setLocation("/login");
      } else if (!isAdmin) {
        setLocation("/");
      }
    }
  }, [user, loading, isAdmin, adminLoading, setLocation]);

  // Show loading state
  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#EAEFE9] rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#2F4836] animate-spin" />
          </div>
          <p className="text-[#8F9E8B]">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">
            Access Denied
          </h1>
          <p className="text-[#8F9E8B] mb-6">
            You don't have permission to access the admin panel. Please contact the administrator if you believe this is a mistake.
          </p>
          <button
            onClick={() => setLocation("/")}
            className="bg-[#2F4836] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#243a2b] transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
