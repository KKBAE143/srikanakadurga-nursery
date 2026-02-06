import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { migrateDataToFirestore } from "@/lib/data";
import {
  Save,
  Loader2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Database,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface GeneralSettings {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  businessHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

const defaultSettings: GeneralSettings = {
  businessName: "Sri Kanakadurga Nursery",
  tagline: "Bringing Nature Home",
  phone: "+91 98765 43210",
  email: "hello@skdnursery.com",
  whatsapp: "+919876543210",
  address: {
    street: "Ramanthapur",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500013",
  },
  businessHours: "Mon-Sat: 8AM - 7PM",
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  },
};

export default function Settings() {
  const [settings, setSettings] = useState<GeneralSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ products: number; blogs: number } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() } as GeneralSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "general"), {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.uid,
      });
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMigration = async () => {
    if (!window.confirm("This will seed your Firestore database with the default products and blog posts. Existing items with the same IDs will be overwritten. Continue?")) {
      return;
    }

    setMigrating(true);
    setMigrationResult(null);
    try {
      const result = await migrateDataToFirestore();
      setMigrationResult(result);
      toast({
        title: "Migration complete",
        description: `Successfully migrated ${result.products} products and ${result.blogs} blog posts.`,
      });
    } catch (error) {
      console.error("Migration error:", error);
      toast({
        title: "Migration failed",
        description: "An error occurred during migration. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#2F4836] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Settings"
      subtitle="Manage your store settings and business information"
      actions={
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2F4836] text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#243a2b] transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      }
    >
      <div className="max-w-3xl space-y-6">
        {/* Business Info */}
        <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#2F4836]" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                Business Information
              </h2>
              <p className="text-sm text-[#8F9E8B]">Basic details about your nursery</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings((prev) => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings((prev) => ({ ...prev, tagline: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#2F4836]" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                Contact Information
              </h2>
              <p className="text-sm text-[#8F9E8B]">How customers can reach you</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8F9E8B]" />
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8F9E8B]" />
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#8F9E8B]" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings((prev) => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="+919876543210"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8F9E8B]" />
                Business Hours
              </label>
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => setSettings((prev) => ({ ...prev, businessHours: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#2F4836]" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Address</h2>
              <p className="text-sm text-[#8F9E8B]">Your nursery location</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Street</label>
              <input
                type="text"
                value={settings.address.street}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">City</label>
              <input
                type="text"
                value={settings.address.city}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">State</label>
              <input
                type="text"
                value={settings.address.state}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Pincode</label>
              <input
                type="text"
                value={settings.address.pincode}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    address: { ...prev.address, pincode: e.target.value },
                  }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#EAEFE9] rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#2F4836]" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Social Links</h2>
              <p className="text-sm text-[#8F9E8B]">Connect with customers on social media</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </label>
              <input
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                  }))
                }
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                Instagram
              </label>
              <input
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: e.target.value },
                  }))
                }
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                <Twitter className="w-4 h-4 text-sky-500" />
                Twitter
              </label>
              <input
                type="url"
                value={settings.socialLinks.twitter}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                  }))
                }
                placeholder="https://twitter.com/yourhandle"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-600" />
                YouTube
              </label>
              <input
                type="url"
                value={settings.socialLinks.youtube}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, youtube: e.target.value },
                  }))
                }
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5ebe3] bg-[#f8faf7] text-[#1A1A1A] placeholder:text-[#8F9E8B] focus:outline-none focus:border-[#2F4836] transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Database Migration */}
        <div className="bg-white rounded-xl border border-[#e5ebe3] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Database Migration</h2>
              <p className="text-sm text-[#8F9E8B]">Seed Firestore with default products and blog posts</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">One-time setup</p>
                <p className="text-sm text-amber-700 mt-1">
                  Run this migration once to populate your Firestore database with the default 10 products and 4 blog posts. Existing items with the same IDs will be overwritten.
                </p>
              </div>
            </div>
          </div>

          {migrationResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-800 font-medium">Migration successful!</p>
                  <p className="text-sm text-emerald-700">
                    Migrated {migrationResult.products} products and {migrationResult.blogs} blog posts.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleMigration}
            disabled={migrating}
            className="px-4 py-2.5 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {migrating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Migrating...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Run Database Migration
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
