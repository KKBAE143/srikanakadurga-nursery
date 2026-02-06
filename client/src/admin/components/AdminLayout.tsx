import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  MessageSquare,
  Home,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Products", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
  { label: "Categories", href: "/admin/categories", icon: <FolderTree className="w-5 h-5" /> },
  { label: "Blog Posts", href: "/admin/blog", icon: <FileText className="w-5 h-5" /> },
  { label: "Messages", href: "/admin/messages", icon: <MessageSquare className="w-5 h-5" /> },
  { label: "Homepage", href: "/admin/homepage", icon: <Home className="w-5 h-5" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Get current page breadcrumb
  const getCurrentPage = () => {
    const item = navItems.find((item) => isActive(item.href));
    return item?.label || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-[#1a2e1f] via-[#243a2b] to-[#2F4836] shadow-2xl transition-all duration-300 flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/admin">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white">
                <img src="/logo.png" alt="SKD Nursery" className="w-8 h-8 object-contain" />
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <h1 className="font-bold text-white text-lg leading-tight whitespace-nowrap">
                    SKD Nursery
                  </h1>
                  <p className="text-white/50 text-xs">Admin Panel</p>
                </div>
              )}
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group relative
                    ${isActive(item.href)
                      ? "bg-white/15 text-white shadow-lg shadow-black/10"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <div className={`${isActive(item.href) ? "text-[#4ade80]" : "text-current"}`}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                  {item.badge && (
                    <span className="absolute right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive(item.href) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#4ade80] rounded-r-full" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-white/10 space-y-1">
          {/* View Site Link */}
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white cursor-pointer transition-all">
              <ExternalLink className="w-5 h-5" />
              {!collapsed && <span className="text-sm font-medium">View Site</span>}
            </div>
          </Link>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl mt-2">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "Admin"}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4ade80] to-[#22c55e] flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.displayName || "Admin"}
                </p>
                <p className="text-white/40 text-xs truncate">{user?.email}</p>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/20 cursor-pointer transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-[#2F4836] border-2 border-[#f5f7f4] rounded-full items-center justify-center text-white hover:bg-[#1a2e1f] transition-colors shadow-lg"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#e5ebe3]">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-[#EAEFE9] rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-[#1A1A1A]" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <Link href="/admin">
                  <span className="text-[#8F9E8B] hover:text-[#2F4836] cursor-pointer transition-colors">
                    Admin
                  </span>
                </Link>
                <ChevronRight className="w-4 h-4 text-[#8F9E8B]" />
                <span className="text-[#1A1A1A] font-medium">{getCurrentPage()}</span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#f8faf7] border border-[#e5ebe3] rounded-lg text-[#8F9E8B] hover:border-[#2F4836]/30 transition-colors">
                <Search className="w-4 h-4" />
                <span className="text-sm">Search...</span>
                <kbd className="hidden md:inline-flex px-1.5 py-0.5 text-xs bg-white border border-[#e5ebe3] rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-[#EAEFE9] rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-[#1A1A1A]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Avatar (Mobile) */}
              <div className="lg:hidden">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Admin"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#2F4836] flex items-center justify-center text-white font-medium text-sm">
                    {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Header */}
        {(title || actions) && (
          <div className="bg-white border-b border-[#e5ebe3] px-4 sm:px-6 py-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {title && (
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-[#8F9E8B] text-sm mt-1">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
